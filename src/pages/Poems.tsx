import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { usePoets, fetchRandomPoem } from "@/hooks/usePoetryData";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, X, Loader2, Shuffle, Users, Globe, Feather } from "lucide-react";
import { cn } from "@/lib/utils";

const Poems = () => {
  const [query, setQuery] = useState("");
  const [shuffling, setShuffling] = useState(false);
  const { poets, loading } = usePoets();
  const navigate = useNavigate();

  const filtered = query.trim()
    ? poets.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.nationality.toLowerCase().includes(query.toLowerCase()))
    : poets;

  const handleRandom = async () => {
    setShuffling(true);
    const result = await fetchRandomPoem();
    setShuffling(false);
    if (result) {
      navigate(`/poem/${result.poem.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Classic Poetry — Inktella | Poems & Poets</title>
        <meta name="description" content={`Explore classic poetry from ${poets.length} poets. Read timeless poems from world literature on Inktella.`} />
        <meta name="keywords" content="classic poetry, poems, poets, classic literature, verse, sonnets, odes, free poetry online" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Classic Poetry — Inktella" />
        <meta property="og:description" content="Read timeless poems from the world's greatest poets." />
        <meta property="og:url" content="https://inktella.onspace.app/poems" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Classic Poetry — Inktella" />
        <meta name="twitter:description" content="Read timeless poems from the world's greatest poets." />
      </Helmet>

      <Navbar />

      {/* Hero */}
      <div className="bg-foreground text-background">
        <div className="max-w-4xl mx-auto px-6 pt-14 pb-12">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Feather className="w-5 h-5 text-background/50" />
                <span className="text-background/50 font-sans text-xs tracking-[0.2em] uppercase">Classic Poetry</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-background leading-tight mb-3">
                Poems &amp; Poets
              </h1>
              <p className="text-background/65 font-sans text-sm md:text-base max-w-lg leading-relaxed">
                Discover timeless verse from the world's greatest poets. Each line a window into another age.
              </p>
            </div>
            <button
              onClick={handleRandom}
              disabled={shuffling || loading}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-background/15 hover:bg-background/25 text-background text-sm font-sans font-medium transition-all border border-background/20 disabled:opacity-50 flex-shrink-0 self-start mt-2"
            >
              {shuffling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
              Random Poem
            </button>
          </div>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-background/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search poets by name or nationality…"
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-background/10 border border-background/20 text-background placeholder:text-background/40 font-sans text-sm focus:outline-none focus:border-background/40 focus:bg-background/15 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background/20 hover:bg-background/30 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-background/60" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Poets Grid */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Count row */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-sans text-muted-foreground">
                  {query.trim() ? <>{filtered.length} of {poets.length} poets</> : <>{poets.length} poets</>}
                </span>
              </div>
              <div className="h-px flex-1 bg-border mx-4" />
              <span className="text-xs text-muted-foreground font-sans tracking-wide uppercase">A–Z</span>
            </div>

            {filtered.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                {poets.length === 0 ? (
                  <>
                    <Feather className="w-10 h-10 text-muted-foreground/30 mb-4" />
                    <p className="font-serif text-lg text-foreground mb-2">No poets yet</p>
                    <p className="text-sm text-muted-foreground font-sans">Poets and poems will appear here once added from the admin panel.</p>
                  </>
                ) : (
                  <>
                    <Search className="w-8 h-8 text-muted-foreground/40 mb-3" />
                    <p className="font-serif text-base text-foreground mb-1">No poets found</p>
                    <p className="text-sm text-muted-foreground font-sans mb-4">No results for &ldquo;{query}&rdquo;</p>
                    <button onClick={() => setQuery("")} className="text-xs font-sans font-medium text-foreground underline underline-offset-2">Clear search</button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((poet) => {
                  const lifespan = poet.died ? `${poet.born ?? "?"} – ${poet.died}` : poet.born ? `b. ${poet.born}` : "";
                  return (
                    <Link
                      key={poet.id}
                      to={`/poet/${poet.id}`}
                      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-foreground/20 hover:shadow-md transition-all duration-200"
                    >
                      {/* Portrait */}
                      <div className="relative h-52 overflow-hidden bg-muted">
                        {poet.portrait ? (
                          <img
                            src={poet.portrait}
                            alt={poet.name}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Feather className="w-12 h-12 text-muted-foreground/20" />
                          </div>
                        )}
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                        {/* Poem count badge */}
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-sans font-semibold text-foreground">
                          {poet.poem_count} poem{poet.poem_count !== 1 ? "s" : ""}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="px-4 py-4">
                        <h2 className="font-serif text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-tight mb-1">
                          {poet.name}
                        </h2>
                        <div className="flex items-center gap-3 mb-2.5">
                          {poet.nationality && (
                            <div className="flex items-center gap-1 text-xs font-sans text-muted-foreground">
                              <Globe className="w-3 h-3" />
                              <span>{poet.nationality}</span>
                            </div>
                          )}
                          {lifespan && (
                            <span className="text-xs font-sans text-muted-foreground">{lifespan}</span>
                          )}
                        </div>
                        {poet.short_bio && (
                          <p className="text-xs font-sans text-muted-foreground leading-relaxed line-clamp-2">
                            {poet.short_bio}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Poems;
