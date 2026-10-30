import { query } from "@/lib/server/db";
import type { LocalizedText, WebsiteLocale } from "@/lib/server/websiteProjects";

export type JournalArticle = {
  id: string;
  slug: string;
  category: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  cover_image_url: string;
  seo_title: LocalizedText;
  seo_description: LocalizedText;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const fields = "id,slug,category,title,excerpt,body,cover_image_url,seo_title,seo_description,published,published_at,created_at,updated_at";

function localized(value: unknown): LocalizedText {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  return {
    en: typeof source.en === "string" ? source.en : "",
    ar: typeof source.ar === "string" ? source.ar : "",
    it: typeof source.it === "string" ? source.it : "",
  };
}

function mapArticle(row: Record<string, unknown>): JournalArticle {
  return {
    id: String(row.id || ""),
    slug: String(row.slug || ""),
    category: String(row.category || "Journal"),
    title: localized(row.title),
    excerpt: localized(row.excerpt),
    body: localized(row.body),
    cover_image_url: String(row.cover_image_url || ""),
    seo_title: localized(row.seo_title),
    seo_description: localized(row.seo_description),
    published: Boolean(row.published),
    published_at: row.published_at ? String(row.published_at) : null,
    created_at: String(row.created_at || ""),
    updated_at: String(row.updated_at || ""),
  };
}

export function journalText(value: LocalizedText, locale: WebsiteLocale) {
  return value[locale] || value.en || "";
}

function missingJournalTable(error: unknown) {
  return (error as { code?: string })?.code === "42P01";
}

export async function listPublishedJournalArticles(limit?: number) {
  if (!process.env.DATABASE_URL) return [] as JournalArticle[];
  const values: unknown[] = [];
  const limitSql = typeof limit === "number" && limit > 0 ? " LIMIT $1" : "";
  if (limitSql) values.push(Math.min(limit!, 24));
  try {
    const result = await query<Record<string, unknown>>(
      `SELECT ${fields} FROM website_journal_articles WHERE published=true AND published_at IS NOT NULL AND published_at<=NOW() ORDER BY published_at DESC${limitSql}`,
      values,
    );
    return result.rows.map(mapArticle);
  } catch (error) {
    if (missingJournalTable(error)) return [];
    throw error;
  }
}

export async function getPublishedJournalArticle(slug: string) {
  if (!process.env.DATABASE_URL) return null;
  try {
    const result = await query<Record<string, unknown>>(
      `SELECT ${fields} FROM website_journal_articles WHERE slug=$1 AND published=true AND published_at IS NOT NULL AND published_at<=NOW() LIMIT 1`,
      [slug],
    );
    return result.rows[0] ? mapArticle(result.rows[0]) : null;
  } catch (error) {
    if (missingJournalTable(error)) return null;
    throw error;
  }
}

export async function listAdminJournalArticles() {
  const result = await query<Record<string, unknown>>(`SELECT ${fields} FROM website_journal_articles ORDER BY updated_at DESC`);
  return result.rows.map(mapArticle);
}

export async function getAdminJournalArticle(id: string) {
  const result = await query<Record<string, unknown>>(`SELECT ${fields} FROM website_journal_articles WHERE id=$1 LIMIT 1`, [id]);
  return result.rows[0] ? mapArticle(result.rows[0]) : null;
}
