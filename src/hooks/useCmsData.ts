/**
 * useCmsData — hook for reading CMS data from Supabase
 * Falls back to static data if DB has no records yet.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Author, Story, Chapter } from "@/types";
import { AUTHORS } from "@/constants/authors";
import { STORY_CHAPTERS } from "@/constants/chapters";

export interface CmsAuthor {
  id: string;
  name: string;
  nationality: string;
  born: number | null;
  died: number | null;
  portrait: string;
  short_bio: string;
  full_bio: string;
  novel_count: number;
  short_story_count: number;
  sort_order: number;
}

export interface CmsStory {
  id: string;
  author_id: string;
  title: string;
  type: "novel" | "short-story";
  year: number | null;
  genre: string;
  cover_url: string;
  description: string;
  synopsis: string | null;
  themes: string[];
  pages: number | null;
  read_time: string | null;
  free_chapters: number;
  sort_order: number;
  is_active: boolean;
}

export interface CmsChapter {
  id: string;
  story_id: string;
  number: number;
  title: string;
  summary: string;
  content: string;
}

export interface CmsQuote {
  id: string;
  story_id: string;
  text: string;
  context: string | null;
  sort_order: number;
}

export interface CmsFaq {
  id: string;
  author_id: string;
  question: string;
  answer: string;
  sort_order: number;
}

// ── Raw DB fetch helpers ──────────────────────────────────────────────────────

export async function fetchCmsAuthors(): Promise<CmsAuthor[]> {
  const { data } = await supabase
    .from("cms_authors")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as CmsAuthor[]) ?? [];
}

export async function fetchCmsStories(authorId?: string): Promise<CmsStory[]> {
  let q = supabase
    .from("cms_stories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (authorId) q = q.eq("author_id", authorId);
  const { data } = await q;
  return (data as CmsStory[]) ?? [];
}

export async function fetchCmsChapters(storyId: string): Promise<CmsChapter[]> {
  const { data } = await supabase
    .from("cms_chapters")
    .select("*")
    .eq("story_id", storyId)
    .order("number", { ascending: true });
  return (data as CmsChapter[]) ?? [];
}

export async function fetchCmsQuotes(storyId: string): Promise<CmsQuote[]> {
  const { data } = await supabase
    .from("cms_story_quotes")
    .select("*")
    .eq("story_id", storyId)
    .order("sort_order", { ascending: true });
  return (data as CmsQuote[]) ?? [];
}

export async function fetchCmsFaqs(authorId: string): Promise<CmsFaq[]> {
  const { data } = await supabase
    .from("cms_author_faqs")
    .select("*")
    .eq("author_id", authorId)
    .order("sort_order", { ascending: true });
  return (data as CmsFaq[]) ?? [];
}

// ── Convert CMS types → app types ────────────────────────────────────────────

export function cmsAuthorToAppAuthor(
  ca: CmsAuthor,
  stories: CmsStory[],
  faqs: CmsFaq[]
): Author {
  return {
    id: ca.id,
    name: ca.name,
    nationality: ca.nationality,
    born: ca.born ?? 0,
    died: ca.died ?? undefined,
    portrait: ca.portrait,
    shortBio: ca.short_bio,
    fullBio: ca.full_bio,
    novelCount: ca.novel_count,
    shortStoryCount: ca.short_story_count,
    faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
    stories: stories
      .filter((s) => s.author_id === ca.id)
      .map((s) => cmsStoryToAppStory(s)),
  };
}

export function cmsStoryToAppStory(s: CmsStory): Story {
  return {
    id: s.id,
    title: s.title,
    type: s.type,
    year: s.year ?? 0,
    genre: s.genre,
    coverUrl: s.cover_url,
    description: s.description,
    synopsis: s.synopsis ?? undefined,
    themes: s.themes,
    pages: s.pages ?? undefined,
    readTime: s.read_time ?? undefined,
    freeChapters: s.free_chapters,
  };
}

export function cmsChapterToAppChapter(c: CmsChapter): Chapter {
  return {
    number: c.number,
    title: c.title,
    summary: c.summary,
    content: c.content,
  };
}

// ── Slug helper ───────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── useCmsData hook (used by public pages) ───────────────────────────────────
// Returns merged data: DB records when available, static fallback otherwise.

export function useCmsAuthors() {
  const [authors, setAuthors] = useState<Author[]>(AUTHORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCmsAuthors().then(async (cmsAuthors) => {
      if (cmsAuthors.length === 0) {
        setAuthors(AUTHORS);
        setLoading(false);
        return;
      }
      // Fetch all stories and faqs in parallel
      const [storiesRes, faqsRes] = await Promise.all([
        fetchCmsStories(),
        Promise.all(cmsAuthors.map((a) => fetchCmsFaqs(a.id))),
      ]);
      const authorList = cmsAuthors.map((ca, i) =>
        cmsAuthorToAppAuthor(ca, storiesRes, faqsRes[i])
      );
      setAuthors(authorList);
      setLoading(false);
    });
  }, []);

  return { authors, loading };
}

export function useCmsChapters(storyId: string | undefined) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storyId) { setLoading(false); return; }
    fetchCmsChapters(storyId).then((cmsChaps) => {
      if (cmsChaps.length === 0) {
        // fallback to static
        setChapters(STORY_CHAPTERS[storyId] ?? []);
      } else {
        setChapters(cmsChaps.map(cmsChapterToAppChapter));
      }
      setLoading(false);
    });
  }, [storyId]);

  return { chapters, loading };
}
