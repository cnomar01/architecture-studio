import { query } from "@/lib/server/db";

export type WebsiteLocale = "en" | "ar" | "it";

export type LocalizedProjectCopy = {
  title: string;
  location: string;
  category: string;
  description: string;
};

export type LocalizedText = Record<WebsiteLocale, string>;

export type WebsiteProjectSection = {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  images: string[];
};

export type WebsiteProject = {
  id: string;
  slug: string;
  title: string;
  location: string;
  year: string;
  category: string;
  description: string;
  image_url: string;
  gallery: string[];
  translations: Partial<Record<Exclude<WebsiteLocale, "en">, Partial<LocalizedProjectCopy>>>;
  content_sections: WebsiteProjectSection[];
  published: boolean;
};

const fields = "id,slug,title,location,year,category,description,image_url,gallery,translations,content_sections,published,updated_at";

function strings(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
}

function localizedText(value: unknown): LocalizedText {
  const record = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return {
    en: typeof record.en === "string" ? record.en : "",
    ar: typeof record.ar === "string" ? record.ar : "",
    it: typeof record.it === "string" ? record.it : "",
  };
}

function publicImage(projectId: string, source: string, updatedAt: unknown, params: string) {
  if (!source.startsWith("data:image/")) return source;
  const version = new Date(updatedAt as string | number | Date).getTime() || 0;
  return `/api/public/website-projects/${encodeURIComponent(projectId)}/image?${params}&v=${version}`;
}

function map(row: Record<string, unknown>): WebsiteProject {
  const id = String(row.id || "");
  const updatedAt = row.updated_at;
  const gallery = strings(row.gallery);
  const rawSections = Array.isArray(row.content_sections) ? row.content_sections : [];
  const contentSections = rawSections.flatMap((item, sectionIndex) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const record = item as Record<string, unknown>;
    const sectionId = typeof record.id === "string" && record.id ? record.id : `section-${sectionIndex + 1}`;
    return [{
      id: sectionId,
      title: localizedText(record.title),
      body: localizedText(record.body),
      images: strings(record.images).map((source, imageIndex) => publicImage(id, source, updatedAt, `kind=section&section=${encodeURIComponent(sectionId)}&index=${imageIndex}`)),
    }];
  });

  const translations = row.translations && typeof row.translations === "object" && !Array.isArray(row.translations)
    ? row.translations as WebsiteProject["translations"]
    : {};
  const cover = typeof row.image_url === "string" ? row.image_url : "";

  return {
    id,
    slug: String(row.slug || ""),
    title: String(row.title || ""),
    location: String(row.location || ""),
    year: String(row.year || ""),
    category: String(row.category || ""),
    description: String(row.description || ""),
    image_url: publicImage(id, cover, updatedAt, "kind=cover"),
    gallery: gallery.map((source, index) => publicImage(id, source, updatedAt, `kind=gallery&index=${index}`)),
    translations,
    content_sections: contentSections,
    published: Boolean(row.published),
  };
}

export async function listPublishedWebsiteProjects() {
  const result = await query<Record<string, unknown>>(`SELECT ${fields} FROM website_projects WHERE published=true ORDER BY updated_at DESC`);
  return result.rows.map(map);
}

export async function getPublishedWebsiteProject(slug: string) {
  const result = await query<Record<string, unknown>>(`SELECT ${fields} FROM website_projects WHERE slug=$1 AND published=true LIMIT 1`, [slug]);
  return result.rows[0] ? map(result.rows[0]) : null;
}
