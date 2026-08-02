import { useParams, Link, useNavigate } from "react-router-dom";
import { AUTHORS } from "@/constants/authors";
import { STORY_CHAPTERS } from "@/constants/chapters";
import Navbar from "@/components/layout/Navbar";
import { Chapter } from "@/types";
import { useState } from "react";
import { ArrowLeft, BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ChapterList = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [openSummary, setOpenSummary] = useState<number | null>(null);

  // Find story + author
  let storyTitle = "";
  let authorName = "";
  let authorId = "";
  let coverUrl = "";
  let storyType = "";

  for (const author of AUTHORS) {
    const found = author.stories.find((s) => s.id === id);
    if (found) {
      storyTitle = found.title;
      authorName = author.name;
      authorId = author.id;
      coverUrl = found.coverUrl;
      storyType = found.type;
      break;
    }
  }

  const chapters: Chapter[] = id ? STORY_CHAPTERS[id] ?? [] : [];

  if (!storyTitle) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-serif text-xl text-foreground">Story not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-foreground text-background">
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-background/50 text-xs font-sans mb-6">
            <button onClick={() => navigate("/")} className="hover:text-background transition-colors">Authors</button>
            <span>/</span>
            <Link to={`/author/${authorId}`} className="hover:text-background transition-colors">{authorName}</Link>
            <span>/</span>
            <Link to={`/story/${id}`} className="hover:text-background transition-colors">{storyTitle}</Link>
            <span>/</span>
            <span className="text-background/80">Chapters</span>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 shadow-xl border border-background/10">
              <img src={coverUrl} alt={storyTitle} className="w-full h-full object-cover" />
            </div>
            <div className="pt-1">
              <p className="text-background/50 font-sans text-xs tracking-widest uppercase mb-2">
                {storyType === "novel" ? "Novel" : "Short Story"} · {authorName}
              </p>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-background leading-tight mb-3">
                {storyTitle}
              </h1>
              <div className="flex items-center gap-2 text-background/60 text-sm font-sans">
                <BookOpen className="w-4 h-4" />
                <span>{chapters.length} chapter{chapters.length !== 1 ? "s" : ""} available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        {chapters.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="font-serif text-lg text-muted-foreground">Chapters coming soon</p>
            <p className="text-sm text-muted-foreground font-sans mt-2">This work is being prepared for reading.</p>
            <Link to={`/story/${id}`} className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-foreground hover:text-accent transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Story
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map((chapter) => {
              const isOpen = openSummary === chapter.number;
              return (
                <div
                  key={chapter.number}
                  className={cn(
                    "rounded-xl border transition-all duration-200",
                    isOpen ? "border-foreground/20 shadow-sm bg-card" : "border-border bg-card hover:border-foreground/15 hover:shadow-sm"
                  )}
                >
                  {/* Chapter Row */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* Chapter number */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                      <span className="font-sans text-xs font-bold text-foreground">{chapter.number}</span>
                    </div>

                    {/* Title — links to reader */}
                    <Link
                      to={`/story/${id}/chapter/${chapter.number}`}
                      className="flex-1 min-w-0 group"
                    >
                      <p className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors leading-snug truncate">
                        {chapter.title}
                      </p>
                    </Link>

                    {/* Read Chapter link */}
                    <Link
                      to={`/story/${id}/chapter/${chapter.number}`}
                      className="flex-shrink-0 hidden sm:flex items-center gap-1.5 text-xs font-sans font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-foreground/20 hover:bg-secondary/50"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                      Read Chapter
                    </Link>

                    {/* Summary toggle */}
                    <button
                      onClick={() => setOpenSummary(isOpen ? null : chapter.number)}
                      className="flex-shrink-0 flex items-center gap-1.5 text-xs font-sans font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg border border-border hover:border-foreground/20 hover:bg-secondary/50"
                      aria-expanded={isOpen}
                    >
                      <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")} />
                      Summary
                    </button>
                  </div>

                  {/* Expandable Summary */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-border/60">
                      <p className="text-sm text-muted-foreground font-sans leading-[1.8]">
                        {chapter.summary}
                      </p>
                      <Link
                        to={`/story/${id}/chapter/${chapter.number}`}
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-sans font-medium text-foreground hover:text-accent transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                        Read Chapter {chapter.number}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="border-t border-border mt-16 py-8 px-6 text-center">
        <p className="text-xs text-muted-foreground font-sans">
          © {new Date().getFullYear()} Inktella Classics Library · A curated collection of world literature
        </p>
      </footer>
    </div>
  );
};

export default ChapterList;
