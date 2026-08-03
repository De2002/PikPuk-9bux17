import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BiographySectionProps {
  content: string | null;
  maxHeightOnMobile?: number; // in pixels, default 250
}

export default function BiographySection({
  content,
  maxHeightOnMobile = 250,
}: BiographySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) {
    return (
      <p className="text-sm text-muted-foreground font-sans">
        No biography available yet.
      </p>
    );
  }

  // Check if content is long enough to warrant truncation on mobile
  const needsTruncation = content.length > 300;
  const isMobileView = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <div className="space-y-4">
      {/* Desktop: full width, no truncation */}
      <div className="hidden md:block">
        <div className="prose prose-sm max-w-none text-muted-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="biography-content"
            components={{
              p: ({ node, ...props }) => (
                <p className="text-sm font-sans leading-[1.8] mb-4 text-muted-foreground" {...props} />
              ),
              h1: ({ node, ...props }) => (
                <h3 className="text-base font-serif font-semibold text-foreground mt-5 mb-3" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h4 className="text-sm font-serif font-semibold text-foreground mt-4 mb-2" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h5 className="text-sm font-serif font-semibold text-foreground mt-4 mb-2" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="text-sm font-sans list-disc list-inside mb-4 text-muted-foreground space-y-1" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="text-sm font-sans list-decimal list-inside mb-4 text-muted-foreground space-y-1" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="text-sm font-sans border-l-4 border-border pl-4 italic my-4 text-muted-foreground" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="text-xs font-mono bg-secondary px-2 py-1 rounded text-foreground" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Mobile: with read more toggle */}
      <div className="md:hidden space-y-3">
        <div
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            !isExpanded && needsTruncation && "max-h-[250px]"
          )}
        >
          <div
            className={cn(
              "prose prose-sm max-w-none text-muted-foreground",
              !isExpanded && needsTruncation && "line-clamp-none"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="biography-content"
              components={{
                p: ({ node, ...props }) => (
                  <p className="text-sm font-sans leading-[1.8] mb-4 text-muted-foreground" {...props} />
                ),
                h1: ({ node, ...props }) => (
                  <h3 className="text-base font-serif font-semibold text-foreground mt-5 mb-3" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h4 className="text-sm font-serif font-semibold text-foreground mt-4 mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h5 className="text-sm font-serif font-semibold text-foreground mt-4 mb-2" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="text-sm font-sans list-disc list-inside mb-4 text-muted-foreground space-y-1" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="text-sm font-sans list-decimal list-inside mb-4 text-muted-foreground space-y-1" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="text-sm font-sans border-l-4 border-border pl-4 italic my-4 text-muted-foreground" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code className="text-xs font-mono bg-secondary px-2 py-1 rounded text-foreground" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Gradient overlay when truncated */}
          {!isExpanded && needsTruncation && (
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          )}
        </div>

        {/* Read More/Less Button */}
        {needsTruncation && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-accent hover:text-accent/80 transition-colors"
          >
            {isExpanded ? "Read less" : "Read more"}
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}
