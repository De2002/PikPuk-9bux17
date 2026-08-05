import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useCmsAuthors } from "@/hooks/useCmsData";
import { Story, Author } from "@/types";
import Navbar from "@/components/layout/Navbar";
import StoryCard from "@/components/features/StoryCard";
import { ArrowLeft, BookOpen, Clock, Tag, Quote, Lightbulb, BookMarked, Share2, Bookmark, Loader2 } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface StoryWithAuthor {
  story: Story;
  author: Author;
}

function getRelatedStories(
  currentStoryId: string,
  currentAuthorId: string,
  genre: string,
  allAuthors: Author[]
): StoryWithAuthor[] {
  const results: StoryWithAuthor[] = [];
  for (const author of allAuthors) {
    for (const story of author.stories) {
      if (story.id === currentStoryId) continue;
      const isSameAuthor = author.id === currentAuthorId;
      const isSameGenre = story.genre.toLowerCase() === genre.toLowerCase();
      if (isSameAuthor || isSameGenre) {
        results.push({ story, author });
      }
    }
  }
  const sameAuthor = results.filter((r) => r.author.id === currentAuthorId);
  const sameGenre = results.filter((r) => r.author.id !== currentAuthorId);
  return [...sameAuthor, ...sameGenre].slice(0, 4);
}

const StoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { authors, loading: authorsLoading } = useCmsAuthors();
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Derive found directly — no intermediate state, no flash
  let found: StoryWithAuthor | null | undefined = undefined;
  if (!authorsLoading) {
    found = null;
    for (const author of authors) {
      const story = author.stories.find((s) => s.id === id);
      if (story) { found = { story, author }; break; }
    }
  }

  // Load bookmark state
  useEffect(() => {
    if (!user || !id) return;
    supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("story_id", id)
      .maybeSingle()
      .then(({ data }) => setBookmarked(!!data));
  }, [user, id]);

  // JSON-LD schema
  useEffect(() => {
    if (!found) return;
    const { story, author } = found;
    const schema = {
      "@context": "https://schema.org",
      "@type": story.type === "novel" ? "Book" : "CreativeWork",
      "name": story.title,
      "author": {
        "@type": "Person",
        "name": author.name,
        "birthDate": String(author.born),
        "deathDate": author.died ? String(author.died) : undefined,
        "nationality": author.nationality,
      },
      "datePublished": String(story.year),
      "genre": story.genre,
      "description": story.synopsis || story.description,
      "numberOfPages": story.pages,
      "inLanguage": "en",
      "publisher": { "@type": "Organization", "name": "Inktella Classics Library" },
      "image": story.coverUrl,
      "url": `https://inktella.onspace.app/story/${story.id}`,
    };
    const script = document.createElement("script");
    script.id = "story-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
    return () => {
      const toRemove = document.getElementById("story-schema");
      if (toRemove) toRemove.remove();
    };
  }, [found]);

  const toggleBookmark = async () => {
    if (!user || !found || bookmarkLoading) return;
    setBookmarkLoading(true);
    const { story, author } = found;
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("story_id", story.id);
      setBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({
        user_id: user.id,
        story_id: story.id,
        story_title: story.title,
        story_type: story.type,
        author_name: author.name,
      });
      setBookmarked(true);
    }
    setBookmarkLoading(false);
  };

  // Show spinner while loading OR while data hasn't resolved yet
  if (authorsLoading || found === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!found) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="font-serif text-2xl text-foreground mb-2">Story not found</p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground font-sans underline">
              Return to Authors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { story, author } = found;
  const related = getRelatedStories(story.id, author.id, story.genre, authors);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{story.title} by {author.name} — Inktella</title>
        <meta name="description" content={story.description} />
        <meta name="keywords" content={`${story.title}, ${author.name}, ${story.genre}, ${story.type === "novel" ? "novel" : "short story"}, classics`} />
        <meta property="og:type" content="book" />
        <meta property="og:url" content={`https://inktella.onspace.app/story/${story.id}`} />
        <meta property="og:title" content={`${story.title} by ${author.name}`} />
        <meta property="og:description" content={story.synopsis || story.description} />
        <meta property="og:image" content={story.coverUrl} />
        <meta property="book:author" content={author.name} />
        <meta property="book:release_date" content={String(story.year)} />
        <meta property="book:tag" content={story.genre} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${story.title} by ${author.name}`} />
        <meta name="twitter:description" content={story.description} />
        <meta name="twitter:image" content={story.coverUrl} />
      </Helmet>
      <Navbar />

      {/* Hero Header */}
      <div className="bg-foreground text-background">
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-background/50 text-xs font-sans mb-6">
            <button onClick={() => navigate("/")} className="hover:text-background transition-colors">Authors</button>
            <span>/</span>
            <Link to={`/author/${author.id}`} className="hover:text-background transition-colors">{author.name}</Link>
            <span>/</span>
            <span className="text-background/80">{story.title}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Cover */}
            <div className="flex-shrink-0">
              <div className="w-32 h-44 sm:w-36 sm:h-52 rounded-xl overflow-hidden shadow-2xl border border-background/10">
                <img src={story.coverUrl} alt={story.title} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-sans font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-background/10 text-background/70">
                  {story.type === "novel" ? "Novel" : "Short Story"}
                </span>
                <span className="text-xs font-sans text-background/50">{story.year}</span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-background leading-tight mb-2">
                {story.title}
              </h1>
              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-5">
                <Link
                  to={story.type === "short-story" ? `/story/${story.id}/read` : `/story/${story.id}/chapters`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-background text-foreground rounded-full text-sm font-sans font-semibold hover:bg-background/90 transition-all shadow-sm"
                >
                  <BookMarked className="w-4 h-4" />
                  Read Online
                </Link>
                {story.type === "novel" && user && (
                  <button
                    onClick={toggleBookmark}
                    disabled={bookmarkLoading}
                    aria-label={bookmarked ? "Remove bookmark" : "Bookmark story"}
                    className={cn(
                      "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
                      bookmarked
                        ? "border-background/60 bg-background/20 text-background"
                        : "border-background/30 text-background/60 hover:border-background/60 hover:text-background"
                    )}
                  >
                    <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: `${story.title} by ${author.name}`, text: story.description, url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-background/30 text-background/80 hover:text-background hover:border-background/60 text-sm font-sans font-medium transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-background/60 text-sm font-sans">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{story.genre}</span>
                </div>
                {story.pages && (
                  <div className="flex items-center gap-1.5 text-background/60 text-sm font-sans">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{story.pages} pages</span>
                  </div>
                )}
                {story.readTime && (
                  <div className="flex items-center gap-1.5 text-background/60 text-sm font-sans">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{story.readTime} read</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left: Synopsis + Quotes */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Synopsis
              </h2>
              <div className="h-px bg-border mb-5" />
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="text-base text-foreground/80 font-sans leading-[1.85] mb-5" {...props} />
                    ),
                    h1: ({ node, ...props }) => (
                      <h3 className="font-serif text-lg font-semibold text-foreground mt-6 mb-3" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h4 className="font-serif text-base font-semibold text-foreground mt-5 mb-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h5 className="font-serif text-base font-semibold text-foreground mt-4 mb-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-5 text-foreground/80 font-sans text-base space-y-1.5" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-5 text-foreground/80 font-sans text-base space-y-1.5" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold text-foreground" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-foreground/80" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote className="border-l-[3px] border-accent/60 pl-4 italic text-foreground/70 font-sans my-5" {...props} />
                    ),
                  }}
                >
                  {story.synopsis || story.description}
                </ReactMarkdown>
              </div>
            </section>

            {story.quotes && story.quotes.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Quote className="w-5 h-5 text-accent" />
                  Notable Quotes
                </h2>
                <div className="h-px bg-border mb-5" />
                <div className="space-y-5">
                  {story.quotes.map((q, i) => (
                    <blockquote key={i} className="relative pl-5 border-l-[3px] border-accent/60">
                      <p className="font-serif text-base italic text-foreground leading-relaxed mb-2">"{q.text}"</p>
                      {q.context && (
                        <footer className="text-xs text-muted-foreground font-sans">{q.context}</footer>
                      )}
                    </blockquote>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: Themes + Author Card */}
          <div className="space-y-8">
            {story.themes && story.themes.length > 0 && (
              <section>
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  Key Themes
                </h2>
                <div className="h-px bg-border mb-4" />
                <div className="flex flex-wrap gap-2">
                  {story.themes.map((theme) => (
                    <span key={theme} className="text-xs font-sans font-medium px-3 py-1.5 rounded-full bg-secondary text-foreground/80 border border-border hover:border-foreground/20 transition-colors cursor-default">
                      {theme}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Author Sidebar */}
            <section className="rounded-xl border border-border p-5 bg-card">
              <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-3">About the Author</p>
              <Link to={`/author/${author.id}`} className="flex items-start gap-3 group mb-4">
                <div className="w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  <img src={author.portrait} alt={author.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div>
                  <p className="font-serif font-semibold text-foreground group-hover:text-accent transition-colors leading-tight mb-0.5">
                    {author.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {author.nationality} · {author.born}–{author.died ?? ""}
                  </p>
                </div>
              </Link>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed line-clamp-4 mb-4">
                {author.shortBio}
              </p>
              <Link to={`/author/${author.id}`} className="text-xs font-sans font-medium text-foreground hover:text-accent transition-colors underline underline-offset-2">
                View all works by {author.name.split(" ").pop()}
              </Link>
            </section>
          </div>
        </div>

        {/* You May Also Like */}
        {related.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-serif text-xl font-semibold text-foreground whitespace-nowrap">You May Also Like</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(({ story: relStory, author: relAuthor }) => {
                let relIndex: number | undefined;
                if (relStory.type === "short-story") {
                  const shorts = relAuthor.stories.filter(s => s.type === "short-story");
                  relIndex = shorts.findIndex(s => s.id === relStory.id) + 1;
                }
                return (
                  <div key={relStory.id}>
                    <p className="text-[10px] font-sans text-muted-foreground uppercase tracking-widest mb-1.5 pl-1">
                      {relAuthor.id === author.id ? "Same Author" : `Similar Genre · ${relAuthor.name}`}
                    </p>
                    <StoryCard story={relStory} storyIndex={relIndex} />
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default StoryDetail;
