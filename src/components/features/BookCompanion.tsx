import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FunctionsHttpError } from "@supabase/supabase-js";
import {
  X,
  MessageSquare,
  Users,
  BookA,
  Send,
  Loader2,
  ChevronDown,
  User,
  AlertCircle,
} from "lucide-react";
import inkImg from "@/assets/ink-companion.png";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

type CompanionTab = "ask" | "character" | "vocabulary";

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text";
}

interface CharacterCard {
  name: string;
  role: string;
  first_appearance: string;
  description: string;
  relationships: string[];
  known_facts: string[];
}

interface VocabCard {
  word: string;
  meaning: string;
  modern_equivalent: string;
  literary_context: string;
  example: string;
}

interface BookCompanionProps {
  open: boolean;
  onClose: () => void;
  storyId: string;
  storyTitle: string;
  authorName: string;
  currentChapter: number;
  theme?: "light" | "sepia" | "dark";
  initialTab?: CompanionTab;
}

// ── Suggested questions ───────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  "Who are the main characters so far?",
  "What are the key themes in this story?",
  "What happened in the last chapter?",
  "Why is this book considered a classic?",
];

// ── Helper: call edge function ────────────────────────────────────────────────

async function callCompanion(payload: object): Promise<{ answer?: string; data?: object; error?: string }> {
  const { data, error } = await supabase.functions.invoke("book-companion", { body: payload });
  if (error) {
    let msg = error.message;
    if (error instanceof FunctionsHttpError) {
      try {
        const text = await error.context?.text();
        msg = text || msg;
      } catch { /* ignore */ }
    }
    return { error: msg };
  }
  return data ?? {};
}

// ── Component ─────────────────────────────────────────────────────────────────

