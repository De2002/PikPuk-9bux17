import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { AUTHORS } from "@/constants/authors";
import { Bookmark, BookMarked, Loader2, ArrowRight, Feather, Trash2 } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkRow {
  id: string;
  story_id: string;
  story_title: string;
  story_type: string;
  author_name: string;
  created_at: string;
}

// Look up cover and last chapter from static data
function getStoryCover(storyId: string): string {
  for (const author of AUTHORS) {
    const story = author.stories.find((s) => s.id === storyId);
    if (story) return story.coverUrl;
  }
  return "";
}

function getAuthorId(storyId: string): string {
  for (const author of AUTHORS) {
    const story = author.stories.find((s) => s.id === storyId);
    if (story) return author.id;
  }
  return "";
}

const Bookmarks = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/"); return; }
    supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBookmarks((data as BookmarkRow[]) ?? []);
        setLoading(false);
      });
  }, [user, authLoading, navigate]);

  const removeBookmark = async (bookmarkId: string, storyId: string) => {
    setRemoving(storyId);
    const { error } = await supabase.from("bookmarks").delete().eq("id", bookmarkId);
    if (error) {
      toast.error("Could not remove bookmark.");
    } else {
      setBookmarks((b) => b.filter((r) => r.id !== bookmarkId));
      toast.success("Bookmark removed.");
    }
    setRemoving(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center">
              <Bookmark className="w-4.5 h-4.5 text-background" fill="currentColor" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-background">My Bookmarks</h1>
          </div>
          <p className="text-sm font-sans text-background/60 ml-12">
            {bookmarks.length > 0
              ? `${bookmarks.length} saved ${bookmarks.length === 1 ? "story" : "stories"}`
              : "Your saved stories will appear here"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {bookmarks.length === 0 ? (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center text-center py-24 gap-6">
            <div className="w-20 h-20 rounded-full bg-secondary border border-border flex items-center justify-center">
              <Feather className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                No bookmarks yet
              </h2>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed max-w-xs">
                Save novels as you browse to build your personal reading list. Tap the{" "}
                <Bookmark className="w-3.5 h-3.5 inline -mt-0.5" /> icon on any story page.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-sans font-semibold hover:bg-foreground/90 transition-all"
            >
              <BookMarked className="w-4 h-4" />
              Explore Authors
            </Link>
          </div>
        ) : (
          /* ── Bookmarks List ── */
          <div className="space-y-3">
            {bookmarks.map((bm) => {
              const cover = getStoryCover(bm.story_id);
              const authorId = getAuthorId(bm.story_id);
              const isNovel = bm.story_type === "novel";
              const readLink = isNovel
                ? `/story/${bm.story_id}/chapters`
                : `/story/${bm.story_id}/read`;
              const isRemoving = removing === bm.story_id;

              return (
                <div
                  key={bm.id}
                  className="group flex items-center gap-4 bg-card rounded-xl border border-border p-4 hover:border-foreground/20 transition-all"
                >
                  {/* Cover */}
                  <Link to={`/story/${bm.story_id}`} className="flex-shrink-0">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-secondary border border-border shadow-sm">
                      {cover ? (
                        <img
                          src={cover}
                          alt={bm.story_title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Feather className="w-4 h-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/story/${bm.story_id}`}>
                      <h3 className="font-serif text-base font-semibold text-foreground leading-snug hover:text-accent transition-colors line-clamp-1">
                        {bm.story_title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {authorId ? (
                        <Link
                          to={`/author/${authorId}`}
                          className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {bm.author_name}
                        </Link>
                      ) : (
                        <span className="text-xs font-sans text-muted-foreground">{bm.author_name}</span>
                      )}
                      <span className={cn(
                        "text-[10px] font-sans px-2 py-0.5 rounded-full",
                        isNovel ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-700"
                      )}>
                        {isNovel ? "Novel" : "Short Story"}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-muted-foreground/60 mt-1.5">
                      Saved {new Date(bm.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={readLink}
                      className="hidden sm:flex items-center gap-1.5 text-xs font-sans font-semibold text-foreground bg-secondary hover:bg-border px-3.5 py-2 rounded-full transition-all"
                    >
                      Resume Reading
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={readLink}
                      className="sm:hidden w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors"
                      aria-label="Resume reading"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => removeBookmark(bm.id, bm.story_id)}
                      disabled={isRemoving}
                      aria-label="Remove bookmark"
                      className="w-9 h-9 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                    >
                      {isRemoving
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Bookmarks;
