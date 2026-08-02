import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { BookOpen, Feather, Globe, Heart } from "lucide-react";

const pillars = [
  {
    icon: BookOpen,
    title: "Free to Read",
    body: "Every novel and short story on PikPuk is available to read online at no cost. Great literature should never be locked behind a paywall.",
  },
  {
    icon: Globe,
    title: "World Literature",
    body: "Our library spans Russian epics, French novels, English poetry, and beyond — curated to represent the full breadth of the classical canon.",
  },
  {
    icon: Heart,
    title: "Reader First",
    body: "Clean reading interfaces, no ads, no clutter. We obsess over typography and spacing so you can lose yourself in the prose.",
  },
  {
    icon: Feather,
    title: "Curated with Care",
    body: "Every work is hand-selected and annotated with context — synopses, themes, notable quotes — to enrich your reading before you begin.",
  },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <div className="bg-foreground text-background">
      <div className="max-w-3xl mx-auto px-6 pt-14 pb-14">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
            <Feather className="w-5 h-5 text-background" />
          </div>
          <span className="text-xs font-sans uppercase tracking-widest text-background/50">About Inktella</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-background leading-tight mb-5">
          A Home for Classic Literature
        </h1>
        <p className="text-background/70 font-sans text-base leading-relaxed max-w-xl">
          Inktella is a free, curated online library dedicated to the great novels and short stories of world literature.
          We believe the classics belong to everyone — and we're building the most enjoyable place to read them.
        </p>
      </div>
    </div>

    {/* Body */}
    <div className="max-w-3xl mx-auto px-6 py-14 space-y-16">

      {/* Mission */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl font-semibold text-foreground">Our Mission</h2>
        <div className="h-px bg-border" />
        <div className="space-y-4 font-sans text-base text-foreground/75 leading-[1.85]">
          <p>
            Classics are called classics for a reason — they illuminate the human condition across centuries
            and cultures. Yet for many readers, the path into this literature is intimidating: dense editions,
            dry introductions, or texts hidden behind academic paywalls.
          </p>
          <p>
            Inktella was built to change that. We present the world's greatest novels and short stories in a
            clean, modern reading environment — with rich author profiles, thoughtful synopses, and contextual
            notes to help you step inside each work with confidence.
          </p>
          <p>
            Whether you're returning to a beloved text or encountering Dostoevsky for the first time, Inktella
            is designed to meet you where you are.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground">What We Stand For</h2>
        <div className="h-px bg-border" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div key={title} className="p-5 rounded-xl border border-border bg-card space-y-3">
              <div className="w-9 h-9 rounded-lg bg-foreground/5 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-foreground" />
              </div>
              <h3 className="font-serif text-base font-semibold text-foreground">{title}</h3>
              <p className="text-sm font-sans text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Collection */}
      <section className="space-y-5">
        <h2 className="font-serif text-2xl font-semibold text-foreground">The Collection</h2>
        <div className="h-px bg-border" />
        <div className="space-y-4 font-sans text-base text-foreground/75 leading-[1.85]">
          <p>
            Our library is author-centric by design. Each author page brings together a complete portrait —
            biography, historical context, frequently asked questions — alongside the full catalogue of their
            works available on PikPuk.
          </p>
          <p>
            Novels are presented chapter by chapter in our e-reader, with configurable free reading and easy
            chapter navigation. Short stories are available in a single, distraction-free reading view.
            All content is mobile-optimised and accessible without an account.
          </p>
          <p>
            Create a free account to bookmark favourites and build your personal reading list.             Your library
            is available wherever you pick up Inktella next.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-foreground text-background p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <p className="font-serif text-xl font-semibold mb-1">Ready to start reading?</p>
          <p className="text-sm font-sans text-background/60">Browse our collection of authors and works — free, forever.</p>
        </div>
        <Link
          to="/"
          className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground rounded-full text-sm font-sans font-semibold hover:bg-background/90 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          Explore the Library
        </Link>
      </section>
    </div>

    <Footer />
  </div>
);

export default About;
