import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { usePoem } from "@/hooks/usePoetryData";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Feather, Calendar, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PoemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { poem, poet, loading } = usePoem(id);

  if (loading || poem === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!poem || !poet) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="font-serif text-2xl text-foreground mb-2">Poem not found</p>
            <Link to="/poems" className="text-sm text-muted-foreground hover:text-foreground font-sans underline">
              Return to Poetry
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lines = poem.content.split("\n");

  // Detect stanza breaks (empty lines)
  const stanzas: string[][] = [];
  let currentStanza: string[] = [];
  for (const line of lines) {
    if (line.trim() === "") {
      if (currentStanza.length > 0) { stanzas.push(currentStanza); currentStanza = []; }
    } else {
      currentStanza.push(line);
    }
  }
  if (currentStanza.length > 0) stanzas.push(currentStanza);

  const description = `Read "${poem.title}" by ${poet.name}${poem.year ? ` (${poem.year})` : ""}. A ${poem.form || "classic"} poem on Inktella.`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{poem.title} by {poet.name} — Inktella Poetry</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${poem.title}, ${poet.name}, poetry, ${poem.form || "poem"}, classic, ${poem.tags.join(", ")}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${poem.title} by ${poet.name}`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={poet.portrait} />
        <meta property="og:url" content={`https://inktella.onspace.app/poem/${poem.id}`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${poem.title} by ${poet.name}`} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={poet.portrait} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          "name": poem.title,
          "author": { "@type": "Person", "name": poet.name },
          "datePublished": poem.year ? String(poem.year) : undefined,
          "genre": poem.form || "Poetry",
          "keywords": poem.tags.join(", "),
          "url": `https://inktella.onspace.app/poem/${poem.id}`,
          "inLanguage": "en",
          "publisher": { "@type": "Organization", "name": "Inktella Classics Library" },
        })}</script>
      </Helmet>

      <Navbar />

      {/* Reading area */}
      <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-muted-foreground text-xs font-sans mb-10">
          <Link to="/poems" className="hover:text-foreground transition-colors">Poetry</Link>
          <span>/</span>
          <Link to={`/poet/${poet.id}`} className="hover:text-foreground transition-colors">{poet.name}</Link>
          <span>/</span>
          <span className="text-foreground/70 truncate max-w-[160px]">{poem.title}</span>
        </div>

        {/* Poem header */}
        <header className="mb-14 text-center">
          {/* Decorative feather */}
          <div className="w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto mb-8">
            <Feather className="w-5 h-5 text-muted-foreground" />
          </div>

          {poem.form && (
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-muted-foreground mb-3">{poem.form}</p>
          )}
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-5">
            {poem.title}
          </h1>
          <Link
            to={`/poet/${poet.id}`}
            className="inline-flex items-center gap-2 group"
          >
            {poet.portrait ? (
              <img src={poet.portrait} alt={poet.name} className="w-7 h-7 rounded-full object-cover object-top border border-border" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center">
                <Feather className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
            <span className="font-sans text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {poet.name}
            </span>
          </Link>

          {poem.year && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-sans mt-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>{poem.year}</span>
            </div>
          )}

          {/* Divider ornament */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="h-px w-16 bg-border" />
            <span className="text-muted-foreground/40 text-lg font-serif">❧</span>
            <div className="h-px w-16 bg-border" />
          </div>
        </header>

        {/* Poem body */}
        <article className="font-serif text-lg leading-[1.9] text-foreground mb-14">
          {stanzas.length > 0 ? (
            stanzas.map((stanza, si) => (
              <div key={si} className={cn("space-y-1", si > 0 && "mt-9")}>
                {stanza.map((line, li) => (
                  <p key={li} className={cn("whitespace-pre-wrap", line.trim() === "" && "h-5")}>
                    {line || "\u00A0"}
                  </p>
                ))}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground italic font-sans text-base">Poem content not yet available.</p>
          )}
        </article>

        {/* End ornament */}
        <div className="flex items-center justify-center gap-3 mb-14">
          <div className="h-px w-16 bg-border" />
          <span className="text-muted-foreground/40 font-serif">∎</span>
          <div className="h-px w-16 bg-border" />
        </div>

        {/* Tags */}
        {poem.tags.length > 0 && (
          <section className="mb-12">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Themes &amp; Tags</p>
            <div className="flex flex-wrap gap-2">
              {poem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-sans px-3 py-1.5 rounded-full bg-secondary text-foreground/70 border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Poet card */}
        <section className="rounded-2xl border border-border bg-card p-6 mb-8">
          <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-4">About the Poet</p>
          <Link to={`/poet/${poet.id}`} className="flex items-start gap-4 group mb-4">
            {poet.portrait ? (
              <div className="w-14 h-18 rounded-xl overflow-hidden flex-shrink-0 border border-border" style={{ height: "4.5rem" }}>
                <img src={poet.portrait} alt={poet.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="w-14 rounded-xl border border-border bg-secondary flex items-center justify-center flex-shrink-0" style={{ height: "4.5rem" }}>
                <Feather className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-serif font-semibold text-foreground group-hover:text-accent transition-colors leading-tight mb-1">
                {poet.name}
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                {poet.nationality}{poet.born ? ` · ${poet.born}${poet.died ? `–${poet.died}` : ""}` : ""}
              </p>
            </div>
          </Link>
          {poet.short_bio && (
            <p className="text-xs text-muted-foreground font-sans leading-relaxed line-clamp-3 mb-4">
              {poet.short_bio}
            </p>
          )}
          <Link
            to={`/poet/${poet.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-foreground hover:text-accent transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            All poems by {poet.name.split(" ").pop()}
          </Link>
        </section>

        {/* Back link */}
        <div className="text-center">
          <Link
            to="/poems"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-sans text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Poetry
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PoemDetail;
