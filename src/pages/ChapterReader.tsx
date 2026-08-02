import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { AUTHORS } from "@/constants/authors";
import { STORY_CHAPTERS } from "@/constants/chapters";
import { Chapter, Story } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  List,
  Sun,
  Moon,
  BookOpen,
  Lock,
  MessageSquare,
  Users,
  BookA,
} from "lucide-react";
import koalaImg from "@/assets/koala-companion.png";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/features/AuthModal";
import SignupSlide from "@/components/features/SignupSlide";
import BookCompanion from "@/components/features/BookCompanion";

const SWIPE_THRESHOLD = 60;

type Theme = "light" | "sepia" | "dark";
type FontSize = "sm" | "md" | "lg" | "xl";

const FONT_SIZES: Record<FontSize, string> = {
  sm: "text-base leading-8",
  md: "text-lg leading-9",
  lg: "text-xl leading-10",
  xl: "text-2xl leading-[2.8rem]",
};

const THEMES: Record<Theme, { bg: string; text: string; subtle: string; border: string; toolbar: string; progress: string }> = {
  light: { bg: "bg-white", text: "text-gray-900", subtle: "text-gray-500", border: "border-gray-200", toolbar: "bg-white/95 border-gray-200", progress: "bg-gray-900" },
  sepia: { bg: "bg-[#f4efe6]", text: "text-[#3b2f1e]", subtle: "text-[#7a6650]", border: "border-[#d9cebf]", toolbar: "bg-[#f4efe6]/95 border-[#d9cebf]", progress: "bg-[#8b6f47]" },
  dark: { bg: "bg-[#1a1a1a]", text: "text-[#e8e8e8]", subtle: "text-[#888]", border: "border-[#333]", toolbar: "bg-[#1a1a1a]/95 border-[#333]", progress: "bg-[#e8e8e8]" },
};

const COMPANION_ICONS = [
  { id: "ask" as const, Icon: MessageSquare, label: "Ask" },
  { id: "character" as const, Icon: Users, label: "Characters" },
  { id: "vocabulary" as const, Icon: BookA, label: "Vocabulary" },
];

