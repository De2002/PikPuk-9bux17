import { ReactNode } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, LogOut, ChevronRight, Feather, ShieldAlert, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/lib/auth";
import { toast } from "sonner";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/stories", label: "Stories", icon: BookOpen, exact: false },
  { href: "/admin/authors", label: "Authors", icon: Users, exact: false },
  { href: "/admin/poetry", label: "Poetry", icon: Feather, exact: false },
];

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, checking } = useAdmin();
  const location = useLocation();

  const handleSignOut = async () => {
    try { await authService.signOut(); } catch (e: any) { toast.error(e.message); }
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-background">
        <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-muted-foreground" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-foreground">Admin Access Required</h2>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Your account does not have admin privileges. Contact the site owner to grant access via the database.
        </p>
        <Link to="/" className="mt-2 text-sm font-sans font-medium text-foreground underline underline-offset-2">
          Return to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f5f5f3]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#18181b] text-white flex flex-col fixed inset-y-0 left-0 z-30 hidden md:flex">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-white/10">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <Feather className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-serif text-base font-bold tracking-tight">Inktella</span>
          <span className="ml-1 text-[10px] font-sans uppercase tracking-widest text-white/40">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? location.pathname === href : location.pathname.startsWith(href);
            return (
              <Link
                key={href}
                to={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-sans font-medium transition-all",
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-40" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/60 uppercase">
              {user.username?.[0] ?? "A"}
            </div>
            <span className="text-xs font-sans text-white/50 truncate max-w-[110px]">{user.email}</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans text-white/40 hover:text-white hover:bg-white/5 transition-all mb-0.5"
          >
            <BookOpen className="w-4 h-4" />
            View Site
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-sans text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#18181b] h-14 flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Feather className="w-4 h-4 text-white" />
          <span className="font-serif text-base font-bold text-white">Admin</span>
        </div>
        <div className="flex items-center gap-1">
          {NAV.map(({ href, icon: Icon, exact }) => (
            <Link key={href} to={href} className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-colors", (exact ? location.pathname === href : location.pathname.startsWith(href)) ? "bg-white/10 text-white" : "text-white/40 hover:text-white")}>  
              <Icon className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
