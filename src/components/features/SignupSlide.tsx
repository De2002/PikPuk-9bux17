import { BookOpen, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignupSlideProps {
  open: boolean;
  onClose: () => void;
  onSignup: () => void;
  onSignin: () => void;
  context?: "short-story" | "novel-chapter";
}

const SignupSlide = ({ open, onClose, onSignup, onSignin, context = "short-story" }: SignupSlideProps) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[90] bg-foreground/40 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Slide panel */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[95] transition-transform duration-500 ease-out",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="bg-foreground text-background rounded-t-3xl shadow-2xl px-6 pt-6 pb-10 max-w-lg mx-auto">
          {/* Handle */}
          <div className="w-10 h-1 rounded-full bg-background/20 mx-auto mb-6" />

          {/* Dismiss */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
          >
            <X className="w-4 h-4 text-background" />
          </button>

          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-background/10 flex items-center justify-center mb-5">
            <BookOpen className="w-6 h-6 text-background" />
          </div>

          {/* Copy */}
          <h3 className="font-serif text-2xl font-bold text-background leading-snug mb-2">
            {context === "short-story"
              ? "Enjoying the reading experience?"
              : "Keep reading for free"}
          </h3>
          <p className="font-sans text-sm text-background/70 leading-relaxed mb-6">
            {context === "short-story"
              ? "Create a free account to continue reading, save your progress, and access your full library — unlimited stories, any time."
              : "You've reached the free preview. Create a free account to read the full novel from where you left off."}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-7">
            {["Unlimited stories", "Save progress", "Your library", "Free forever"].map(f => (
              <span key={f} className="inline-flex items-center gap-1 text-xs font-sans bg-background/10 text-background/80 px-3 py-1.5 rounded-full border border-background/10">
                <Sparkles className="w-3 h-3" />
                {f}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onSignup}
              className="w-full py-3.5 bg-background text-foreground rounded-xl font-sans font-bold text-sm hover:bg-background/90 transition-all shadow-sm"
            >
              Create Free Account
            </button>
            <button
              onClick={onSignin}
              className="w-full py-3 rounded-xl border border-background/20 text-background/80 font-sans text-sm font-medium hover:border-background/40 hover:text-background transition-all"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupSlide;
