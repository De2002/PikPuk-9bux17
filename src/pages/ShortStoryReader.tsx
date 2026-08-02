import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { AUTHORS } from "@/constants/authors";
import { Story, Author } from "@/types";
import { ArrowLeft, BookOpen, Clock, Minus, Plus, Sun, Moon, MessageSquare, Users, BookA } from "lucide-react";
import koalaImg from "@/assets/koala-companion.png";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import SignupSlide from "@/components/features/SignupSlide";
import AuthModal from "@/components/features/AuthModal";
import BookCompanion from "@/components/features/BookCompanion";

type Theme = "light" | "sepia" | "dark";
type FontSize = "sm" | "md" | "lg" | "xl";

const FONT_SIZES: Record<FontSize, string> = {
  sm: "text-base leading-8",
  md: "text-lg leading-9",
  lg: "text-xl leading-10",
  xl: "text-2xl leading-[2.8rem]",
};

const THEMES: Record<Theme, {
  bg: string; text: string; subtle: string; border: string;
  toolbar: string; divider: string; tag: string; blockquote: string; progress: string;
}> = {
  light: { bg: "bg-[#fafaf8]", text: "text-gray-900", subtle: "text-gray-500", border: "border-gray-200", toolbar: "bg-[#fafaf8]/95 border-gray-200", divider: "bg-gray-200", tag: "bg-gray-100 text-gray-600 border-gray-200", blockquote: "border-gray-300 bg-gray-50", progress: "bg-gray-900" },
  sepia: { bg: "bg-[#f5f0e8]", text: "text-[#3b2f1e]", subtle: "text-[#8b7355]", border: "border-[#d9cebf]", toolbar: "bg-[#f5f0e8]/95 border-[#d9cebf]", divider: "bg-[#d9cebf]", tag: "bg-[#ede6d8] text-[#6b5840] border-[#d9cebf]", blockquote: "border-[#c4a97d] bg-[#ede6d8]", progress: "bg-[#8b6f47]" },
  dark: { bg: "bg-[#181818]", text: "text-[#e2e2e2]", subtle: "text-[#777]", border: "border-[#2e2e2e]", toolbar: "bg-[#181818]/95 border-[#2e2e2e]", divider: "bg-[#2e2e2e]", tag: "bg-[#252525] text-[#999] border-[#2e2e2e]", blockquote: "border-[#3a3a3a] bg-[#1e1e1e]", progress: "bg-[#e2e2e2]" },
};

// Track short story reads per week in localStorage
const SS_KEY = "pikpuk_ss_reads";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getSSReads(): { count: number; weekStart: number; ids: string[] } {
  try {
    const raw = localStorage.getItem(SS_KEY);
    if (!raw) return { count: 0, weekStart: Date.now(), ids: [] };
    const parsed = JSON.parse(raw);
    // Reset if week has passed
    if (Date.now() - parsed.weekStart > ONE_WEEK_MS) {
      return { count: 0, weekStart: Date.now(), ids: [] };
    }
    return parsed;
  } catch {
    return { count: 0, weekStart: Date.now(), ids: [] };
  }
}

function recordSSRead(storyId: string) {
  const reads = getSSReads();
  if (!reads.ids.includes(storyId)) {
    reads.count += 1;
    reads.ids.push(storyId);
  }
  localStorage.setItem(SS_KEY, JSON.stringify(reads));
}

