import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  CmsPoet, CmsPoem, fetchPoets, fetchPoems, poetrySlugify
} from "@/hooks/usePoetryData";
import {
  Plus, Search, Pencil, Trash2, Globe, Loader2,
  Feather, X, ChevronDown, Minus
} from "lucide-react";
import ImageUpload from "@/components/features/ImageUpload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// ── Tag Input ─────────────────────────────────────────────────────────────────

function TagsInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => { if (!input.trim()) return; onChange([...tags, input.trim()]); setInput(""); };
  return (
    <div className="space-y-1.5 sm:col-span-2">
      <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Tags / Themes</label>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="e.g. love, nature, mortality…"
          className="flex-1 px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        <button onClick={add} className="px-3 py-2.5 bg-[#f4f4f5] hover:bg-[#ebebeb] rounded-lg text-sm text-[#52525b] transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        {tags.map((t, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs font-sans bg-[#f4f4f5] text-[#52525b] px-2.5 py-1 rounded-full">
            {t}
            <button onClick={() => onChange(tags.filter((_, idx) => idx !== i))} className="text-[#a1a1aa] hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Poet Form ─────────────────────────────────────────────────────────────────

interface PoetFormProps {
  initial?: Partial<CmsPoet>;
  onSave: (data: Omit<CmsPoet, "sort_order" | "poem_count">) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function PoetForm({ initial, onSave, onCancel, saving }: PoetFormProps) {
  const [form, setForm] = useState<Omit<CmsPoet, "sort_order" | "poem_count">>({
    id: "", name: "", nationality: "", born: null, died: null,
    portrait: "", short_bio: "", full_bio: "",
    ...initial,
  });
  const [autoId, setAutoId] = useState(!initial?.id);
  const set = (key: keyof typeof form, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="bg-white rounded-xl border border-[#e4e4e7] p-6 space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-[#f4f4f5]">
        <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
          <Feather className="w-4 h-4 text-violet-600" />
        </div>
        <span className="text-sm font-sans font-semibold text-[#18181b]">Poet Details</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Name *</label>
          <input value={form.name}
            onChange={e => { set("name", e.target.value); if (autoId) set("id", poetrySlugify(e.target.value)); }}
            placeholder="e.g. William Shakespeare"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">ID / Slug *</label>
          <input value={form.id}
            onChange={e => { setAutoId(false); set("id", e.target.value); }}
            placeholder="e.g. william-shakespeare"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Nationality</label>
          <input value={form.nationality} onChange={e => set("nationality", e.target.value)} placeholder="English"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Born Year</label>
          <input type="number" value={form.born ?? ""} onChange={e => set("born", e.target.value ? parseInt(e.target.value) : null)}
            placeholder="1564"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Died Year</label>
          <input type="number" value={form.died ?? ""} onChange={e => set("died", e.target.value ? parseInt(e.target.value) : null)}
            placeholder="1616 (leave blank if living)"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="sm:col-span-2">
          <ImageUpload value={form.portrait} onChange={v => set("portrait", v)}
            folder="poets" aspectClass="aspect-[3/4]" label="Portrait Image"
            hint="Upload a portrait photo (JPEG / PNG / WebP, max 5 MB)." />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Short Bio <span className="text-[#a1a1aa] normal-case font-normal">(shown on cards)</span></label>
          <textarea rows={2} value={form.short_bio} onChange={e => set("short_bio", e.target.value)}
            placeholder="One or two sentence intro…"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-none focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Full Biography</label>
          <textarea rows={5} value={form.full_bio} onChange={e => set("full_bio", e.target.value)}
            placeholder="Detailed biography…"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-y focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-[#f4f4f5]">
        <button onClick={() => onSave({ ...form })}
          disabled={saving || !form.name.trim() || !form.id.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Poet"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-sans text-[#71717a] hover:text-[#18181b] transition-colors">Cancel</button>
        <p className="text-xs text-[#a1a1aa] font-sans ml-auto">Changes go live immediately.</p>
      </div>
    </div>
  );
}

// ── Poem Form ─────────────────────────────────────────────────────────────────

interface PoemFormProps {
  initial?: Partial<CmsPoem>;
  poets: CmsPoet[];
  onSave: (data: Omit<CmsPoem, "sort_order">) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function PoemForm({ initial, poets, onSave, onCancel, saving }: PoemFormProps) {
  const [form, setForm] = useState<Omit<CmsPoem, "sort_order">>({
    id: "", poet_id: "", title: "", year: null, form: "",
    tags: [], content: "", is_active: true,
    ...initial,
  });
  const [autoId, setAutoId] = useState(!initial?.id);
  const set = (key: keyof typeof form, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="bg-white rounded-xl border border-[#e4e4e7] p-6 space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-[#f4f4f5]">
        <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
          <Feather className="w-4 h-4 text-violet-600" />
        </div>
        <span className="text-sm font-sans font-semibold text-[#18181b]">Poem Details</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Title *</label>
          <input value={form.title}
            onChange={e => { set("title", e.target.value); if (autoId) set("id", poetrySlugify(e.target.value)); }}
            placeholder="e.g. Sonnet 18"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">ID / Slug *</label>
          <input value={form.id}
            onChange={e => { setAutoId(false); set("id", e.target.value); }}
            placeholder="e.g. sonnet-18"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Poet *</label>
          <div className="relative">
            <select value={form.poet_id} onChange={e => set("poet_id", e.target.value)}
              className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#18181b]/10 pr-8">
              <option value="">Select poet…</option>
              {poets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Year Written</label>
          <input type="number" value={form.year ?? ""} onChange={e => set("year", e.target.value ? parseInt(e.target.value) : null)}
            placeholder="1609"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Poetic Form</label>
          <input value={form.form} onChange={e => set("form", e.target.value)}
            placeholder="e.g. Sonnet, Ode, Free Verse, Ballad…"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <TagsInput tags={form.tags} onChange={t => set("tags", t)} />
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">
            Poem Content *
            <span className="text-[#a1a1aa] normal-case font-normal ml-1">(preserve line breaks — each line on its own line, blank line = stanza break)</span>
          </label>
          <textarea rows={14} value={form.content} onChange={e => set("content", e.target.value)}
            placeholder={"Shall I compare thee to a summer's day?\nThou art more lovely and more temperate:\n\nRough winds do shake the darling buds of May,\nAnd summer's lease hath all too short a date:"}
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-serif resize-y focus:outline-none focus:ring-2 focus:ring-[#18181b]/10 leading-relaxed"
            style={{ whiteSpace: "pre" }} />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <button onClick={() => set("is_active", !form.is_active)}
            className={cn("relative w-10 h-6 rounded-full transition-colors flex-shrink-0", form.is_active ? "bg-emerald-500" : "bg-[#d4d4d8]")}>
            <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all", form.is_active ? "left-5" : "left-1")} />
          </button>
          <span className="text-sm font-sans text-[#52525b]">Visible to readers</span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-[#f4f4f5]">
        <button onClick={() => onSave({ ...form })}
          disabled={saving || !form.title.trim() || !form.id.trim() || !form.poet_id || !form.content.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Poem"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-sans text-[#71717a] hover:text-[#18181b] transition-colors">Cancel</button>
        <p className="text-xs text-[#a1a1aa] font-sans ml-auto">Changes go live immediately.</p>
      </div>
    </div>
  );
}

// ── AdminPoetry Page ──────────────────────────────────────────────────────────

type Tab = "poets" | "poems";
type FormMode = "none" | "add-poet" | "edit-poet" | "add-poem" | "edit-poem";

const AdminPoetry = () => {
  const [tab, setTab] = useState<Tab>("poets");
  const [poets, setPoets] = useState<CmsPoet[]>([]);
  const [poems, setPoems] = useState<CmsPoem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<FormMode>("none");
  const [editingPoet, setEditingPoet] = useState<CmsPoet | null>(null);
  const [editingPoem, setEditingPoem] = useState<CmsPoem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; type: "poet" | "poem" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, pm] = await Promise.all([fetchPoets(), fetchPoems()]);
    setPoets(p);
    setPoems(pm);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Poet save ──────────────────────────────────────────────────────────────
  const savePoet = async (data: Omit<CmsPoet, "sort_order" | "poem_count">) => {
    setSaving(true);
    const isEdit = mode === "edit-poet";
    const poemCount = poems.filter(pm => pm.poet_id === data.id).length;
    const payload = {
      ...data,
      poem_count: isEdit ? (editingPoet?.poem_count ?? poemCount) : poemCount,
      sort_order: isEdit ? (editingPoet?.sort_order ?? poets.length) : poets.length,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("cms_poets").upsert(payload, { onConflict: "id" });
    if (error) { setSaving(false); return toast.error("Save failed: " + error.message); }
    toast.success(isEdit ? "Poet updated." : "Poet added.");
    setSaving(false);
    setMode("none");
    setEditingPoet(null);
    load();
  };

  // ── Poem save ──────────────────────────────────────────────────────────────
  const savePoem = async (data: Omit<CmsPoem, "sort_order">) => {
    setSaving(true);
    const isEdit = mode === "edit-poem";
    const existingPoems = poems.filter(pm => pm.poet_id === data.poet_id);
    const payload = {
      ...data,
      sort_order: isEdit ? (editingPoem?.sort_order ?? existingPoems.length) : existingPoems.length,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("cms_poems").upsert(payload, { onConflict: "id" });
    if (error) { setSaving(false); return toast.error("Save failed: " + error.message); }

    // Update poet's poem_count
    const newCount = poems.filter(pm => pm.poet_id === data.poet_id && pm.id !== data.id).length + 1;
    await supabase.from("cms_poets").update({ poem_count: newCount }).eq("id", data.poet_id);

    toast.success(isEdit ? "Poem updated." : "Poem published.");
    setSaving(false);
    setMode("none");
    setEditingPoem(null);
    load();
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const table = deleteTarget.type === "poet" ? "cms_poets" : "cms_poems";
    const { error } = await supabase.from(table).delete().eq("id", deleteTarget.id);
    if (error) return toast.error("Delete failed: " + error.message);
    toast.success(`${deleteTarget.type === "poet" ? "Poet" : "Poem"} deleted.`);
    setDeleteTarget(null);
    load();
  };

  const togglePoemActive = async (poem: CmsPoem) => {
    const { error } = await supabase.from("cms_poems").update({ is_active: !poem.is_active }).eq("id", poem.id);
    if (error) return toast.error("Update failed.");
    setPoems(p => p.map(pm => pm.id === poem.id ? { ...pm, is_active: !pm.is_active } : pm));
  };

  const poetName = (id: string) => poets.find(p => p.id === id)?.name ?? id;

  const filteredPoets = poets.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.nationality.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPoems = poems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    poetName(p.poet_id).toLowerCase().includes(search.toLowerCase())
  );

  const inForm = mode !== "none";

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-5 h-5 animate-spin text-[#71717a]" />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#18181b]">Poetry</h1>
          <p className="text-sm text-[#71717a] font-sans mt-1">
            {mode === "none"
              ? `${poets.length} poets · ${poems.length} poems`
              : mode === "add-poet" ? "Add a new poet"
              : mode === "edit-poet" ? `Editing poet: ${editingPoet?.name}`
              : mode === "add-poem" ? "Add a new poem"
              : `Editing poem: ${editingPoem?.title}`}
          </p>
        </div>
        {mode === "none" && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { setEditingPoet(null); setMode("add-poet"); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-sans font-semibold hover:bg-violet-700 transition-all">
              <Plus className="w-4 h-4" />Add Poet
            </button>
            <button
              onClick={() => { setEditingPoem(null); setMode("add-poem"); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-500 text-white rounded-lg text-sm font-sans font-semibold hover:bg-violet-600 transition-all">
              <Feather className="w-4 h-4" />Add Poem
            </button>
          </div>
        )}
        {inForm && (
          <button onClick={() => { setMode("none"); setEditingPoet(null); setEditingPoem(null); }}
            className="flex items-center gap-1.5 text-sm font-sans text-[#71717a] hover:text-[#18181b]">
            <X className="w-4 h-4" />Cancel
          </button>
        )}
      </div>

      {/* Forms */}
      {(mode === "add-poet" || mode === "edit-poet") && (
        <div className="mb-8">
          <PoetForm initial={editingPoet ?? undefined} onSave={savePoet} onCancel={() => { setMode("none"); setEditingPoet(null); }} saving={saving} />
        </div>
      )}
      {(mode === "add-poem" || mode === "edit-poem") && (
        <div className="mb-8">
          <PoemForm initial={editingPoem ?? undefined} poets={poets} onSave={savePoem} onCancel={() => { setMode("none"); setEditingPoem(null); }} saving={saving} />
        </div>
      )}

      {/* List */}
      {mode === "none" && (
        <>
          {/* Tabs + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex gap-1 bg-white border border-[#e4e4e7] rounded-lg p-1 flex-shrink-0">
              {(["poets", "poems"] as Tab[]).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={cn("px-4 py-1.5 rounded-md text-xs font-sans font-medium capitalize transition-all",
                    tab === t ? "bg-[#18181b] text-white" : "text-[#71717a] hover:text-[#18181b]")}>
                  {t === "poets" ? `Poets (${poets.length})` : `Poems (${poems.length})`}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
              <input type="text" placeholder={`Search ${tab}…`} value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
            </div>
          </div>

          {/* Poets list */}
          {tab === "poets" && (
            <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
              {filteredPoets.length === 0 && (
                <div className="py-16 text-center text-sm text-[#a1a1aa] font-sans">
                  No poets found. <button onClick={() => setMode("add-poet")} className="underline text-[#71717a] hover:text-[#18181b]">Add a poet</button>.
                </div>
              )}
              {filteredPoets.map((poet, i) => (
                <div key={poet.id} className={cn("flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#fafafa]", i > 0 && "border-t border-[#f4f4f5]")}>
                  <div className="w-10 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-violet-50">
                    {poet.portrait ? <img src={poet.portrait} alt="" className="w-full h-full object-cover object-top" /> : <div className="w-full h-full flex items-center justify-center"><Feather className="w-4 h-4 text-violet-300" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold text-[#18181b] truncate">{poet.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {poet.nationality && <span className="text-xs text-[#a1a1aa]">{poet.nationality}</span>}
                      <span className="text-xs text-[#c4c4c7]">{poet.poem_count} poems</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link to={`/poet/${poet.id}`} target="_blank"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors" title="View">
                      <Globe className="w-4 h-4" />
                    </Link>
                    <button onClick={() => { setEditingPoet(poet); setMode("edit-poet"); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget({ id: poet.id, name: poet.name, type: "poet" })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Poems list */}
          {tab === "poems" && (
            <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
              {filteredPoems.length === 0 && (
                <div className="py-16 text-center text-sm text-[#a1a1aa] font-sans">
                  No poems found. <button onClick={() => setMode("add-poem")} className="underline text-[#71717a] hover:text-[#18181b]">Add a poem</button>.
                </div>
              )}
              {filteredPoems.map((poem, i) => (
                <div key={poem.id}
                  className={cn("flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#fafafa]",
                    i > 0 && "border-t border-[#f4f4f5]", !poem.is_active && "opacity-50")}>
                  <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <Feather className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold text-[#18181b] truncate">{poem.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-[#a1a1aa]">{poetName(poem.poet_id)}</span>
                      {poem.form && <span className="text-[10px] bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded-full font-sans">{poem.form}</span>}
                      {poem.year && <span className="text-[10px] text-[#c4c4c7]">{poem.year}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => togglePoemActive(poem)}
                      className={cn("hidden sm:flex items-center gap-1 text-xs font-sans px-2.5 py-1.5 rounded-lg border transition-all",
                        poem.is_active
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          : "bg-[#f4f4f5] border-[#e4e4e7] text-[#71717a] hover:bg-[#ebebeb]")}>
                      {poem.is_active ? "Live" : "Hidden"}
                    </button>
                    <Link to={`/poem/${poem.id}`} target="_blank"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors" title="View">
                      <Globe className="w-4 h-4" />
                    </Link>
                    <button onClick={() => { setEditingPoem(poem); setMode("edit-poem"); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget({ id: poem.id, name: poem.title, type: "poem" })}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white rounded-2xl border border-[#e4e4e7] p-6 max-w-sm w-full shadow-xl">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#18181b] mb-1">Delete {deleteTarget.type === "poet" ? "Poet" : "Poem"}?</h3>
            <p className="text-sm font-sans text-[#71717a] mb-6">
              <span className="font-semibold text-[#18181b]">{deleteTarget.name}</span> will be permanently removed.
              {deleteTarget.type === "poet" && " All their poems will also be deleted."}
            </p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-sans font-semibold hover:bg-red-600 transition-all">Delete Forever</button>
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans text-[#52525b] hover:bg-[#f4f4f5] transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPoetry;
