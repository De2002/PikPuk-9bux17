import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { CmsFaq, fetchCmsFaqs, fetchCmsAuthors, CmsAuthor } from "@/hooks/useCmsData";
import { AUTHORS } from "@/constants/authors";
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, X, GripVertical, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FaqFormProps {
  initial?: Partial<CmsFaq>;
  authorId: string;
  nextOrder: number;
  onSave: (data: Omit<CmsFaq, "id">) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function FaqForm({ initial, authorId, nextOrder, onSave, onCancel, saving }: FaqFormProps) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");

  return (
    <div className="bg-white rounded-xl border border-[#e4e4e7] p-6 space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Question *</label>
        <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="What is this author's most famous work?"
          className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-sans font-semibold text-[#52525b] uppercase tracking-wide">Answer *</label>
        <textarea rows={4} value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Detailed answer…"
          className="w-full px-3 py-2.5 border border-[#e4e4e7] rounded-lg text-sm font-sans resize-none focus:outline-none focus:ring-2 focus:ring-[#18181b]/10" />
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-[#f4f4f5]">
        <button
          onClick={() => onSave({ author_id: authorId, question, answer, sort_order: initial?.sort_order ?? nextOrder })}
          disabled={saving || !question.trim() || !answer.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save FAQ"}
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-sans text-[#71717a] hover:text-[#18181b]">Cancel</button>
      </div>
    </div>
  );
}

type ViewMode = "list" | "add" | "edit";

const AdminFAQs = () => {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<CmsAuthor | null>(null);
  const [faqs, setFaqs] = useState<CmsFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<ViewMode>("list");
  const [editing, setEditing] = useState<CmsFaq | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!authorId) return;
    setLoading(true);
    const [authorsData, faqData] = await Promise.all([
      fetchCmsAuthors(),
      fetchCmsFaqs(authorId),
    ]);
    const found = authorsData.find(a => a.id === authorId) ?? null;
    setAuthor(found);
    if (faqData.length === 0) {
      const staticAuthor = AUTHORS.find(a => a.id === authorId);
      setFaqs(staticAuthor?.faqs.map((f, i) => ({
        id: `static-${i}`, author_id: authorId,
        question: f.question, answer: f.answer, sort_order: i,
      })) ?? []);
    } else {
      setFaqs(faqData);
    }
    setLoading(false);
  }, [authorId]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (data: Omit<CmsFaq, "id">) => {
    setSaving(true);
    if (editing && !editing.id.startsWith("static-")) {
      const { error } = await supabase.from("cms_author_faqs").update(data).eq("id", editing.id);
      if (error) { setSaving(false); return toast.error("Update failed: " + error.message); }
    } else {
      const { error } = await supabase.from("cms_author_faqs").insert(data);
      if (error) { setSaving(false); return toast.error("Save failed: " + error.message); }
    }
    setSaving(false);
    toast.success(editing ? "FAQ updated." : "FAQ added.");
    setMode("list");
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith("static-")) return toast.error("Static FAQs can't be deleted from here. Add a DB version first.");
    const { error } = await supabase.from("cms_author_faqs").delete().eq("id", id);
    if (error) return toast.error("Delete failed: " + error.message);
    toast.success("FAQ deleted.");
    setDeleteId(null);
    load();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-5 h-5 animate-spin text-[#71717a]" />
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/authors" className="flex items-center gap-1.5 text-sm font-sans text-[#71717a] hover:text-[#18181b] transition-colors">
          <ChevronLeft className="w-4 h-4" />Authors
        </Link>
        <span className="text-[#d4d4d8]">/</span>
        <span className="text-sm font-sans text-[#18181b] font-semibold">{author?.name ?? authorId}</span>
        <span className="text-[#d4d4d8]">/</span>
        <span className="text-sm font-sans text-[#71717a]">FAQs</span>
      </div>

      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#18181b]">FAQs</h1>
          <p className="text-sm text-[#71717a] font-sans mt-1">
            {mode === "list" ? `${faqs.length} questions for ${author?.name ?? authorId}` : mode === "add" ? "Add a new FAQ." : "Editing FAQ."}
          </p>
        </div>
        {mode === "list" && (
          <button onClick={() => { setEditing(null); setMode("add"); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#18181b] text-white rounded-lg text-sm font-sans font-semibold hover:bg-[#27272a] transition-all flex-shrink-0">
            <Plus className="w-4 h-4" />Add FAQ
          </button>
        )}
        {mode !== "list" && (
          <button onClick={() => { setMode("list"); setEditing(null); }} className="flex items-center gap-1.5 text-sm font-sans text-[#71717a] hover:text-[#18181b]">
            <X className="w-4 h-4" />Cancel
          </button>
        )}
      </div>

      {(mode === "add" || mode === "edit") && (
        <div className="mb-8">
          <FaqForm
            initial={editing ?? undefined}
            authorId={authorId!}
            nextOrder={faqs.length}
            onSave={handleSave}
            onCancel={() => { setMode("list"); setEditing(null); }}
            saving={saving}
          />
        </div>
      )}

      {mode === "list" && (
        <div className="bg-white rounded-xl border border-[#e4e4e7] overflow-hidden">
          {faqs.length === 0 && (
            <div className="py-16 text-center">
              <HelpCircle className="w-8 h-8 text-[#d4d4d8] mx-auto mb-3" />
              <p className="text-sm text-[#a1a1aa] font-sans">No FAQs yet.</p>
            </div>
          )}
          {faqs.map((faq, i) => (
            <div key={faq.id} className={cn("flex items-start gap-4 px-5 py-4", i > 0 && "border-t border-[#f4f4f5]")}>
              <GripVertical className="w-4 h-4 text-[#d4d4d8] flex-shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-semibold text-[#18181b]">{faq.question}</p>
                <p className="text-xs font-sans text-[#71717a] mt-1 leading-relaxed line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {faq.id.startsWith("static-") && (
                  <span className="text-[10px] font-sans text-[#a1a1aa] bg-[#f4f4f5] px-2 py-1 rounded-full mr-1">static</span>
                )}
                <button onClick={() => { setEditing(faq); setMode("edit"); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteId(faq.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl border border-[#e4e4e7] p-6 max-w-xs w-full shadow-xl">
            <h3 className="font-serif text-lg font-bold text-[#18181b] mb-2">Delete FAQ?</h3>
            <p className="text-sm font-sans text-[#71717a] mb-6 leading-relaxed">This FAQ will be permanently deleted.</p>
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

export default AdminFAQs;
