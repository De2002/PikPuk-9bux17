import { Author } from "@/types";
import { Link } from "react-router-dom";
import { BookOpen, FileText } from "lucide-react";

interface AuthorCardProps {
  author: Author;
}

const AuthorCard = ({ author }: AuthorCardProps) => {
  const lifespan = author.died
    ? `${author.born} – ${author.died}`
    : `b. ${author.born}`;

  return (
    <Link to={`/author/${author.id}`} className="group block">
      <div className="flex gap-4 items-start py-5 px-3 sm:px-4 rounded-xl hover:bg-secondary/60 transition-all duration-200 border border-transparent hover:border-border hover:shadow-sm">
        {/* Portrait + lifespan stacked */}
        <div className="relative flex-shrink-0 flex flex-col items-center gap-1.5">
          <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-muted">
            <img
              src={author.portrait}
              alt={author.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          {/* Nationality badge */}
          <div className="bg-foreground text-background text-[9px] font-sans font-medium px-1.5 py-0.5 rounded w-full text-center truncate">
            {author.nationality}
          </div>
          {/* Lifespan under image */}
          <span className="text-[10px] text-muted-foreground font-sans text-center leading-tight">
            {lifespan}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          {/* Name — wraps naturally */}
          <h2 className="font-serif text-xl font-semibold text-foreground leading-snug group-hover:text-accent transition-colors mb-3">
            {author.name}
          </h2>
          {/* Counts row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-secondary rounded-lg px-2.5 py-1.5 text-xs font-sans">
              <BookOpen className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="font-bold text-foreground">{author.novelCount}</span>
              <span className="text-muted-foreground">{author.novelCount !== 1 ? "novels" : "novel"}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary rounded-lg px-2.5 py-1.5 text-xs font-sans">
              <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="font-bold text-foreground">{author.shortStoryCount}</span>
              <span className="text-muted-foreground">{author.shortStoryCount !== 1 ? "stories" : "story"}</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
            <svg className="w-3 h-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AuthorCard;
