/**
 * usePoetryData — hooks and helpers for poets and poems CMS data
 */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// ── CMS Types ─────────────────────────────────────────────────────────────────

export interface CmsPoet {
  id: string;
  name: string;
  nationality: string;
  born: number | null;
  died: number | null;
  portrait: string;
  short_bio: string;
  full_bio: string;
  poem_count: number;
  sort_order: number;
}

export interface CmsPoem {
  id: string;
  poet_id: string;
  title: string;
  year: number | null;
  form: string;
  tags: string[];
  content: string;
  sort_order: number;
  is_active: boolean;
}

// ── Slug helper ───────────────────────────────────────────────────────────────

export function poetrySlugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Raw DB fetch helpers ──────────────────────────────────────────────────────

export async function fetchPoets(): Promise<CmsPoet[]> {
  const { data } = await supabase
    .from("cms_poets")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as CmsPoet[]) ?? [];
}

export async function fetchPoet(id: string): Promise<CmsPoet | null> {
  const { data } = await supabase
    .from("cms_poets")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as CmsPoet | null) ?? null;
}

export async function fetchPoems(poetId?: string): Promise<CmsPoem[]> {
  let q = supabase
    .from("cms_poems")
    .select("*")
    .order("sort_order", { ascending: true });
  if (poetId) q = q.eq("poet_id", poetId);
  const { data } = await q;
  return (data as CmsPoem[]) ?? [];
}

export async function fetchPoem(id: string): Promise<CmsPoem | null> {
  const { data } = await supabase
    .from("cms_poems")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as CmsPoem | null) ?? null;
}

export async function fetchRandomPoem(): Promise<{ poem: CmsPoem; poet: CmsPoet } | null> {
  const { data: poems } = await supabase
    .from("cms_poems")
    .select("*")
    .eq("is_active", true);
  if (!poems || poems.length === 0) return null;
  const poem = poems[Math.floor(Math.random() * poems.length)] as CmsPoem;
  const poet = await fetchPoet(poem.poet_id);
  if (!poet) return null;
  return { poem, poet };
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function usePoets() {
  const [poets, setPoets] = useState<CmsPoet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPoets().then((data) => {
      setPoets(data);
      setLoading(false);
    });
  }, []);

  return { poets, loading };
}

export function usePoet(id: string | undefined) {
  const [poet, setPoet] = useState<CmsPoet | null | undefined>(undefined);
  const [poems, setPoems] = useState<CmsPoem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setPoet(null); setLoading(false); return; }
    Promise.all([fetchPoet(id), fetchPoems(id)]).then(([p, pm]) => {
      setPoet(p);
      setPoems(pm);
      setLoading(false);
    });
  }, [id]);

  return { poet, poems, loading };
}

export function usePoem(id: string | undefined) {
  const [poem, setPoem] = useState<CmsPoem | null | undefined>(undefined);
  const [poet, setPoet] = useState<CmsPoet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setPoem(null); setLoading(false); return; }
    fetchPoem(id).then(async (p) => {
      setPoem(p);
      if (p) {
        const pt = await fetchPoet(p.poet_id);
        setPoet(pt);
      }
      setLoading(false);
    });
  }, [id]);

  return { poem, poet, loading };
}
