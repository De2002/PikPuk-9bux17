import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { CmsChapter, fetchCmsChapters, fetchCmsStories, CmsStory } from "@/hooks/useCmsData";
import { STORY_CHAPTERS } from "@/constants/chapters";
import { Chapter } from "@/types";
import {
  Plus, Pencil, Trash2, Loader2, ChevronLeft, X, GripVertical, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Chapter Form ──────────────────────────────────────────────────────────────

interface ChapterFormProps {
  initial?: Partial<CmsChapter>;
  nextNumber: number;
  onSave: (data: Omit<CmsChapter, "id">) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function ChapterForm({ initial, nextNumber, onSave, onCancel, saving }: ChapterFormProps) {
  const [number, setNumber] = useState(initial?.number ?? nextNumber);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const storyId = initial?.story_id ?? "";

  return (
    <div className="bg-white rounded-xl border border-[#e4e4e7] p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Chapter #</label>
          <input type="number" min={1} value={number} onChange={e => setNumber(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
        <div className="space-y-1.5 col-span-1">
          <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Chapter Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Anna Pavlovna's Evening"
            className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Summary (chapter list preview)</label>
        <textarea rows={3} value={summary} onChange={e => setSummary(e.target.value)} placeholder="Brief chapter summary shown in the chapter list…"
          className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-none focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">
          Content <span className="text-[#a1a1aa] normal-case font-normal">(separate paragraphs with a blank line)</span>
        </label>
        <textarea rows={16} value={content} onChange={e => setContent(e.target.value)} placeholder="Chapter text… Separate paragraphs with blank lines."
          className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-serif resize-y focus:outline-none focus:ring-2 focus:ring-[#18181b]/10 leading-relaxed" />
        <p className="text-xs text-[#a1a1aa] font-sans">{content.length.toLocaleString()} characters · {content.split("\n\n").filter(Boolean).length} paragraphs</p>
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-[#f4f4f5]">
        <button
          onClick={() => onSave({ story_id: storyId, number, title, summary, content })}
          disabled={saving || !title.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Chapter"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-sans text-[#71717a] hover:text-[#18181b]">Cancel</button>
      </div>
    </div>
  );
}

// ── AdminChapters Page ────────────────────────────────────────────────────────

type ViewMode = "list" | "add" | "edit";

const AdminChapters = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const [story, setStory] = useState<CmsStory | null>(null);
  const [chapters, setChapters] = useState<CmsChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<ViewMode>("list");
  const [editing, setEditing] = useState<CmsChapter | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!storyId) return;
    setLoading(true);
    const [storyData, chapterData] = await Promise.all([
      fetchCmsStories().then(s => s.find(x => x.id === storyId) ?? null),
      fetchCmsChapters(storyId),
    ]);
    setStory(storyData);
    if (chapterData.length === 0) {
      // Show static fallback as display-only
      const staticChaps: CmsChapter[] = (STORY_CHAPTERS[storyId] ?? []).map(c => ({
        id: `static-${c.number}`, story_id: storyId,
        number: c.number, title: c.title, summary: c.summary, content: c.content,
      }));
      setChapters(staticChaps);
    } else {
      setChapters(chapterData);
    }
    setLoading(false);
  }, [storyId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: Omit<CmsChapter, "id">) => {
    if (!storyId) return;
    setSaving(true);
    const payload = { ...data, story_id: storyId };

    if (editing && !editing.id.startsWith("static-")) {
      const { error } = await supabase.from("cms_chapters").update(payload).eq("id", editing.id);
      if (error) { setSaving(false); return toast.error("Update failed: " + error.message); }
    } else {
      const { error } = await supabase.from("cms_chapters").upsert(payload, { onConflict: "story_id,number" });
      if (error) { setSaving(false); return toast.error("Save failed: " + error.message); }
    }
    setSaving(false);
    toast.success(editing ? "Chapter updated." : "Chapter added.");
    setMode("list");
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith("static-")) return toast.error("This chapter is from static data. Add a DB version first.");
    const { error } = await supabase.from("cms_chapters").delete().eq("id", id);
    if (error) return toast.error("Delete failed: " + error.message);
    toast.success("Chapter deleted.");
    setDeleteId(null);
    load();
  };

  const nextNum = chapters.length > 0 ? Math.max(...chapters.map(c => c.number)) + 1 : 1;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-5 h-5 animate-spin text-[#71717a]" />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/stories" className="flex items-center gap-1.5 text-sm font-sans text-[#71717a] hover:text-[#18181b] transition-colors">
          <ChevronLeft className="w-4 h-4" />Stories
        </Link>
        <span className="text-[#d4d4d8]">/</span>
        <span className="text-sm font-sans text-[#18181b] font-semibold truncate">{story?.title ?? storyId}</span>
        <span className="text-[#d4d4d8]">/</span>
        <span className="text-sm font-sans text-[#71717a]">Chapters</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#18181b]">Chapters</h1>
          <p className="text-sm text-[#71717a] font-sans mt-1">
            {mode === "list"
              ? `${chapters.length} chapters for "${story?.title ?? storyId}"`
              : mode === "add" ? "Add a new chapter." : `Editing Chapter ${editing?.number}: ${editing?.title}`}
          </p>
        </div>
        {mode === "list" && (
          <button onClick={() => { setEditing(null); setMode("add"); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all flex-shrink-0">
            <Plus className="w-4 h-4" />Add Chapter
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
          <ChapterForm
            initial={editing ? { ...editing } : { story_id: storyId! }}
            nextNumber={nextNum}
            onSave={handleSave}
            onCancel={() => { setMode("list"); setEditing(null); }}
            saving={saving}
          />
        </div>
      )}

      {/* Chapter list */}
      {mode === "list" && (
        <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
          {chapters.length === 0 && (
            <div className="py-16 text-center">
              <BookOpen className="w-8 h-8 text-[#d4d4d8] mx-auto mb-3" />
              <p className="text-sm text-[#a1a1aa] font-sans">No chapters yet. Add the first one.</p>
            </div>
          )}
          {chapters.map((ch, i) => (
            <div key={ch.id} className={cn("flex items-start gap-4 px-5 py-4", i > 0 && "border-t border-[#f4f4f5]")}>
              <GripVertical className="w-4 h-4 text-[#d4d4d8] flex-shrink-0 mt-0.5" />
              <div className="w-8 h-8 rounded-full bg-[#f4f4f5] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-mono font-bold text-[#52525b]">{ch.number}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-semibold text-[#18181b]">{ch.title}</p>
                <p className="text-xs font-sans text-[#a1a1aa] mt-0.5 line-clamp-2 leading-relaxed">{ch.summary}</p>
                <p className="text-xs font-sans text-[#d4d4d8] mt-1">{ch.content.length.toLocaleString()} chars</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {ch.id.startsWith("static-") && (
                  <span className="text-[10px] font-sans text-[#a1a1aa] bg-[#f4f4f5] px-2 py-1 rounded-full mr-1">static</span>
                )}
                <button onClick={() => { setEditing(ch); setMode("edit"); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(ch.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl border border-[#e4e4e7] p-6 max-w-xs w-full shadow-xl">
            <h3 className="font-serif text-lg font-bold text-[#18181b] mb-2">Delete Chapter?</h3>
            <p className="text-sm font-sans text-[#71717a] mb-6 leading-relaxed">This chapter will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId!)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-sans font-semibold hover:bg-red-600 transition-all">Delete</button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans text-[#52525b] hover:bg-[#f4f4f5] transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminChapters;
