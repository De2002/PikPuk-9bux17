import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { CmsAuthor, fetchCmsAuthors, slugify } from "@/hooks/useCmsData";
import { AUTHORS } from "@/constants/authors";
import {
  Plus, Search, Pencil, Trash2, Globe, Loader2, BookMarked, BookOpen, X
} from "lucide-react";
import ImageUpload from "@/components/features/ImageUpload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Author Form ───────────────────────────────────────────────────────────────

interface AuthorFormProps {
  initial?: Partial<CmsAuthor>;
  onSave: (data: Omit<CmsAuthor, "sort_order">) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

const EMPTY_AUTHOR: Omit<CmsAuthor, "sort_order"> = {
  id: "", name: "", nationality: "", born: null, died: null,
  portrait: "", short_bio: "", full_bio: "",
  novel_count: 0, short_story_count: 0,
};

function AuthorForm({ initial, onSave, onCancel, saving }: AuthorFormProps) {
  const [form, setForm] = useState<Omit<CmsAuthor, "sort_order">>({
    ...EMPTY_AUTHOR, ...initial,
  });
  const [autoId, setAutoId] = useState(!initial?.id);

  const set = (key: keyof typeof form, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleNameChange = (v: string) => {
    set("name", v);
    if (autoId) set("id", slugify(v));
  };

  return (
    <div className="bg-white rounded-xl border border-[#e4e4e7] p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Full Name *</label>
          <input value={form.name} onChange={e => handleNameChange(e.target.value)}
            placeholder="e.g. Leo Tolstoy"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* ID / slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">ID / Slug *</label>
          <input value={form.id} onChange={e => { setAutoId(false); set("id", e.target.value); }}
            placeholder="e.g. leo-tolstoy"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Nationality */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Nationality</label>
          <input value={form.nationality} onChange={e => set("nationality", e.target.value)}
            placeholder="Russian"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Born */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Born</label>
            <input type="number" value={form.born ?? ""} onChange={e => set("born", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="1828"
              className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Died</label>
            <input type="number" value={form.died ?? ""} onChange={e => set("died", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="1910"
              className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
          </div>
        </div>
        {/* Portrait Upload */}
        <div className="sm:col-span-2">
          <ImageUpload
            value={form.portrait}
            onChange={v => set("portrait", v)}
            folder="authors"
            aspectClass="aspect-[3/4]"
            label="Portrait Photo"
            hint="Upload a portrait (JPEG / PNG / WebP, max 5 MB). You can also paste an external URL."
          />
        </div>
        {/* Short Bio */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Short Bio (card preview)</label>
          <textarea rows={2} value={form.short_bio} onChange={e => set("short_bio", e.target.value)}
            placeholder="One or two sentences for the author card…"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-none focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Full Bio */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Full Biography</label>
          <textarea rows={6} value={form.full_bio} onChange={e => set("full_bio", e.target.value)}
            placeholder="Complete biography shown on the author page…"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-y focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Counts */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Novel Count</label>
          <input type="number" min={0} value={form.novel_count} onChange={e => set("novel_count", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Short Story Count</label>
          <input type="number" min={0} value={form.short_story_count} onChange={e => set("short_story_count", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-[#f4f4f5]">
        <button
          onClick={() => onSave({ ...form })}
          disabled={saving || !form.name.trim() || !form.id.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Author"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-sans text-[#71717a] hover:text-[#18181b] transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── AdminAuthors Page ─────────────────────────────────────────────────────────

type ViewMode = "list" | "add" | "edit";

const AdminAuthors = () => {
  const [authors, setAuthors] = useState<CmsAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<ViewMode>("list");
  const [editing, setEditing] = useState<CmsAuthor | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchCmsAuthors();
    if (data.length === 0) {
      // Seed from static on first load
      setAuthors(
        AUTHORS.map((a, i) => ({
          id: a.id, name: a.name, nationality: a.nationality,
          born: a.born, died: a.died ?? null, portrait: a.portrait,
          short_bio: a.shortBio, full_bio: a.fullBio,
          novel_count: a.novelCount, short_story_count: a.shortStoryCount,
          sort_order: i,
        }))
      );
    } else {
      setAuthors(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: Omit<CmsAuthor, "sort_order">) => {
    setSaving(true);
    const payload = {
      ...data,
      sort_order: editing ? editing.sort_order : authors.length,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase
      .from("cms_authors")
      .upsert(payload, { onConflict: "id" });
    setSaving(false);
    if (error) return toast.error("Save failed: " + error.message);
    toast.success(editing ? "Author updated." : "Author added.");
    setMode("list");
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cms_authors").delete().eq("id", id);
    if (error) return toast.error("Delete failed: " + error.message);
    toast.success("Author deleted.");
    setDeleteId(null);
    load();
  };

  const filtered = authors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-5 h-5 animate-spin text-[#71717a]" />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#18181b]">Authors</h1>
          <p className="text-sm text-[#71717a] font-sans mt-1">
            {mode === "list" ? `${authors.length} authors in the library.` : mode === "add" ? "Add a new author." : `Editing ${editing?.name}.`}
          </p>
        </div>
        {mode === "list" && (
          <button
            onClick={() => { setEditing(null); setMode("add"); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />Add Author
          </button>
        )}
        {mode !== "list" && (
          <button onClick={() => { setMode("list"); setEditing(null); }} className="flex items-center gap-1.5 text-sm font-sans text-[#71717a] hover:text-[#18181b]">
            <X className="w-4 h-4" />Cancel
          </button>
        )}
      </div>

      {/* Form */}
      {(mode === "add" || mode === "edit") && (
        <div className="mb-8">
          <AuthorForm
            initial={editing ?? undefined}
            onSave={handleSave}
            onCancel={() => { setMode("list"); setEditing(null); }}
            saving={saving}
          />
        </div>
      )}

      {/* List */}
      {mode === "list" && (
        <>
          <div className="relative mb-5">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
            <input
              type="text"
              placeholder="Search authors…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10"
            />
          </div>

          <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
            {filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-[#a1a1aa] font-sans">No authors found.</div>
            )}
            {filtered.map((author, i) => (
              <div key={author.id} className={cn("flex items-center gap-4 px-5 py-4", i > 0 && "border-t border-[#f4f4f5]")}>
                <div className="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#f4f4f5]">
                  {author.portrait && <img src={author.portrait} alt={author.name} className="w-full h-full object-cover object-top" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-semibold text-[#18181b]">{author.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="text-xs text-[#a1a1aa]">{author.nationality}</span>
                    {author.born && <span className="text-xs text-[#a1a1aa]">{author.born}{author.died ? `–${author.died}` : "–present"}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="hidden sm:flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                    <BookMarked className="w-3 h-3" />{author.novel_count}
                  </span>
                  <span className="hidden sm:flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full">
                    <BookOpen className="w-3 h-3" />{author.short_story_count}
                  </span>
                  <Link to={`/admin/authors/${author.id}/faqs`}
                    className="hidden sm:flex items-center gap-1 text-xs font-sans text-[#71717a] hover:text-[#18181b] bg-[#f4f4f5] hover:bg-[#ebebeb] px-2.5 py-1.5 rounded-lg transition-colors">
                    FAQs
                  </Link>
                  <Link to={`/author/${author.id}`} target="_blank" className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
                    <Globe className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => { setEditing(author); setMode("edit"); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(author.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl border border-[#e4e4e7] p-6 max-w-xs w-full shadow-xl">
            <h3 className="font-serif text-lg font-bold text-[#18181b] mb-2">Delete Author?</h3>
            <p className="text-sm font-sans text-[#71717a] mb-6 leading-relaxed">
              This will permanently delete the author and all their stories and chapters from the CMS database.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-sans font-semibold hover:bg-red-600 transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans text-[#52525b] hover:bg-[#f4f4f5] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuthors;