const BookCompanion = ({
  open,
  onClose,
  storyId,
  storyTitle,
  authorName,
  currentChapter,
  theme = "light",
  initialTab,
}: BookCompanionProps) => {
  const [activeTab, setActiveTab] = useState<CompanionTab>(initialTab ?? "ask");

  // Sync tab when companion opens with a specific tab
  useEffect(() => {
    if (open && initialTab) setActiveTab(initialTab);
  }, [open, initialTab]);

  // Ask tab state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Character tab state
  const [charName, setCharName] = useState("");
  const [charCard, setCharCard] = useState<CharacterCard | null>(null);
  const [charLoading, setCharLoading] = useState(false);
  const [charError, setCharError] = useState("");

  // Vocabulary tab state
  const [wordInput, setWordInput] = useState("");
  const [vocabCard, setVocabCard] = useState<VocabCard | null>(null);
  const [vocabLoading, setVocabLoading] = useState(false);
  const [vocabError, setVocabError] = useState("");

  // Scroll to latest message
  useEffect(() => {
    if (activeTab === "ask") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  // ── Theme-aware styles ──────────────────────────────────────────────────────
  const isDark = theme === "dark";
  const isSepia = theme === "sepia";

  const panelBg = isDark ? "bg-[#1e1e1e] border-[#333]" : isSepia ? "bg-[#f0ebe0] border-[#d9cebf]" : "bg-white border-gray-200";
  const headerBg = isDark ? "bg-[#252525] border-[#333]" : isSepia ? "bg-[#e8e0d0] border-[#d9cebf]" : "bg-gray-50 border-gray-200";
  const tabActive = isDark ? "bg-[#1e1e1e] text-white shadow-sm" : isSepia ? "bg-[#f0ebe0] text-[#3b2f1e] shadow-sm" : "bg-white text-gray-900 shadow-sm";
  const tabInactive = isDark ? "text-[#777] hover:text-[#aaa]" : isSepia ? "text-[#8b7355] hover:text-[#3b2f1e]" : "text-gray-400 hover:text-gray-700";
  const tabBg = isDark ? "bg-[#2a2a2a]" : isSepia ? "bg-[#ddd5c4]" : "bg-gray-100";
  const textPrimary = isDark ? "text-[#e8e8e8]" : isSepia ? "text-[#3b2f1e]" : "text-gray-900";
  const textSubtle = isDark ? "text-[#777]" : isSepia ? "text-[#8b7355]" : "text-gray-500";
  const inputBg = isDark ? "bg-[#2a2a2a] border-[#3a3a3a] text-[#e8e8e8] placeholder:text-[#555]" : isSepia ? "bg-[#e8e0d0] border-[#c8b89a] text-[#3b2f1e] placeholder:text-[#8b7355]" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400";
  const msgUserBg = isDark ? "bg-[#2a2a2a] text-[#e8e8e8]" : isSepia ? "bg-[#3b2f1e] text-[#f0ebe0]" : "bg-gray-900 text-white";
  const msgAiBg = isDark ? "bg-[#2a2a2a] text-[#e8e8e8]" : isSepia ? "bg-[#e8e0d0] text-[#3b2f1e]" : "bg-gray-100 text-gray-900";
  const cardBg = isDark ? "bg-[#252525] border-[#333]" : isSepia ? "bg-[#e8e0d0] border-[#c8b89a]" : "bg-gray-50 border-gray-200";
  const pillBg = isDark ? "bg-[#2a2a2a] text-[#aaa]" : isSepia ? "bg-[#ddd5c4] text-[#6b5840]" : "bg-gray-100 text-gray-600";
  const sendBtn = isDark ? "bg-[#e8e8e8] text-[#1a1a1a] hover:bg-white" : isSepia ? "bg-[#3b2f1e] text-[#f0ebe0] hover:bg-[#5a4535]" : "bg-gray-900 text-white hover:bg-gray-700";
  const closeBtnStyle = isDark ? "text-[#777] hover:text-[#e8e8e8] hover:bg-[#333]" : isSepia ? "text-[#8b7355] hover:text-[#3b2f1e] hover:bg-[#ddd5c4]" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100";
  const dividerStyle = isDark ? "border-[#333]" : isSepia ? "border-[#d9cebf]" : "border-gray-100";
  const suggestBg = isDark ? "bg-[#2a2a2a] border-[#3a3a3a] text-[#aaa] hover:border-[#555] hover:text-[#e8e8e8]" : isSepia ? "bg-[#e8e0d0] border-[#c8b89a] text-[#6b5840] hover:border-[#8b7355] hover:text-[#3b2f1e]" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700";

  // ── Ask handlers ─────────────────────────────────────────────────────────────

  const sendQuestion = async (q?: string) => {
    const text = (q ?? input).trim();
    if (!text || askLoading) return;
    setInput("");
    const newMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, newMsg]);
    setAskLoading(true);

    const result = await callCompanion({
      story_id: storyId,
      story_title: storyTitle,
      author_name: authorName,
      current_chapter: currentChapter,
      query_type: "ask",
      question: text,
    });

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: result.answer || result.error || "Sorry, I couldn't answer that." },
    ]);
    setAskLoading(false);
  };

  // ── Character handler ────────────────────────────────────────────────────────

  const lookupCharacter = async () => {
    const name = charName.trim();
    if (!name || charLoading) return;
    setCharCard(null);
    setCharError("");
    setCharLoading(true);

    const result = await callCompanion({
      story_id: storyId,
      story_title: storyTitle,
      author_name: authorName,
      current_chapter: currentChapter,
      query_type: "character",
      character_name: name,
    });

    if (result.error) {
      setCharError(result.error);
    } else if (result.data) {
      setCharCard(result.data as CharacterCard);
    } else if (result.answer) {
      setCharError(result.answer);
    }
    setCharLoading(false);
  };

  // ── Vocabulary handler ───────────────────────────────────────────────────────

  const lookupWord = async () => {
    const w = wordInput.trim();
    if (!w || vocabLoading) return;
    setVocabCard(null);
    setVocabError("");
    setVocabLoading(true);

    const result = await callCompanion({
      story_id: storyId,
      story_title: storyTitle,
      author_name: authorName,
      current_chapter: currentChapter,
      query_type: "vocabulary",
      word: w,
    });

    if (result.error) {
      setVocabError(result.error);
    } else if (result.data) {
      setVocabCard(result.data as VocabCard);
    } else if (result.answer) {
      setVocabError(result.answer);
    }
    setVocabLoading(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed z-50 flex flex-col border transition-all duration-300 ease-in-out",
          // Mobile: bottom sheet
          "bottom-0 left-0 right-0 rounded-t-2xl max-h-[80vh]",
          // Desktop: right sidebar
          "md:top-0 md:right-0 md:bottom-0 md:left-auto md:rounded-none md:w-80 md:max-h-none md:h-screen",
          panelBg,
          open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"
        )}
      >
        {/* Header */}
        <div className={cn("flex items-center justify-between px-4 py-3 border-b flex-shrink-0", headerBg, dividerStyle)}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
              <img src={inkImg} alt="Book Companion" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className={cn("font-sans text-sm font-bold leading-tight", textPrimary)}>Book Companion</p>
              <p className={cn("font-sans text-[10px] leading-tight", textSubtle)}>
                Ch. {currentChapter} · spoiler-safe
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", closeBtnStyle)}
            aria-label="Close companion"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile drag handle */}
        <div className="flex justify-center py-2 md:hidden flex-shrink-0">
          <div className={cn("w-10 h-1 rounded-full", isDark ? "bg-[#444]" : isSepia ? "bg-[#c8b89a]" : "bg-gray-200")} />
        </div>

        {/* Tabs */}
        <div className={cn("mx-3 mb-2 p-1 rounded-xl flex gap-1 flex-shrink-0", tabBg)}>
          {([
            { id: "ask", icon: MessageSquare, label: "Ask" },
            { id: "character", icon: Users, label: "Characters" },
            { id: "vocabulary", icon: BookA, label: "Vocabulary" },
          ] as const).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-sans font-semibold transition-all",
                activeTab === id ? tabActive : tabInactive
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:block md:hidden lg:block">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab Content ──────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">

          {/* ASK TAB */}
          {activeTab === "ask" && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
                {messages.length === 0 ? (
                  <div className="pt-2 space-y-3">
                    <p className={cn("font-sans text-xs text-center", textSubtle)}>
                      Ask anything about <em>{storyTitle}</em> — I only know what you've read so far.
                    </p>
                    <div className="space-y-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendQuestion(q)}
                          className={cn("w-full text-left px-3 py-2.5 rounded-xl border text-xs font-sans transition-all", suggestBg)}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-0.5">
                          <img src={inkImg} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[85%] px-3 py-2.5 rounded-2xl text-xs font-sans leading-relaxed",
                          msg.role === "user"
                            ? cn("rounded-tr-sm", msgUserBg)
                            : cn("rounded-tl-sm", msgAiBg)
                        )}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", isDark ? "bg-[#333]" : isSepia ? "bg-[#c8b89a]" : "bg-gray-200")}>
                          <User className={cn("w-3 h-3", textSubtle)} />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {askLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <img src={inkImg} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className={cn("px-3 py-2.5 rounded-2xl rounded-tl-sm", msgAiBg)}>
                      <div className="flex gap-1 items-center h-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className={cn("px-3 pb-3 pt-2 border-t flex-shrink-0", dividerStyle)}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendQuestion(); } }}
                    placeholder="Ask about the story…"
                    disabled={askLoading}
                    className={cn("flex-1 px-3 py-2.5 rounded-xl border text-xs font-sans focus:outline-none transition-colors", inputBg)}
                  />
                  <button
                    onClick={() => sendQuestion()}
                    disabled={!input.trim() || askLoading}
                    className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40", sendBtn)}
                    aria-label="Send"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CHARACTER TAB */}
          {activeTab === "character" && (
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
              <p className={cn("font-sans text-xs pt-2", textSubtle)}>
                Get a spoiler-safe character profile — only details from Chapter {currentChapter} and earlier.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={charName}
                  onChange={(e) => setCharName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") lookupCharacter(); }}
                  placeholder="Enter character name…"
                  disabled={charLoading}
                  className={cn("flex-1 px-3 py-2.5 rounded-xl border text-xs font-sans focus:outline-none transition-colors", inputBg)}
                />
                <button
                  onClick={lookupCharacter}
                  disabled={!charName.trim() || charLoading}
                  className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0", sendBtn)}
                  aria-label="Search character"
                >
                  {charLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {charError && (
                <div className={cn("flex gap-2 items-start p-3 rounded-xl", isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600")}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-sans">{charError}</p>
                </div>
              )}

              {charCard && (
                <div className={cn("rounded-xl border p-4 space-y-3", cardBg)}>
                  <div>
                    <p className={cn("font-serif text-base font-bold leading-tight", textPrimary)}>{charCard.name}</p>
                    <p className={cn("font-sans text-xs mt-0.5", textSubtle)}>{charCard.role}</p>
                  </div>
                  <div className={cn("h-px", dividerStyle)} />
                  <p className={cn("font-sans text-xs leading-relaxed", textPrimary)}>{charCard.description}</p>

                  {charCard.relationships?.length > 0 && (
                    <div>
                      <p className={cn("font-sans text-[10px] uppercase tracking-widest mb-2", textSubtle)}>Relationships</p>
                      <div className="flex flex-wrap gap-1.5">
                        {charCard.relationships.map((r, i) => (
                          <span key={i} className={cn("text-[10px] font-sans px-2.5 py-1 rounded-full", pillBg)}>{r}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {charCard.known_facts?.length > 0 && (
                    <div>
                      <p className={cn("font-sans text-[10px] uppercase tracking-widest mb-2", textSubtle)}>Known Facts (Ch. 1–{currentChapter})</p>
                      <ul className="space-y-1.5">
                        {charCard.known_facts.map((f, i) => (
                          <li key={i} className={cn("flex gap-2 text-xs font-sans", textPrimary)}>
                            <span className={textSubtle}>·</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className={cn("font-sans text-[10px]", textSubtle)}>
                    First appears: {charCard.first_appearance}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VOCABULARY TAB */}
          {activeTab === "vocabulary" && (
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
              <p className={cn("font-sans text-xs pt-2", textSubtle)}>
                Encounter an unfamiliar word? Look it up in context.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={wordInput}
                  onChange={(e) => setWordInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") lookupWord(); }}
                  placeholder="Enter word or phrase…"
                  disabled={vocabLoading}
                  className={cn("flex-1 px-3 py-2.5 rounded-xl border text-xs font-sans focus:outline-none transition-colors", inputBg)}
                />
                <button
                  onClick={lookupWord}
                  disabled={!wordInput.trim() || vocabLoading}
                  className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0", sendBtn)}
                  aria-label="Look up word"
                >
                  {vocabLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {vocabError && (
                <div className={cn("flex gap-2 items-start p-3 rounded-xl", isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600")}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-sans">{vocabError}</p>
                </div>
              )}

              {vocabCard && (
                <div className={cn("rounded-xl border p-4 space-y-4", cardBg)}>
                  <div>
                    <p className={cn("font-serif text-lg font-bold", textPrimary)}>"{vocabCard.word}"</p>
                  </div>
                  <div className={cn("h-px", dividerStyle)} />

                  <div className="space-y-3">
                    <div>
                      <p className={cn("font-sans text-[10px] uppercase tracking-widest mb-1.5", textSubtle)}>Meaning</p>
                      <p className={cn("font-sans text-xs leading-relaxed", textPrimary)}>{vocabCard.meaning}</p>
                    </div>

                    {vocabCard.modern_equivalent && (
                      <div>
                        <p className={cn("font-sans text-[10px] uppercase tracking-widest mb-1.5", textSubtle)}>Modern Equivalent</p>
                        <p className={cn("font-sans text-xs leading-relaxed italic", textPrimary)}>{vocabCard.modern_equivalent}</p>
                      </div>
                    )}

                    {vocabCard.literary_context && (
                      <div>
                        <p className={cn("font-sans text-[10px] uppercase tracking-widest mb-1.5", textSubtle)}>In {storyTitle}</p>
                        <p className={cn("font-sans text-xs leading-relaxed", textPrimary)}>{vocabCard.literary_context}</p>
                      </div>
                    )}

                    {vocabCard.example && (
                      <div className={cn("p-3 rounded-lg border-l-2 border-amber-400/50", isDark ? "bg-[#2a2a2a]" : isSepia ? "bg-[#e8e0d0]" : "bg-gray-50")}>
                        <p className={cn("font-sans text-[10px] uppercase tracking-widest mb-1", textSubtle)}>Example</p>
                        <p className={cn("font-serif text-xs italic", textPrimary)}>{vocabCard.example}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default BookCompanion;
