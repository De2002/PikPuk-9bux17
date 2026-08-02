import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useCmsAuthors } from "@/hooks/useCmsData";
import AuthorCard from "@/components/features/AuthorCard";
import Navbar from "@/components/layout/Navbar";
import { Users, Search, X, Loader2 } from "lucide-react";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const [query, setQuery] = useState("");
  const { authors, loading } = useCmsAuthors();

  const filtered = query.trim()
    ? authors.filter((a) =>
        a.name.toLowerCase().includes(query.toLowerCase())
      )
    : authors;

  const totalWorks = authors.reduce((sum, a) => sum + a.novelCount + a.shortStoryCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Inktella — Classics Library | Free Novels & Short Stories</title>
        <meta name="description" content={`Read classic novels and short stories online for free. Browse ${authors.length} authors with ${totalWorks} works in the Inktella Classics Library.`} />
        <meta name="keywords" content="classics library, novels, short stories, free books, classic literature, authors, public domain" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://inktella.onspace.app/" />
        <meta property="og:title" content="Inktella — Classics Library" />
        <meta property="og:description" content="Curated library of classic novels and short stories. Read online for free." />
      </Helmet>
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/936133/pexels-photo-936133.jpeg"
          alt="Inktella Classics Library"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/60 to-foreground/20" />
        <div className="absolute inset-0 flex items-end pb-7 px-5 sm:px-8 md:px-16">
          <div className="w-full">
            <p className="text-background/70 font-sans text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-1.5">
              Free · Online · Classic Literature
            </p>
            <h1 className="font-serif text-xl sm:text-3xl md:text-5xl font-bold text-background leading-snug">
              Read Classic Novels &amp; Short Stories Online
            </h1>
            <p className="text-background/75 font-sans text-xs sm:text-sm md:text-base mt-1.5">
              Pick your favourite author below
              {!loading && authors.length > 0 && (
                <> &middot; {authors.length} authors, {totalWorks} works</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Authors List */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search authors…"
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-card font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-2 focus:ring-foreground/10 transition-all"
            aria-label="Search authors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-secondary hover:bg-border flex items-center justify-center transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Count row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-sans text-muted-foreground">
                  {query.trim() ? (
                    <>{filtered.length} of {authors.length} authors</>
                  ) : (
                    <>{authors.length} authors</>
                  )}
                </span>
              </div>
              <div className="h-px flex-1 bg-border mx-4" />
              <span className="text-xs text-muted-foreground font-sans tracking-wide uppercase">A–Z</span>
            </div>

            <div className="divide-y divide-border/60">
              {filtered.length > 0 ? (
                filtered.map((author) => (
                  <AuthorCard key={author.id} author={author} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search className="w-8 h-8 text-muted-foreground/40 mb-3" />
                  <p className="font-serif text-base text-foreground mb-1">No authors found</p>
                  <p className="text-sm text-muted-foreground font-sans mb-4">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                  <button
                    onClick={() => setQuery("")}
                    className="text-xs font-sans font-medium text-foreground underline underline-offset-2 hover:text-accent transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Index;
