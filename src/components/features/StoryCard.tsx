import { Story } from "@/types";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Tag } from "lucide-react";

interface StoryCardProps {
  story: Story;
  storyIndex?: number;
}

const StoryCard = ({ story, storyIndex }: StoryCardProps) => {
  const isShortStory = story.type === "short-story";
  const readPath = isShortStory ? `/story/${story.id}/read` : `/story/${story.id}`;
  return (
    <Link to={readPath} className="group block">
      <div className="flex gap-4 p-4 rounded-xl border border-border hover:border-foreground/20 hover:shadow-md transition-all duration-200 bg-card">
        {/* Cover or Number Badge */}
        {isShortStory ? (
          <div className="flex-shrink-0 w-16 h-24 rounded-md bg-secondary border border-border flex items-center justify-center group-hover:border-foreground/20 transition-colors">
            <span className="font-serif text-3xl font-bold text-foreground/25 select-none">
              {storyIndex ?? 1}
            </span>
          </div>
        ) : (
          <div className="flex-shrink-0 w-16 h-24 rounded-md overflow-hidden bg-muted">
            <img
              src={story.coverUrl}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-serif text-base font-semibold leading-tight text-foreground group-hover:text-accent transition-colors">
                {story.title}
              </h3>
              <span className="text-xs text-muted-foreground font-sans flex-shrink-0">{story.year}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 font-sans mb-2">
              {story.description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
              <Tag className="w-3 h-3" />
              <span>{story.genre}</span>
            </div>
            {story.pages && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                <BookOpen className="w-3 h-3" />
                <span>{story.pages} pages</span>
              </div>
            )}
            {story.readTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground font-sans">
                <Clock className="w-3 h-3" />
                <span>{story.readTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
