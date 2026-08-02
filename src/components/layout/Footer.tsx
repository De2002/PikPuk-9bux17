import { Link } from "react-router-dom";
import { Feather } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border mt-16 py-10 px-6">
    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
          <Feather className="w-3 h-3 text-background" />
        </div>
        <span className="font-serif text-sm font-bold text-foreground">Inktella</span>
        <span className="text-xs text-muted-foreground font-sans">
          © {new Date().getFullYear()} · Classics Library
        </span>
      </div>

      {/* Links */}
      <nav className="flex items-center gap-5 flex-wrap justify-center">
        <Link to="/about" className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
          About
        </Link>
        <Link to="/terms" className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
          Terms
        </Link>
        <Link to="/privacy" className="text-xs font-sans text-muted-foreground hover:text-foreground transition-colors">
          Privacy
        </Link>
      </nav>
    </div>
  </footer>
);

export default Footer;
