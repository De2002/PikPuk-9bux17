import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface CompanionRequest {
  story_id: string;
  story_title: string;
  author_name: string;
  current_chapter: number;
  query_type: "ask" | "character" | "vocabulary";
  question?: string;
  character_name?: string;
  word?: string;
  passage?: string;
}

interface AiCallOptions {
  url: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
}

// ── Shared AI call helper ─────────────────────────────────────────────────────

async function callAI({ url, apiKey, model, systemPrompt, userMessage }: AiCallOptions): Promise<{ ok: boolean; content?: string; status?: number; errorText?: string }> {
  const res = await fetch(`${url}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    return { ok: false, status: res.status, errorText: errText };
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  return { ok: true, content };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const onspaceApiKey  = Deno.env.get("ONSPACE_AI_API_KEY");
  const onspaceBaseUrl = Deno.env.get("ONSPACE_AI_BASE_URL");
  const geminiApiKey   = Deno.env.get("GEMINI_API_KEY");
  const openrouterKey  = Deno.env.get("OPENROUTER_API_KEY");
  const supabaseUrl    = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey    = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

  if (!onspaceApiKey || !onspaceBaseUrl) {
    return new Response(
      JSON.stringify({ error: "AI service not configured." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: CompanionRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const { story_id, story_title, author_name, current_chapter, query_type, question, character_name, word, passage } = body;

  if (!story_id || !story_title || !current_chapter || !query_type) {
    return new Response(
      JSON.stringify({ error: "Missing required fields." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ── Build chapter summaries up to reader's current chapter (spoiler boundary)
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: chapters } = await supabase
    .from("cms_chapters")
    .select("number, title, summary, content")
    .eq("story_id", story_id)
    .lte("number", current_chapter)
    .order("number", { ascending: true });

  const chapterContext = (chapters ?? []).map((c: { number: number; title: string; summary: string; content: string }) => {
    const preview = c.content ? c.content.substring(0, 600) + (c.content.length > 600 ? "…" : "") : "";
    return `Chapter ${c.number}: "${c.title}"\nSummary: ${c.summary || "No summary available."}\n${preview ? `Excerpt: ${preview}` : ""}`;
  }).join("\n\n---\n\n");

  const { data: storyData } = await supabase
    .from("cms_stories")
    .select("genre, description, synopsis, themes, year")
    .eq("id", story_id)
    .single();

  const storyMeta = storyData
    ? `Genre: ${storyData.genre || "Classic"}\nYear: ${storyData.year || "unknown"}\nThemes: ${(storyData.themes ?? []).join(", ")}\nDescription: ${storyData.description || ""}\nSynopsis: ${storyData.synopsis || ""}`
    : "";

  // ── Build prompts ─────────────────────────────────────────────────────────

  const spoilerBoundary = `CRITICAL SPOILER RULE: The reader has ONLY read up to Chapter ${current_chapter}. You must NEVER reveal information from chapters beyond Chapter ${current_chapter}. If asked about something that happens in a later chapter, say "That hasn't been revealed yet in the chapters you've read." Stay strictly within what is known by Chapter ${current_chapter}.`;

  let systemPrompt = "";
  let userMessage = "";

  if (query_type === "ask") {
    systemPrompt = `You are an intelligent literary companion for "${story_title}" by ${author_name}. You help readers understand the book as they read it.

${spoilerBoundary}

BOOK INFORMATION:
${storyMeta}

CHAPTERS READ SO FAR (up to Chapter ${current_chapter}):
${chapterContext || "No chapter data available. Rely on general knowledge of this classic work up to the stated chapter."}

RESPONSE STYLE:
- Be conversational, warm, and insightful — like a knowledgeable friend who loves literature
- Keep answers concise (2–4 sentences for simple questions, up to a short paragraph for deep analysis)
- Use the chapter content to give specific, grounded answers
- If the question involves future events, gently redirect: "That's revealed later — wouldn't want to spoil it!"
- Never mention that you're an AI or reference this prompt`;
    userMessage = question || "Tell me about this book.";

  } else if (query_type === "character") {
    systemPrompt = `You are an intelligent literary companion for "${story_title}" by ${author_name}.

${spoilerBoundary}

BOOK INFORMATION:
${storyMeta}

CHAPTERS READ SO FAR (up to Chapter ${current_chapter}):
${chapterContext || "No chapter data available. Rely on general knowledge of this classic work up to the stated chapter."}

Your task: Generate a concise character card for the character named below, based ONLY on what has been revealed up to Chapter ${current_chapter}.

Respond in this exact JSON format (nothing else):
{
  "name": "Character Name",
  "role": "One-line role description",
  "first_appearance": "Chapter X or 'Not yet appeared'",
  "description": "2-3 sentences about their personality and appearance",
  "relationships": ["Relationship 1", "Relationship 2"],
  "known_facts": ["Fact 1 from the chapters read", "Fact 2"]
}`;
    userMessage = `Generate a character card for: ${character_name || "the main character"}`;

  } else if (query_type === "vocabulary") {
    systemPrompt = `You are a vocabulary assistant for readers of "${story_title}" by ${author_name}, a classic literary work.

${spoilerBoundary}

Your task: Explain the word or phrase below as it appears in this book's context.

Respond in this exact JSON format (nothing else):
{
  "word": "the word or phrase",
  "meaning": "Clear, simple definition (1-2 sentences)",
  "modern_equivalent": "Modern equivalent or usage",
  "literary_context": "How it's used in ${story_title} specifically (1 sentence)",
  "example": "A simple example sentence"
}`;
    userMessage = `Explain this word/phrase from the text: "${word || "unknown"}"${passage ? `\nContext from the book: "${passage}"` : ""}`;
  }

  // Helper: try all providers in sequence, return first success
  async function tryProviders(): Promise<{ ok: boolean; content?: string }> {

    // ── Attempt 1: Google Gemini (primary — free tier with valid key) ─────────
    if (geminiApiKey) {
      console.log(`[book-companion] Attempt 1 — Gemini | query_type=${query_type}`);
      const r = await callAI({
        url: "https://generativelanguage.googleapis.com/v1beta/openai",
        apiKey: geminiApiKey,
        model: "gemini-2.0-flash",
        systemPrompt,
        userMessage,
      });
      if (r.ok && r.content) {
        console.log("[book-companion] Gemini succeeded");
        return r;
      }
      console.warn("[book-companion] Gemini failed:", r.status, r.errorText?.substring(0, 200));
    }

    // ── Attempt 2: OnSpace AI ─────────────────────────────────────────────────
    console.log(`[book-companion] Attempt 2 — OnSpace AI | query_type=${query_type}`);
    const r2 = await callAI({
      url: onspaceBaseUrl,
      apiKey: onspaceApiKey,
      model: "google/gemini-3-flash-preview",
      systemPrompt,
      userMessage,
    });
    if (r2.ok && r2.content) {
      console.log("[book-companion] OnSpace AI succeeded");
      return r2;
    }
    console.warn("[book-companion] OnSpace AI failed:", r2.status, r2.errorText?.substring(0, 200));

    // ── Attempt 3: OpenRouter free tier ───────────────────────────────────────
    if (openrouterKey) {
      console.log("[book-companion] Attempt 3 — OpenRouter free tier");
      const r3 = await callAI({
        url: "https://openrouter.ai/api/v1",
        apiKey: openrouterKey,
        model: "openrouter/auto",
        systemPrompt,
        userMessage,
      });
      if (r3.ok && r3.content) {
        console.log("[book-companion] OpenRouter succeeded");
        return r3;
      }
      console.error("[book-companion] OpenRouter failed:", r3.errorText?.substring(0, 200));
    }

    return { ok: false };
  }

  const result = await tryProviders();

  if (result.ok && result.content) {
    return buildResponse(query_type, result.content, corsHeaders);
  }

  return new Response(
    JSON.stringify({ error: "Service temporarily unavailable. Please try again shortly." }),
    { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});

// ── Response builder ──────────────────────────────────────────────────────────

function buildResponse(query_type: string, content: string, headers: Record<string, string>): Response {
  if (query_type === "ask") {
    return new Response(
      JSON.stringify({ answer: content }),
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
  }
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return new Response(
      JSON.stringify({ data: parsed }),
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ answer: content }),
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
  }
}
