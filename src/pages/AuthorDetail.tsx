import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useCmsAuthors } from "@/hooks/useCmsData";
import Navbar from "@/components/layout/Navbar";
import StoryCard from "@/components/features/StoryCard";
import FAQAccordion from "@/components/features/FAQAccordion";
import { ArrowLeft, BookOpen, FileText, Globe, Calendar, Loader2 } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

type StoryTab = "novels" | "short-stories";

const AuthorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { authors, loading } = useCmsAuthors();
  const [activeTab, setActiveTab] = useState<StoryTab>("novels");
  const [portraitLoaded, setPortraitLoaded] = useState(true);

  // Derive author directly — no intermediate state, no flash
  const author = loading ? undefined : (authors.find((a) => a.id === id) ?? null);

  // SEO Metadata — moved before early returns to comply with Rules of Hooks
  useEffect(() => {
    if (!author) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": author.name,
      "birthDate": String(author.born),
      "deathDate": author.died ? String(author.died) : undefined,
      "nationality": author.nationality,
      "image": author.portrait,
      "description": author.shortBio,
      "url": `https://inktella.onspace.app/author/${author.id}`,
      "knowsAbout": author.stories.map(s => ({
        "@type": s.type === "novel" ? "Book" : "CreativeWork",
        "name": s.title,
        "genre": s.genre,
      })),
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
    return () => script.remove();
  }, [author]);

  if (loading || author === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="font-serif text-2xl text-foreground mb-2">Author not found</p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground font-sans underline">
              Return to Authors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const novels = author.stories.filter((s) => s.type === "novel");
  const shortStories = author.stories.filter((s) => s.type === "short-story");
  const lifespan = author.died
    ? `${author.born} – ${author.died}`
    : `b. ${author.born}`;

  const description = `${author.name} (${lifespan}) - ${author.shortBio}`;
  const authorWorks = `${novels.length} novel${novels.length !== 1 ? "s" : ""} and ${shortStories.length} short stor${shortStories.length !== 1 ? "ies" : "y"}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{author.name} — Inktella Classics</title>
        <meta name="description" content={`${author.name}, ${author.nationality} author. Explore ${authorWorks} by this classic author.`} />
        <meta name="keywords" content={`${author.name}, ${author.nationality}, author, classics, ${author.stories.map(s => s.genre).join(", ")}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://inktella.onspace.app/author/${author.id}`} />
        <meta property="og:title" content={`${author.name} — Inktella`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={author.portrait} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${author.name} — Inktella`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={author.portrait} />
      </Helmet>
      <Navbar />

      {/* Author Header */}
      <div className="bg-foreground text-background">
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-10">
          {/* Back */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-background/60 hover:text-background text-sm font-sans transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All Authors
          </Link>

          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 sm:gap-7">
            {/* Portrait */}
            <div className="flex-shrink-0">
              <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden border-2 border-background/20 shadow-xl bg-background/20">
                {portraitLoaded && (
                  <img
                    src={author.portrait}
                    alt={author.name}
                    className="w-full h-full object-cover object-top"
                    onError={() => setPortraitLoaded(false)}
                  />
                )}
                {!portraitLoaded && (
                  <div className="w-full h-full bg-gradient-to-br from-background/30 to-background/10 flex items-center justify-center">
                    <div className="text-background/30 text-center">
                      <div className="text-2xl mb-1">👤</div>
                      <div className="text-xs">No image</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-background leading-tight mb-3">
                {author.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
                <div className="flex items-center gap-1.5 text-background/70 text-sm font-sans bg-background/10 px-3 py-1.5 rounded-full">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{author.nationality}</span>
                </div>
                <div className="flex items-center gap-1.5 text-background/70 text-sm font-sans bg-background/10 px-3 py-1.5 rounded-full">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{lifespan}</span>
                </div>
                <div className="flex items-center gap-1.5 text-background/70 text-sm font-sans bg-background/10 px-3 py-1.5 rounded-full">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{author.novelCount} novel{author.novelCount !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-1.5 text-background/70 text-sm font-sans bg-background/10 px-3 py-1.5 rounded-full">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{author.shortStoryCount} short {author.shortStoryCount !== 1 ? "stories" : "story"}</span>
                </div>
              </div>
              <p className="text-background/80 font-sans text-sm leading-relaxed max-w-2xl mx-auto sm:mx-0">
                {author.shortBio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          {/* Left Column — Bio + FAQs */}
          <div className="lg:col-span-1 space-y-8">
            {/* Biography */}
            <section>
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Biography</h2>
              <div className="h-px bg-border mb-4" />
              <p className="text-sm text-muted-foreground font-sans leading-[1.8]">
                {author.fullBio}
              </p>
            </section>

            {/* FAQs */}
            {author.faqs && author.faqs.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">About the Author</h2>
                <div className="h-px bg-border mb-4" />
                <FAQAccordion faqs={author.faqs} />
              </section>
            )}
          </div>

          {/* Right Column — Stories */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Works</h2>
            <div className="h-px bg-border mb-6" />

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-6 w-full sm:w-fit">
              <button
                onClick={() => setActiveTab("novels")}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 sm:py-2 rounded-lg text-sm font-sans font-medium transition-all duration-150 min-h-[44px]",
                  activeTab === "novels"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Novels
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-sans",
                  activeTab === "novels" ? "bg-background/20 text-background" : "bg-border text-muted-foreground"
                )}>
                  {novels.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("short-stories")}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 sm:py-2 rounded-lg text-sm font-sans font-medium transition-all duration-150 min-h-[44px]",
                  activeTab === "short-stories"
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Short Stories
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-sans",
                  activeTab === "short-stories" ? "bg-background/20 text-background" : "bg-border text-muted-foreground"
                )}>
                  {shortStories.length}
                </span>
              </button>
            </div>

            {/* Story Cards */}
            {activeTab === "novels" && (
              <div className="space-y-4">
                {novels.length > 0 ? novels.map((story) => (
                  <StoryCard key={story.id} story={story} />
                )) : (
                  <div className="text-center py-12 text-muted-foreground font-sans text-sm">
                    No novels in collection
                  </div>
                )}
              </div>
            )}

            {activeTab === "short-stories" && (
              <div className="space-y-4">
                {shortStories.length > 0 ? shortStories.map((story, i) => (
                  <StoryCard key={story.id} story={story} storyIndex={i + 1} />
                )) : (
                  <div className="text-center py-12 text-muted-foreground font-sans text-sm">
                    No short stories in collection
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthorDetail;
