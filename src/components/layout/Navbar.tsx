import { Link } from "react-router-dom";
import { LogOut, Bookmark, Feather } from "lucide-react";
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
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/favicon.png" alt="Inktella" className="w-6 h-6" />
          <span className="font-serif text-lg font-bold tracking-tight text-foreground">
            Inktella
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/poems"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/50 hidden sm:flex items-center gap-1.5"
          >
            <Feather className="w-3.5 h-3.5" />
            Poetry
          </Link>
          {!loading && user && (
            <Link
              to="/bookmarks"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/50"
            >
              <span className="hidden sm:inline">Bookmarks</span>
              <span className="sm:hidden"><Bookmark className="w-4 h-4" /></span>
            </Link>
          )}

          {!loading && (
            user ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/50"
                >
                  <span className="hidden sm:inline">Sign out</span>
                  <span className="sm:hidden"><LogOut className="w-4 h-4" /></span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <button
                  onClick={openSignin}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/50"
                >
                  Sign in
                </button>
                <button
                  onClick={openSignup}
                  className="text-sm font-semibold bg-foreground text-background px-4 py-2 rounded-lg hover:bg-foreground/90 transition-all"
                >
                  Join
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
