import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { usePoet } from "@/hooks/usePoetryData";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BiographySection from "@/components/features/BiographySection";
import { ArrowLeft, Globe, Calendar, Feather, Loader2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const PoetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { poet, poems, loading } = usePoet(id);

  const activePoms = poems.filter((p) => p.is_active);

  if (loading || poet === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!poet) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="font-serif text-2xl text-foreground mb-2">Poet not found</p>
            <Link to="/poems" className="text-sm text-muted-foreground hover:text-foreground font-sans underline">
              Return to Poetry
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lifespan = poet.died ? `${poet.born ?? "?"} – ${poet.died}` : poet.born ? `b. ${poet.born}` : "";
  const description = `${poet.name} (${lifespan}) — ${poet.short_bio}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{poet.name} — Inktella Poetry</title>
        <meta name="description" content={`${poet.name}, ${poet.nationality} poet. Read ${activePoms.length} classic poem${activePoms.length !== 1 ? "s" : ""} by ${poet.name} on Inktella.`} />
        <meta name="keywords" content={`${poet.name}, ${poet.nationality}, poetry, classic poems, ${poet.name.split(" ").pop()} poems`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${poet.name} — Inktella Poetry`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={poet.portrait} />
        <meta property="og:url" content={`https://inktella.onspace.app/poet/${poet.id}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${poet.name} — Inktella Poetry`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={poet.portrait} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": poet.name,
          "birthDate": poet.born ? String(poet.born) : undefined,
          "deathDate": poet.died ? String(poet.died) : undefined,
          "nationality": poet.nationality,
          "image": poet.portrait,
          "description": poet.short_bio,
          "url": `https://inktella.onspace.app/poet/${poet.id}`,
          "knowsAbout": activePoms.map((p) => ({ "@type": "CreativeWork", "name": p.title })),
        })}</script>
      </Helmet>

      <Navbar />

      {/* Header */}
      <div className="bg-foreground text-background">
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-10">
          <Link to="/poems" className="inline-flex items-center gap-1.5 text-background/60 hover:text-background text-sm font-sans transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            All Poets
          </Link>

          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 sm:gap-8">
            {/* Portrait */}
            <div className="flex-shrink-0">
              {poet.portrait ? (
                <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden border-2 border-background/20 shadow-xl">
                  <img src={poet.portrait} alt={poet.name} className="w-full h-full object-cover object-top" />
                </div>
              ) : (
                <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-xl border-2 border-background/20 bg-background/10 flex items-center justify-center">
                  <Feather className="w-10 h-10 text-background/30" />
                </div>
              )}
            </div>

            {/* Meta */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-background leading-tight mb-3">
                {poet.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
                {poet.nationality && (
                  <div className="flex items-center gap-1.5 text-background/70 text-sm font-sans bg-background/10 px-3 py-1.5 rounded-full">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{poet.nationality}</span>
                  </div>
                )}
                {lifespan && (
                  <div className="flex items-center gap-1.5 text-background/70 text-sm font-sans bg-background/10 px-3 py-1.5 rounded-full">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{lifespan}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-background/70 text-sm font-sans bg-background/10 px-3 py-1.5 rounded-full">
                  <Feather className="w-3.5 h-3.5" />
                  <span>{activePoms.length} poem{activePoms.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
              {poet.short_bio && (
                <p className="text-background/80 font-sans text-sm leading-relaxed max-w-2xl mx-auto sm:mx-0">
                  {poet.short_bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left — Biography (wider on desktop, occupies till middle) */}
          <div className="lg:col-span-5">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Biography</h2>
            <div className="h-px bg-border mb-4" />
            <BiographySection content={poet.full_bio || poet.short_bio || null} />
          </div>

          {/* Right — Poems */}
          <div className="lg:col-span-7">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Poems</h2>
            <div className="h-px bg-border mb-6" />

            {activePoms.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Feather className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="font-sans text-sm">No poems added yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activePoms.map((poem) => (
                  <Link
                    key={poem.id}
                    to={`/poem/${poem.id}`}
                    className="group flex items-center gap-4 px-5 py-4 bg-card border border-border rounded-xl hover:border-foreground/20 hover:shadow-sm transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <Feather className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors leading-snug">
                        {poem.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {poem.form && <span className="text-xs text-muted-foreground font-sans">{poem.form}</span>}
                        {poem.year && <span className="text-xs text-muted-foreground/60 font-sans">· {poem.year}</span>}
                      </div>
                    </div>
                    {poem.tags.length > 0 && (
                      <div className="hidden sm:flex flex-wrap gap-1.5 justify-end max-w-[160px]">
                        {poem.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <BookOpen className="w-4 h-4 text-muted-foreground/40 group-hover:text-muted-foreground flex-shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PoetDetail;
