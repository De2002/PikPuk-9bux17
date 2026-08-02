import { useEffect, useState } from "react";
import { AUTHORS } from "@/constants/authors";
import { supabase } from "@/lib/supabase";
import { BookOpen, BookMarked, Users, Bookmark, TrendingUp } from "lucide-react";

interface Stats {
  totalAuthors: number;
  totalNovels: number;
  totalShortStories: number;
  totalBookmarks: number;
  totalUsers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalAuthors: AUTHORS.length,
    totalNovels: AUTHORS.reduce((n, a) => n + a.novelCount, 0),
    totalShortStories: AUTHORS.reduce((n, a) => n + a.shortStoryCount, 0),
    totalBookmarks: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    // Fetch dynamic stats
    Promise.all([
      supabase.from("bookmarks").select("id", { count: "exact", head: true }),
      supabase.from("user_profiles").select("id", { count: "exact", head: true }),
    ]).then(([bRes, uRes]) => {
      setStats((s) => ({
        ...s,
        totalBookmarks: bRes.count ?? 0,
        totalUsers: uRes.count ?? 0,
      }));
    });
  }, []);

  const cards = [
    { label: "Authors", value: stats.totalAuthors, icon: Users, color: "bg-violet-50 text-violet-600" },
    { label: "Novels", value: stats.totalNovels, icon: BookMarked, color: "bg-blue-50 text-blue-600" },
    { label: "Short Stories", value: stats.totalShortStories, icon: BookOpen, color: "bg-amber-50 text-amber-600" },
    { label: "Registered Users", value: stats.totalUsers, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
    { label: "Total Bookmarks", value: stats.totalBookmarks, icon: Bookmark, color: "bg-rose-50 text-rose-600" },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-[#18181b]">Overview</h1>
        <p className="text-sm text-[#71717a] font-sans mt-1">Welcome to the PikPuk admin panel.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-[#e4e4e7] p-5 flex flex-col gap-3">
            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="font-sans text-2xl font-bold text-[#18181b]">{value}</p>
              <p className="text-xs font-sans text-[#71717a] mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-[#e4e4e7] p-6">
        <h2 className="font-sans text-sm font-semibold text-[#18181b] mb-4">Quick Start</h2>
        <div className="space-y-3 text-sm font-sans text-[#52525b]">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#18181b] text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
            <p>Go to <strong className="text-[#18181b]">Authors</strong> to add, edit, or delete authors — including portrait, bio, nationality, and born/died dates. Click <strong className="text-[#18181b]">FAQs</strong> on any author to manage their FAQ section.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#18181b] text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</span>
            <p>Go to <strong className="text-[#18181b]">Stories</strong> to add or edit novels and short stories — synopsis, themes, quotes, cover image, and free chapter limits. Click <strong className="text-[#18181b]">Chapters</strong> on any novel to manage its full chapter content.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#18181b] text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</span>
            <p>CMS data in the database takes priority over static files. To grant admin access to another user, set their <code className="bg-[#f4f4f5] px-1.5 py-0.5 rounded text-xs">role = 'admin'</code> in the <strong className="text-[#18181b]">user_profiles</strong> table via Cloud &rarr; Data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
