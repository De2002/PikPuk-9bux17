import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  CmsStory, CmsAuthor, CmsQuote, fetchCmsAuthors, fetchCmsStories,
  fetchCmsQuotes, slugify
} from "@/hooks/useCmsData";
import { AUTHORS } from "@/constants/authors";
import {
  Plus, Search, Pencil, Trash2, Globe, Loader2,
  BookOpen, Minus, X, ChevronDown, BookMarked, FileText
} from "lucide-react";
import ImageUpload from "@/components/features/ImageUpload";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Shared field helpers ──────────────────────────────────────────────────────

function ThemesInput({
  themes,
  onChange,
}: {
  themes: string[];
  onChange: (t: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const add = () => {
    if (!input.trim()) return;
    onChange([...themes, input.trim()]);
    setInput("");
  };
  return (
    <div className="space-y-1.5 sm:col-span-2">
      <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Themes</label>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Type a theme and press Enter…"
          className="flex-1 px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10"
        />
        <button onClick={add} className="px-3 py-2.5 bg-[#f4f4f5] hover:bg-[#ebebeb] rounded-lg text-sm text-[#52525b] transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        {themes.map((t, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs font-sans bg-[#f4f4f5] text-[#52525b] px-2.5 py-1 rounded-full">
            {t}
            <button onClick={() => onChange(themes.filter((_, idx) => idx !== i))} className="text-[#a1a1aa] hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function QuotesEditor({
  quotes,
  onChange,
}: {
  quotes: { text: string; context: string }[];
  onChange: (q: { text: string; context: string }[]) => void;
}) {
  const update = (i: number, field: "text" | "context", val: string) =>
    onChange(quotes.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  return (
    <div className="space-y-3 pt-4 border-t border-[#f4f4f5]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Notable Quotes</label>
        <button onClick={() => onChange([...quotes, { text: "", context: "" }])}
          className="flex items-center gap-1.5 text-xs font-sans text-[#52525b] hover:text-[#18181b] transition-colors">
          <Plus className="w-3.5 h-3.5" />Add Quote
        </button>
      </div>
      {quotes.map((q, i) => (
        <div key={i} className="space-y-2 p-3 bg-[#fafafa] rounded-lg border border-[#f4f4f5]">
          <div className="flex items-start gap-2">
            <textarea rows={2} value={q.text} onChange={e => update(i, "text", e.target.value)}
              placeholder="Quote text…"
              className="flex-1 px-3 py-2 border border-[#e4e4e7] rounded-lg text-sm font-serif resize-none focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
            <button onClick={() => onChange(quotes.filter((_, idx) => idx !== i))}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 mt-0.5">
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
          <input value={q.context} onChange={e => update(i, "context", e.target.value)}
            placeholder="Context / attribution…"
            className="w-full px-3 py-2 border border-[#e4e4e7] rounded-lg text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
      ))}
      {quotes.length === 0 && (
        <p className="text-xs text-[#a1a1aa] font-sans">No quotes yet. Click Add Quote to add one.</p>
      )}
    </div>
  );
}

// ── NOVEL FORM ────────────────────────────────────────────────────────────────

interface NovelFormProps {
  initial?: Partial<CmsStory & { quotes: CmsQuote[] }>;
  authors: CmsAuthor[];
  onSave: (data: Omit<CmsStory, "sort_order">, quotes: { text: string; context: string }[]) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function NovelForm({ initial, authors, onSave, onCancel, saving }: NovelFormProps) {
  const [form, setForm] = useState<Omit<CmsStory, "sort_order">>({
    id: "", author_id: "", title: "",
    year: null, genre: "", cover_url: "", description: "",
    synopsis: null, themes: [], pages: null, read_time: null,
    free_chapters: 2, is_active: true,
    type: "novel" as const,
    ...initial,
  });
  const [autoId, setAutoId] = useState(!initial?.id);
  const [quotes, setQuotes] = useState<{ text: string; context: string }[]>(
    initial?.quotes?.map(q => ({ text: q.text, context: q.context ?? "" })) ?? []
  );

  const set = (key: keyof typeof form, val: unknown) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="bg-white rounded-xl border border-[#e4e4e7] p-6 space-y-5">
      {/* Section label */}
      <div className="flex items-center gap-2 pb-2 border-b border-[#f4f4f5]">
        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
          <BookMarked className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-sans font-semibold text-[#18181b]">Novel Details</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Title *</label>
          <input value={form.title}
            onChange={e => { set("title", e.target.value); if (autoId) set("id", slugify(e.target.value)); }}
            placeholder="e.g. War and Peace"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">ID / Slug *</label>
          <input value={form.id}
            onChange={e => { setAutoId(false); set("id", e.target.value); }}
            placeholder="e.g. war-and-peace"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Author */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Author *</label>
          <div className="relative">
            <select value={form.author_id} onChange={e => set("author_id", e.target.value)}
              className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#18181b]/10 pr-8">
              <option value="">Select author…</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none" />
          </div>
        </div>
        {/* Year */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Publication Year</label>
          <input type="number" value={form.year ?? ""}
            onChange={e => set("year", e.target.value ? parseInt(e.target.value) : null)}
            placeholder="1869"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Genre */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Genre</label>
          <input value={form.genre} onChange={e => set("genre", e.target.value)} placeholder="Historical Fiction"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Pages */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Page Count</label>
          <input type="number" value={form.pages ?? ""}
            onChange={e => set("pages", e.target.value ? parseInt(e.target.value) : null)}
            placeholder="1225"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Free Chapters */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Free Chapters (Guest Limit)</label>
          <input type="number" min={0} value={form.free_chapters}
            onChange={e => set("free_chapters", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
          <p className="text-[11px] text-[#a1a1aa] font-sans">Guests can read this many chapters before being prompted to sign up.</p>
        </div>
        {/* Cover Image Upload */}
        <div className="sm:col-span-2">
          <ImageUpload
            value={form.cover_url}
            onChange={v => set("cover_url", v)}
            folder="covers"
            aspectClass="aspect-[2/3]"
            label="Cover Image"
            hint="Upload a book cover (JPEG / PNG / WebP, max 5 MB). You can also paste an external URL."
          />
        </div>
        {/* Description */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Short Description <span className="text-[#a1a1aa] normal-case font-normal">(shown on story cards)</span></label>
          <textarea rows={2} value={form.description} onChange={e => set("description", e.target.value)}
            placeholder="One or two sentences describing the novel…"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-none focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Synopsis */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Full Synopsis <span className="text-[#a1a1aa] normal-case font-normal">(shown on story detail page)</span></label>
          <textarea rows={6} value={form.synopsis ?? ""}
            onChange={e => set("synopsis", e.target.value || null)}
            placeholder="Detailed summary of the novel's plot and significance…"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-y focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Themes */}
        <ThemesInput themes={form.themes} onChange={t => set("themes", t)} />
        {/* Visibility */}
        <div className="flex items-center gap-3 sm:col-span-2">
          <button onClick={() => set("is_active", !form.is_active)}
            className={cn("relative w-10 h-6 rounded-full transition-colors flex-shrink-0", form.is_active ? "bg-emerald-500" : "bg-[#d4d4d8]")}>
            <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all", form.is_active ? "left-5" : "left-1")} />
          </button>
          <span className="text-sm font-sans text-[#52525b]">Visible to readers</span>
        </div>
      </div>

      <QuotesEditor quotes={quotes} onChange={setQuotes} />

      <div className="flex items-center gap-3 pt-2 border-t border-[#f4f4f5]">
        <button
          onClick={() => onSave({ ...form }, quotes.filter(q => q.text.trim()))}
          disabled={saving || !form.title.trim() || !form.id.trim() || !form.author_id}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Novel"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-sans text-[#71717a] hover:text-[#18181b] transition-colors">Cancel</button>
        <p className="text-xs text-[#a1a1aa] font-sans ml-auto">Changes go live immediately.</p>
      </div>
    </div>
  );
}

// ── SHORT STORY FORM ──────────────────────────────────────────────────────────

interface ShortStoryFormProps {
  initial?: Partial<CmsStory & { quotes: CmsQuote[] }>;
  authors: CmsAuthor[];
  onSave: (data: Omit<CmsStory, "sort_order">, quotes: { text: string; context: string }[]) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function ShortStoryForm({ initial, authors, onSave, onCancel, saving }: ShortStoryFormProps) {
  const [form, setForm] = useState<Omit<CmsStory, "sort_order">>({
    id: "", author_id: "", title: "",
    year: null, genre: "", cover_url: "", description: "",
    synopsis: null, themes: [], pages: null, read_time: null,
    free_chapters: 0, is_active: true,
    type: "short-story" as const,
    ...initial,
  });
  const [autoId, setAutoId] = useState(!initial?.id);
  const [quotes, setQuotes] = useState<{ text: string; context: string }[]>(
    initial?.quotes?.map(q => ({ text: q.text, context: q.context ?? "" })) ?? []
  );

  const set = (key: keyof typeof form, val: unknown) =>
    setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="bg-white rounded-xl border border-[#e4e4e7] p-6 space-y-5">
      {/* Section label */}
      <div className="flex items-center gap-2 pb-2 border-b border-[#f4f4f5]">
        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
          <FileText className="w-4 h-4 text-amber-600" />
        </div>
        <span className="text-sm font-sans font-semibold text-[#18181b]">Short Story Details</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Title *</label>
          <input value={form.title}
            onChange={e => { set("title", e.target.value); if (autoId) set("id", slugify(e.target.value)); }}
            placeholder="e.g. The Overcoat"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">ID / Slug *</label>
          <input value={form.id}
            onChange={e => { setAutoId(false); set("id", e.target.value); }}
            placeholder="e.g. the-overcoat"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Author */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Author *</label>
          <div className="relative">
            <select value={form.author_id} onChange={e => set("author_id", e.target.value)}
              className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#18181b]/10 pr-8">
              <option value="">Select author…</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none" />
          </div>
        </div>
        {/* Year */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Publication Year</label>
          <input type="number" value={form.year ?? ""}
            onChange={e => set("year", e.target.value ? parseInt(e.target.value) : null)}
            placeholder="1842"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Genre */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Genre</label>
          <input value={form.genre} onChange={e => set("genre", e.target.value)} placeholder="Romantic Fiction"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Read Time */}
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Estimated Read Time</label>
          <input value={form.read_time ?? ""} onChange={e => set("read_time", e.target.value || null)}
            placeholder="e.g. 2.5 hrs or 30 min"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Cover Image Upload */}
        <div className="sm:col-span-2">
          <ImageUpload
            value={form.cover_url}
            onChange={v => set("cover_url", v)}
            folder="covers"
            aspectClass="aspect-[2/3]"
            label="Cover Image (optional)"
            hint="Upload a cover image or leave blank — a numbered badge will display if no image is set."
          />
        </div>
        {/* Description */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Short Description <span className="text-[#a1a1aa] normal-case font-normal">(shown on story cards)</span></label>
          <textarea rows={2} value={form.description} onChange={e => set("description", e.target.value)}
            placeholder="One or two sentences for the story card…"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-none focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Synopsis */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Synopsis <span className="text-[#a1a1aa] normal-case font-normal">(shown on story detail page)</span></label>
          <textarea rows={5} value={form.synopsis ?? ""}
            onChange={e => set("synopsis", e.target.value || null)}
            placeholder="What is this story about? Who are the characters? What makes it significant?"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-y focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        {/* Themes */}
        <ThemesInput themes={form.themes} onChange={t => set("themes", t)} />
        {/* Visibility */}
        <div className="flex items-center gap-3 sm:col-span-2">
          <button onClick={() => set("is_active", !form.is_active)}
            className={cn("relative w-10 h-6 rounded-full transition-colors flex-shrink-0", form.is_active ? "bg-emerald-500" : "bg-[#d4d4d8]")}>
            <span className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all", form.is_active ? "left-5" : "left-1")} />
          </button>
          <span className="text-sm font-sans text-[#52525b]">Visible to readers</span>
        </div>
      </div>

      <QuotesEditor quotes={quotes} onChange={setQuotes} />

      <div className="flex items-center gap-3 pt-2 border-t border-[#f4f4f5]">
        <button
          onClick={() => onSave({ ...form }, quotes.filter(q => q.text.trim()))}
          disabled={saving || !form.title.trim() || !form.id.trim() || !form.author_id}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Short Story"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-sans text-[#71717a] hover:text-[#18181b] transition-colors">Cancel</button>
        <p className="text-xs text-[#a1a1aa] font-sans ml-auto">Changes go live immediately.</p>
      </div>
    </div>
  );
}

// ── AdminStories Page ─────────────────────────────────────────────────────────

type ViewMode = "list" | "add-novel" | "add-short" | "edit-novel" | "edit-short";

const AdminStories = () => {
  const [stories, setStories] = useState<CmsStory[]>([]);
  const [authors, setAuthors] = useState<CmsAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "novel" | "short-story">("all");
  const [mode, setMode] = useState<ViewMode>("list");
  const [editing, setEditing] = useState<CmsStory | null>(null);
  const [editQuotes, setEditQuotes] = useState<CmsQuote[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [cmsAuthors, cmsStories] = await Promise.all([fetchCmsAuthors(), fetchCmsStories()]);
    // Seed fallback display from static if DB is empty
    if (cmsStories.length === 0) {
      const staticStories: CmsStory[] = [];
      AUTHORS.forEach((a, ai) => {
        a.stories.forEach((s, si) => {
          staticStories.push({
            id: s.id, author_id: a.id, title: s.title, type: s.type,
            year: s.year, genre: s.genre, cover_url: s.coverUrl,
            description: s.description, synopsis: s.synopsis ?? null,
            themes: s.themes ?? [], pages: s.pages ?? null,
            read_time: s.readTime ?? null, free_chapters: s.freeChapters ?? 2,
            sort_order: ai * 100 + si, is_active: true,
          });
        });
      });
      setStories(staticStories);
    } else {
      setStories(cmsStories);
    }
    if (cmsAuthors.length === 0) {
      setAuthors(AUTHORS.map((a, i) => ({
        id: a.id, name: a.name, nationality: a.nationality,
        born: a.born, died: a.died ?? null, portrait: a.portrait,
        short_bio: a.shortBio, full_bio: a.fullBio,
        novel_count: a.novelCount, short_story_count: a.shortStoryCount,
        sort_order: i,
      })));
    } else {
      setAuthors(cmsAuthors);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleEdit = async (story: CmsStory) => {
    const quotes = await fetchCmsQuotes(story.id);
    setEditQuotes(quotes);
    setEditing(story);
    setMode(story.type === "novel" ? "edit-novel" : "edit-short");
  };

  const handleSave = async (data: Omit<CmsStory, "sort_order">, quotes: { text: string; context: string }[]) => {
    setSaving(true);
    const payload = {
      ...data,
      sort_order: editing ? editing.sort_order : stories.length,
      updated_at: new Date().toISOString(),
    };
    const { error: storyErr } = await supabase
      .from("cms_stories")
      .upsert(payload, { onConflict: "id" });

    if (storyErr) { setSaving(false); return toast.error("Save failed: " + storyErr.message); }

    // Replace quotes
    await supabase.from("cms_story_quotes").delete().eq("story_id", data.id);
    if (quotes.length > 0) {
      await supabase.from("cms_story_quotes").insert(
        quotes.map((q, i) => ({ story_id: data.id, text: q.text, context: q.context || null, sort_order: i }))
      );
    }

    setSaving(false);
    const isEdit = mode.startsWith("edit");
    toast.success(isEdit ? "Story updated and live." : "Story published and live.");
    setMode("list");
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("cms_stories").delete().eq("id", id);
    if (error) return toast.error("Delete failed: " + error.message);
    toast.success("Story deleted.");
    setDeleteId(null);
    setDeleteTitle("");
    load();
  };

  const toggleActive = async (story: CmsStory) => {
    const next = !story.is_active;
    const { error } = await supabase.from("cms_stories")
      .upsert({ ...story, is_active: next, updated_at: new Date().toISOString() }, { onConflict: "id" });
    if (error) return toast.error("Update failed.");
    setStories(s => s.map(r => r.id === story.id ? { ...r, is_active: next } : r));
  };

  const authorName = (id: string) => authors.find(a => a.id === id)?.name ?? id;

  const filtered = stories.filter(s => {
    const match = s.title.toLowerCase().includes(search.toLowerCase()) ||
      authorName(s.author_id).toLowerCase().includes(search.toLowerCase());
    const type = typeFilter === "all" || s.type === typeFilter;
    return match && type;
  });

  const isAdding = mode === "add-novel" || mode === "add-short";
  const isEditing = mode === "edit-novel" || mode === "edit-short";
  const inForm = isAdding || isEditing;

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
          <h1 className="font-serif text-2xl font-bold text-[#18181b]">Stories</h1>
          <p className="text-sm text-[#71717a] font-sans mt-1">
            {mode === "list"
              ? `${stories.length} stories · manage chapters and visibility.`
              : isEditing
              ? `Editing: ${editing?.title}`
              : mode === "add-novel"
              ? "Add a new novel."
              : "Add a new short story."}
          </p>
        </div>
        {mode === "list" && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => { setEditing(null); setEditQuotes([]); setMode("add-novel"); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-sans font-semibold hover:bg-blue-700 transition-all"
            >
              <BookMarked className="w-4 h-4" />
              Add Novel
            </button>
            <button
              onClick={() => { setEditing(null); setEditQuotes([]); setMode("add-short"); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-sans font-semibold hover:bg-amber-600 transition-all"
            >
              <FileText className="w-4 h-4" />
              Add Short Story
            </button>
          </div>
        )}
        {inForm && (
          <button onClick={() => { setMode("list"); setEditing(null); }}
            className="flex items-center gap-1.5 text-sm font-sans text-[#71717a] hover:text-[#18181b] flex-shrink-0">
            <X className="w-4 h-4" />Cancel
          </button>
        )}
      </div>

      {/* Forms */}
      {(mode === "add-novel" || mode === "edit-novel") && (
        <div className="mb-8">
          <NovelForm
            initial={editing ? { ...editing, quotes: editQuotes } : undefined}
            authors={authors}
            onSave={handleSave}
            onCancel={() => { setMode("list"); setEditing(null); }}
            saving={saving}
          />
        </div>
      )}

      {(mode === "add-short" || mode === "edit-short") && (
        <div className="mb-8">
          <ShortStoryForm
            initial={editing ? { ...editing, quotes: editQuotes } : undefined}
            authors={authors}
            onSave={handleSave}
            onCancel={() => { setMode("list"); setEditing(null); }}
            saving={saving}
          />
        </div>
      )}

      {/* List */}
      {mode === "list" && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]" />
              <input type="text" placeholder="Search stories or authors…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
            </div>
            <div className="flex gap-1 bg-white border border-[#e4e4e7] rounded-lg p-1">
              {(["all", "novel", "short-story"] as const).map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={cn("px-3 py-1.5 rounded-md text-xs font-sans font-medium capitalize transition-all",
                    typeFilter === t ? "bg-[#18181b] text-white" : "text-[#71717a] hover:text-[#18181b]")}>
                  {t === "all" ? "All" : t === "novel" ? "Novels" : "Short Stories"}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
            {filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-[#a1a1aa] font-sans">
                No stories found.{" "}
                <button onClick={() => setMode("add-novel")} className="underline text-[#71717a] hover:text-[#18181b]">Add a novel</button>
                {" "}or{" "}
                <button onClick={() => setMode("add-short")} className="underline text-[#71717a] hover:text-[#18181b]">add a short story</button>.
              </div>
            )}
            {filtered.map((story, i) => (
              <div key={story.id}
                className={cn("flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#fafafa]",
                  i > 0 && "border-t border-[#f4f4f5]",
                  !story.is_active && "opacity-50")}>
                {/* Mini cover */}
                <div className={cn("w-8 h-10 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold",
                  story.type === "novel" ? "bg-blue-50 text-blue-300" : "bg-amber-50 text-amber-400")}>
                  {story.cover_url
                    ? <img src={story.cover_url} alt="" className="w-full h-full object-cover" />
                    : story.type === "novel" ? <BookMarked className="w-4 h-4" /> : <FileText className="w-4 h-4" />
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-semibold text-[#18181b] truncate">{story.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-[#a1a1aa]">{authorName(story.author_id)}</span>
                    <span className={cn("text-[10px] font-sans px-1.5 py-0.5 rounded-full",
                      story.type === "novel" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-700")}>
                      {story.type === "novel" ? "Novel" : "Short Story"}
                    </span>
                    {story.year && <span className="text-[10px] text-[#c4c4c7]">{story.year}</span>}
                  </div>
                </div>
                {/* Novel: free chapters badge */}
                {story.type === "novel" && (
                  <span className="hidden lg:block text-xs font-sans text-[#71717a] flex-shrink-0 bg-[#f4f4f5] px-2 py-1 rounded-md">
                    {story.free_chapters} free ch.
                  </span>
                )}
                {/* Short story: read time */}
                {story.type === "short-story" && story.read_time && (
                  <span className="hidden lg:block text-xs font-sans text-[#71717a] flex-shrink-0 bg-[#f4f4f5] px-2 py-1 rounded-md">
                    {story.read_time}
                  </span>
                )}
                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleActive(story)}
                    className={cn("hidden sm:flex items-center gap-1 text-xs font-sans px-2.5 py-1.5 rounded-lg border transition-all",
                      story.is_active
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        : "bg-[#f4f4f5] border-[#e4e4e7] text-[#71717a] hover:bg-[#ebebeb]")}>
                    {story.is_active ? "Live" : "Hidden"}
                  </button>
                  {story.type === "novel" && (
                    <Link to={`/admin/stories/${story.id}/chapters`}
                      className="hidden sm:flex items-center gap-1 text-xs font-sans text-[#71717a] hover:text-[#18181b] bg-[#f4f4f5] hover:bg-[#ebebeb] px-2.5 py-1.5 rounded-lg transition-colors">
                      <BookOpen className="w-3.5 h-3.5" />
                      Chapters
                    </Link>
                  )}
                  <Link to={`/story/${story.id}`} target="_blank"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                    title="View live page">
                    <Globe className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleEdit(story)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                    title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { setDeleteId(story.id); setDeleteTitle(story.title); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#a1a1aa] font-sans">{filtered.length} of {stories.length} shown.</p>
        </>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setDeleteId(null); setDeleteTitle(""); }} />
          <div className="relative bg-white rounded-2xl border border-[#e4e4e7] p-6 max-w-sm w-full shadow-xl">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#18181b] mb-1">Delete Story?</h3>
            <p className="text-sm font-sans text-[#71717a] mb-1">
              <span className="font-semibold text-[#18181b]">{deleteTitle}</span> will be permanently removed from the library.
            </p>
            <p className="text-xs text-[#a1a1aa] font-sans mb-6">All chapters and quotes will also be deleted. This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-sans font-semibold hover:bg-red-600 transition-all">
                Delete Forever
              </button>
              <button
                onClick={() => { setDeleteId(null); setDeleteTitle(""); }}
                className="flex-1 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans text-[#52525b] hover:bg-[#f4f4f5] transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStories;
