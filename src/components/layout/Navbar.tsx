import { Link } from "react-router-dom";
import { BookOpen, Feather, LogIn, LogOut, User, Bookmark } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/lib/auth";
import AuthModal from "@/components/features/AuthModal";
import { toast } from "sonner";

const Navbar = () => {
  const { user, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");

  const openSignup = () => { setAuthMode("signup"); setAuthOpen(true); };
  const openSignin = () => { setAuthMode("signin"); setAuthOpen(true); };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      toast.success("Signed out.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
            <Feather className="w-4 h-4 text-background" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-foreground">
            Inktella
          </span>
          <span className="text-xs text-muted-foreground font-sans tracking-widest uppercase ml-1 hidden sm:block">
            Classics Library
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:block">Authors</span>
          </Link>

          {!loading && user && (
            <Link
              to="/bookmarks"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:block">Bookmarks</span>
            </Link>
          )}

          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm font-sans text-muted-foreground">
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:block max-w-[100px] truncate">{user.username}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openSignin}
                  className="text-xs font-sans font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Sign in
                </button>
                <button
                  onClick={openSignup}
                  className="flex items-center gap-1.5 text-xs font-sans font-semibold bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Join free</span>
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
    <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultMode={authMode} />
    </>
  );
};

export default Navbar;