const ChapterReader = () => {
  const { id, chapterNum } = useParams<{ id: string; chapterNum: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [swipeHint, setSwipeHint] = useState<"prev" | "next" | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signup" | "signin">("signup");
  const [slideOpen, setSlideOpen] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
  const [companionTab, setCompanionTab] = useState<"ask" | "character" | "vocabulary">("ask");
  const [iconsVisible, setIconsVisible] = useState(false);
  const [iconPos, setIconPos] = useState({ x: 0, y: 0 });
  const iconsDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const chapterIndex = parseInt(chapterNum ?? "1", 10);

  let storyTitle = "";
  let authorName = "";
  let storyObj: Story | undefined;

  for (const author of AUTHORS) {
    const found = author.stories.find((s) => s.id === id);
    if (found) {
      storyTitle = found.title;
      authorName = author.name;
      storyObj = found;
      break;
    }
  }

  const [freeChapters, setFreeChapters] = useState<number>(storyObj?.freeChapters ?? 99);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Load admin-configured free chapters from DB
  useEffect(() => {
    if (!id) { setSettingsLoaded(true); return; }
    import("@/lib/supabase").then(({ supabase }) => {
      supabase
        .from("story_settings")
        .select("free_chapters, is_active")
        .eq("story_id", id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setFreeChapters(data.free_chapters);
          setSettingsLoaded(true);
        });
    });
  }, [id]);

  const isLocked = settingsLoaded && !user && chapterIndex > freeChapters;

  const chapters: Chapter[] = id ? STORY_CHAPTERS[id] ?? [] : [];
  const chapter = chapters.find((c) => c.number === chapterIndex);
  const prevChapter = chapters.find((c) => c.number === chapterIndex - 1);
  const nextChapter = chapters.find((c) => c.number === chapterIndex + 1);

  // Open slide gate when locked chapter is reached
  useEffect(() => {
    if (isLocked) {
      const timer = setTimeout(() => setSlideOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setScrollProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
      if (scrollTop > lastScrollY + 10) setToolbarVisible(false);
      else if (scrollTop < lastScrollY - 10) setToolbarVisible(true);
      setLastScrollY(scrollTop);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setScrollProgress(0);
    setToolbarVisible(true);
  }, [chapterIndex, id]);

  // Dismiss floating icons when companion opens or reader navigates
  useEffect(() => {
    if (companionOpen) setIconsVisible(false);
  }, [companionOpen]);

  const showFloatingIcons = (clientX: number, clientY: number) => {
    if (iconsDismissTimer.current) clearTimeout(iconsDismissTimer.current);
    setIconPos({ x: clientX, y: clientY });
    setIconsVisible(true);
    iconsDismissTimer.current = setTimeout(() => setIconsVisible(false), 3000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    // Only handle horizontal swipes for chapter navigation
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (deltaX < -SWIPE_THRESHOLD && nextChapter) {
      setSwipeHint("next");
      setTimeout(() => { navigate(`/story/${id}/chapter/${nextChapter.number}`); setSwipeHint(null); }, 180);
    } else if (deltaX > SWIPE_THRESHOLD && prevChapter) {
      setSwipeHint("prev");
      setTimeout(() => { navigate(`/story/${id}/chapter/${prevChapter.number}`); setSwipeHint(null); }, 180);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const t = THEMES[theme];
  const fsClass = FONT_SIZES[fontSize];

  const cycleTheme = () => {
    const order: Theme[] = ["light", "sepia", "dark"];
    setTheme(order[(order.indexOf(theme) + 1) % order.length]);
  };



  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="font-serif text-xl text-gray-800 mb-3">Chapter not found</p>
          <Link to={`/story/${id}/chapters`} className="text-sm text-gray-500 underline font-sans">Back to chapter list</Link>
        </div>
      </div>
    );
  }

  /* ── LOCKED GATE ── */
  if (isLocked) {
    return (
      <div className={cn("min-h-screen flex flex-col items-center justify-center px-6 text-center", t.bg)}>
        <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-6">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Continue reading</h2>
        <p className="font-sans text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
          You've read the free preview. Create a free account to unlock all chapters of <em>{storyTitle}</em>.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => { setAuthModalMode("signup"); setAuthModalOpen(true); }}
            className="py-3.5 bg-foreground text-background rounded-xl font-sans font-bold text-sm hover:bg-foreground/90 transition-all"
          >
            Create Free Account
          </button>
          <button
            onClick={() => { setAuthModalMode("signin"); setAuthModalOpen(true); }}
            className="py-3 rounded-xl border border-border text-muted-foreground font-sans text-sm hover:text-foreground hover:border-foreground/30 transition-all"
          >
            Sign In
          </button>
          <Link
            to={`/story/${id}/chapters`}
            className="text-xs font-sans text-muted-foreground underline underline-offset-2 text-center"
          >
            ← Back to chapters
          </Link>
        </div>
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultMode={authModalMode}
        />
      </div>
    );
  }

  // Clamp icon cluster position so it never overflows viewport
  const iconClusterTop = Math.max(80, Math.min(iconPos.y - 70, window.innerHeight - 180));
  const iconClusterLeft = Math.min(iconPos.x + 16, window.innerWidth - 56);

  return (
    <div
      className={cn("min-h-screen transition-colors duration-300", t.bg)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe feedback overlay */}
      {swipeHint && (
        <div className={cn("fixed inset-y-0 z-50 flex items-center px-4 pointer-events-none", swipeHint === "prev" ? "left-0" : "right-0")}>
          <div className={cn("flex items-center justify-center w-12 h-12 rounded-full opacity-60", theme === "dark" ? "bg-white/10" : "bg-black/10")}>
            {swipeHint === "prev" ? <ChevronLeft className={cn("w-6 h-6", t.text)} /> : <ChevronRight className={cn("w-6 h-6", t.text)} />}
          </div>
        </div>
      )}

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-transparent">
        <div className={cn("h-full transition-all duration-150", t.progress)} style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Toolbar */}
      <div className={cn("fixed top-0.5 left-0 right-0 z-40 border-b backdrop-blur-sm transition-transform duration-300", t.toolbar, toolbarVisible ? "translate-y-0" : "-translate-y-full")}>
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to={`/story/${id}/chapters`} className={cn("flex items-center gap-1.5 text-xs font-sans font-medium transition-colors flex-shrink-0", t.subtle)}>
              <List className="w-4 h-4" />
              <span className="hidden sm:block">Chapters</span>
            </Link>
            <span className={cn("text-xs font-sans hidden md:block truncate", t.subtle)}>{storyTitle} · Ch. {chapter.number}</span>
          </div>
          <p className={cn("font-serif text-sm font-semibold truncate flex-1 text-center", t.text)}>{chapter.title}</p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => { const o: FontSize[] = ["sm","md","lg","xl"]; const i = o.indexOf(fontSize); if (i > 0) setFontSize(o[i-1]); }} disabled={fontSize === "sm"} className={cn("w-8 h-8 rounded-lg flex items-center justify-center", t.subtle, fontSize === "sm" && "opacity-30")} aria-label="Decrease font size"><Minus className="w-3.5 h-3.5" /></button>
            <button onClick={() => { const o: FontSize[] = ["sm","md","lg","xl"]; const i = o.indexOf(fontSize); if (i < o.length-1) setFontSize(o[i+1]); }} disabled={fontSize === "xl"} className={cn("w-8 h-8 rounded-lg flex items-center justify-center", t.subtle, fontSize === "xl" && "opacity-30")} aria-label="Increase font size"><Plus className="w-3.5 h-3.5" /></button>
            <button onClick={cycleTheme} className={cn("w-8 h-8 rounded-lg flex items-center justify-center", t.subtle)} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {/* Koala — opens companion directly */}
            <button
              onClick={() => setCompanionOpen((v) => !v)}
              className={cn(
                "w-8 h-8 rounded-lg overflow-hidden transition-all",
                companionOpen ? "ring-2 ring-amber-400 ring-offset-1" : "opacity-70 hover:opacity-100"
              )}
              aria-label="Book Companion"
            >
              <img src={koalaImg} alt="Book Companion" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating companion icons — appear near content tap point */}
      {iconsVisible && (
        <div
          className="fixed z-40 flex flex-col gap-2.5 pointer-events-none"
          style={{ top: `${iconClusterTop}px`, left: `${iconClusterLeft}px` }}
        >
          {COMPANION_ICONS.map(({ id: tabId, Icon, label }, idx) => (
            <button
              key={tabId}
              onClick={(e) => {
                e.stopPropagation();
                setCompanionTab(tabId);
                setIconsVisible(false);
                if (iconsDismissTimer.current) clearTimeout(iconsDismissTimer.current);
                setCompanionOpen(true);
              }}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full shadow-md pointer-events-auto",
                "transition-all animate-in fade-in zoom-in-75 duration-150",
                theme === "dark"
                  ? "bg-[#2a2a2a] text-[#e8e8e8] hover:bg-[#3a3a3a]"
                  : theme === "sepia"
                  ? "bg-[#e8e0d0] text-[#3b2f1e] hover:bg-[#ddd5c4]"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              )}
              style={{ animationDelay: `${idx * 45}ms` }}
              aria-label={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}

      {/* Main reading content */}
      <main
        className="max-w-2xl mx-auto px-6 pt-24 pb-32 select-none sm:select-auto"
        ref={contentRef}
        onClick={(e) => {
          // Don't show icons if clicking a link/button
          if ((e.target as HTMLElement).closest("a, button, nav")) return;
          showFloatingIcons(e.clientX, e.clientY);
        }}
      >
        <header className="mb-14 text-center">
          <p className={cn("font-sans text-xs tracking-[0.2em] uppercase mb-4", t.subtle)}>Chapter {chapter.number}</p>
          <h1 className={cn("font-serif text-3xl md:text-4xl font-bold leading-tight mb-6", t.text)}>{chapter.title}</h1>
          <div className={cn("w-12 h-0.5 mx-auto", t.progress, "opacity-30")} />
        </header>

        <div className={cn("font-serif", fsClass, t.text)}>
          {chapter.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-8 indent-8 first:indent-0">{paragraph.trim()}</p>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-20 mb-12">
          <div className={cn("flex-1 h-px opacity-20", theme === "dark" ? "bg-white" : "bg-gray-800")} />
          <BookOpen className={cn("w-5 h-5 opacity-30", t.subtle)} />
          <div className={cn("flex-1 h-px opacity-20", theme === "dark" ? "bg-white" : "bg-gray-800")} />
        </div>

        {/* Mobile swipe affordance */}
        <div className="flex items-center justify-center gap-4 mb-8 sm:hidden">
          {prevChapter && <div className={cn("flex items-center gap-1 text-xs font-sans", t.subtle)}><ChevronLeft className="w-3.5 h-3.5" /><span>Swipe right</span></div>}
          {prevChapter && nextChapter && <span className={cn("text-xs font-sans opacity-30", t.subtle)}>·</span>}
          {nextChapter && <div className={cn("flex items-center gap-1 text-xs font-sans", t.subtle)}><span>Swipe left</span><ChevronRight className="w-3.5 h-3.5" /></div>}
        </div>

        <nav className="flex items-center justify-between gap-4">
          {prevChapter ? (
            <Link to={`/story/${id}/chapter/${prevChapter.number}`} className={cn("flex items-center gap-2 px-5 py-3 rounded-xl border font-sans text-sm font-medium transition-all hover:opacity-80", t.border, t.text)}>
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span className="text-left"><span className={cn("block text-xs mb-0.5", t.subtle)}>Previous</span><span className="line-clamp-1">{prevChapter.title}</span></span>
            </Link>
          ) : <div />}

          {nextChapter ? (
            !user && nextChapter.number > freeChapters ? (
              <button
                onClick={() => setSlideOpen(true)}
                className={cn("flex items-center gap-2 px-5 py-3 rounded-xl border font-sans text-sm font-medium transition-all hover:opacity-80 text-right", t.border, t.text)}
              >
                <span className="text-right"><span className={cn("block text-xs mb-0.5", t.subtle)}>Next · Free account needed</span><span className="line-clamp-1">{nextChapter.title}</span></span>
                <Lock className="w-4 h-4 flex-shrink-0" />
              </button>
            ) : (
              <Link to={`/story/${id}/chapter/${nextChapter.number}`} className={cn("flex items-center gap-2 px-5 py-3 rounded-xl border font-sans text-sm font-medium transition-all hover:opacity-80 text-right", t.border, t.text)}>
                <span className="text-right"><span className={cn("block text-xs mb-0.5", t.subtle)}>Next</span><span className="line-clamp-1">{nextChapter.title}</span></span>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </Link>
            )
          ) : (
            <div className="text-right">
              <p className={cn("text-sm font-serif italic", t.subtle)}>End of available chapters</p>
              <Link to={`/story/${id}`} className={cn("text-xs font-sans underline mt-1 block", t.subtle)}>Back to {storyTitle}</Link>
            </div>
          )}
        </nav>
      </main>

      {/* Signup slide */}
      <SignupSlide
        open={slideOpen}
        onClose={() => setSlideOpen(false)}
        context="novel-chapter"
        onSignup={() => { setSlideOpen(false); setAuthModalMode("signup"); setAuthModalOpen(true); }}
        onSignin={() => { setSlideOpen(false); setAuthModalMode("signin"); setAuthModalOpen(true); }}
      />
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode={authModalMode} />

      {/* Book Companion */}
      <BookCompanion
        open={companionOpen}
        onClose={() => setCompanionOpen(false)}
        storyId={id ?? ""}
        storyTitle={storyTitle}
        authorName={authorName}
        currentChapter={chapterIndex}
        theme={theme}
        initialTab={companionTab}
      />
    </div>
  );
};

export default ChapterReader;