const ShortStoryReader = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [slideOpen, setSlideOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"signup" | "signin">("signup");
  const [companionOpen, setCompanionOpen] = useState(false);
  const [companionTab, setCompanionTab] = useState<"ask" | "character" | "vocabulary">("ask");
  const [iconsVisible, setIconsVisible] = useState(false);
  const [iconPos, setIconPos] = useState({ x: 0, y: 0 });
  const iconsDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasShownSlide = useRef(false);

  let story: Story | null = null;
  let author: Author | null = null;
  let storyIndex = 1;

  for (const a of AUTHORS) {
    const shortStories = a.stories.filter((s) => s.type === "short-story");
    const found = shortStories.findIndex((s) => s.id === id);
    if (found !== -1) {
      story = shortStories[found];
      author = a;
      storyIndex = found + 1;
      break;
    }
  }

  // Check if guest has exceeded 1 free short story per week
  const isGuestLimitReached = !user && id ? (() => {
    const reads = getSSReads();
    return reads.count >= 1 && !reads.ids.includes(id);
  })() : false;

  useEffect(() => {
    if (!story || !author) return;
    document.title = `${story.title} by ${author.name} — PikPuk Classics`;
    window.scrollTo({ top: 0 });
    // Record the read for guests
    if (!user && id) recordSSRead(id);
    return () => { document.title = "PikPuk — Classics Library"; };
  }, [story, author, user, id]);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
      if (scrollTop > lastScrollY + 10) setToolbarVisible(false);
      else if (scrollTop < lastScrollY - 10) setToolbarVisible(true);
      setLastScrollY(scrollTop);

      // Show signup slide when guest reaches ~85% scroll
      if (!user && progress > 85 && !hasShownSlide.current) {
        hasShownSlide.current = true;
        setTimeout(() => setSlideOpen(true), 600);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, user]);

  const cycleTheme = () => {
    const order: Theme[] = ["light", "sepia", "dark"];
    setTheme(order[(order.indexOf(theme) + 1) % order.length]);
  };

  const t = THEMES[theme];
  const fsClass = FONT_SIZES[fontSize];

  if (!story || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="font-serif text-xl text-gray-800 mb-3">Story not found</p>
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 underline font-sans">Go back</button>
        </div>
      </div>
    );
  }

  // Guest weekly limit gate — full page block
  if (isGuestLimitReached) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
        <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-6">
          <BookOpen className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Come back next week</h2>
        <p className="font-sans text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
          Free readers get 1 short story per week. Create a free account for unlimited access.
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
          <button onClick={() => navigate(-1)} className="text-xs font-sans text-muted-foreground underline underline-offset-2">← Go back</button>
        </div>
        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode={authModalMode} />
      </div>
    );
  }

  const paragraphs = (story.synopsis || story.description).split(/\n\n+/).filter(Boolean);

  return (
    <div className={cn("min-h-screen transition-colors duration-300", t.bg)}>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-transparent">
        <div className={cn("h-full transition-all duration-150", t.progress)} style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Toolbar */}
      <div className={cn("fixed top-0.5 left-0 right-0 z-40 border-b backdrop-blur-sm transition-transform duration-300", t.toolbar, toolbarVisible ? "translate-y-0" : "-translate-y-full")}>
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <button onClick={() => navigate(-1)} className={cn("flex items-center gap-1.5 text-xs font-sans font-medium transition-colors flex-shrink-0", t.subtle)}>
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:block">Back</span>
          </button>
          <p className={cn("font-serif text-sm font-semibold truncate flex-1 text-center", t.text)}>{story.title}</p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={() => { const o: FontSize[] = ["sm","md","lg","xl"]; const i = o.indexOf(fontSize); if (i > 0) setFontSize(o[i-1]); }} disabled={fontSize === "sm"} className={cn("w-8 h-8 rounded-lg flex items-center justify-center", t.subtle, fontSize === "sm" && "opacity-30")} aria-label="Decrease font"><Minus className="w-3.5 h-3.5" /></button>
            <button onClick={() => { const o: FontSize[] = ["sm","md","lg","xl"]; const i = o.indexOf(fontSize); if (i < o.length-1) setFontSize(o[i+1]); }} disabled={fontSize === "xl"} className={cn("w-8 h-8 rounded-lg flex items-center justify-center", t.subtle, fontSize === "xl" && "opacity-30")} aria-label="Increase font"><Plus className="w-3.5 h-3.5" /></button>
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
      {iconsVisible && (() => {
        const top = Math.max(80, Math.min(iconPos.y - 70, window.innerHeight - 180));
        const left = Math.min(iconPos.x + 16, window.innerWidth - 56);
        return (
          <div
            className="fixed z-40 flex flex-col gap-2.5 pointer-events-none"
            style={{ top: `${top}px`, left: `${left}px` }}
          >
            {([
              { id: "ask" as const, Icon: MessageSquare, label: "Ask" },
              { id: "character" as const, Icon: Users, label: "Characters" },
              { id: "vocabulary" as const, Icon: BookA, label: "Vocabulary" },
            ] as const).map(({ id: tabId, Icon, label }, idx) => (
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
        );
      })()}

      {/* Reading Content */}
      <main
        className="max-w-2xl mx-auto px-6 pt-24 pb-32"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a, button, nav")) return;
          if (iconsDismissTimer.current) clearTimeout(iconsDismissTimer.current);
          setIconPos({ x: e.clientX, y: e.clientY });
          setIconsVisible(true);
          iconsDismissTimer.current = setTimeout(() => setIconsVisible(false), 3000);
        }}
      >
        <header className="mb-16 text-center">
          <div className={cn("w-16 h-16 rounded-2xl border-2 flex items-center justify-center mx-auto mb-8", t.border)}>
            <span className={cn("font-serif text-3xl font-bold", t.subtle)}>{storyIndex}</span>
          </div>
          <p className={cn("font-sans text-xs tracking-[0.25em] uppercase mb-3", t.subtle)}>Short Story · {story.year}</p>
          <h1 className={cn("font-serif text-3xl md:text-4xl font-bold leading-tight mb-4", t.text)}>{story.title}</h1>
          <Link to={`/author/${author.id}`} className={cn("inline-flex items-center gap-1.5 text-sm font-sans transition-colors mb-6", t.subtle)}>
            {author.name}
          </Link>
          <div className="flex items-center justify-center gap-5 mt-2">
            <div className={cn("flex items-center gap-1.5 text-xs font-sans", t.subtle)}><BookOpen className="w-3.5 h-3.5" /><span>{story.genre}</span></div>
            {story.readTime && <div className={cn("flex items-center gap-1.5 text-xs font-sans", t.subtle)}><Clock className="w-3.5 h-3.5" /><span>{story.readTime} read</span></div>}
          </div>
          <div className={cn("w-16 h-0.5 mx-auto mt-10", t.divider)} />
        </header>

        <section className={cn("font-serif mb-16", fsClass, t.text)}>
          {paragraphs.map((para, i) => (
            <p key={i} className={cn("mb-8", i === 0 && "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:mt-1", t.text)}>
              {para.trim()}
            </p>
          ))}
        </section>

        {story.themes && story.themes.length > 0 && (
          <section className="mb-14">
            <div className={cn("h-px mb-8", t.divider)} />
            <p className={cn("font-sans text-xs tracking-[0.2em] uppercase mb-5", t.subtle)}>Key Themes</p>
            <div className="flex flex-wrap gap-2">
              {story.themes.map((theme) => (
                <span key={theme} className={cn("text-xs font-sans px-3 py-1.5 rounded-full border", t.tag)}>{theme}</span>
              ))}
            </div>
          </section>
        )}

        {story.quotes && story.quotes.length > 0 && (
          <section className="mb-14">
            <div className={cn("h-px mb-8", t.divider)} />
            <p className={cn("font-sans text-xs tracking-[0.2em] uppercase mb-6", t.subtle)}>Notable Quotes</p>
            <div className="space-y-6">
              {story.quotes.map((q, i) => (
                <blockquote key={i} className={cn("rounded-xl border-l-[3px] px-5 py-4", t.blockquote)}>
                  <p className={cn("font-serif text-base italic leading-relaxed mb-2", t.text)}>"{q.text}"</p>
                  {q.context && <footer className={cn("text-xs font-sans", t.subtle)}>{q.context}</footer>}
                </blockquote>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="flex items-center gap-4 w-full">
            <div className={cn("flex-1 h-px", t.divider)} />
            <span className={cn("font-serif text-lg", t.subtle)}>∎</span>
            <div className={cn("flex-1 h-px", t.divider)} />
          </div>
          <Link to={`/author/${author.id}`} className={cn("inline-flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-sans font-medium transition-all", t.border, t.text)}>
            <ArrowLeft className="w-4 h-4" />
            More by {author.name.split(" ").pop()}
          </Link>
        </div>
      </main>

      {/* Signup slide at end */}
      {!user && (
        <SignupSlide
          open={slideOpen}
          onClose={() => setSlideOpen(false)}
          context="short-story"
          onSignup={() => { setSlideOpen(false); setAuthModalMode("signup"); setAuthModalOpen(true); }}
          onSignin={() => { setSlideOpen(false); setAuthModalMode("signin"); setAuthModalOpen(true); }}
        />
      )}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode={authModalMode} />

      {/* Book Companion */}
      <BookCompanion
        open={companionOpen}
        onClose={() => setCompanionOpen(false)}
        storyId={id ?? ""}
        storyTitle={story.title}
        authorName={author.name}
        currentChapter={1}
        theme={theme}
        initialTab={companionTab}
      />
    </div>
  );
};

export default ShortStoryReader;
