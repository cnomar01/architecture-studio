import { query } from "@/lib/server/db";

export type WebsiteProject = {
  id: string; slug: string; title: string; location: string; year: string;
  category: string; description: string; image_url: string; gallery: string[];
  published: boolean;
};

const fields = "id,slug,title,location,year,category,description,image_url,gallery,published";
function map(row: Record<string, unknown>): WebsiteProject {
  return { ...row, gallery: Array.isArray(row.gallery) ? row.gallery.filter((item): item is string => typeof item === "string") : [], published: Boolean(row.published) } as WebsiteProject;
}

export async function listPublishedWebsiteProjects() {
  const result = await query<Record<string, unknown>>(`SELECT ${fields} FROM website_projects WHERE published=true ORDER BY updated_at DESC`);
  return result.rows.map(map);
}

export async function getPublishedWebsiteProject(slug: string) {
  const result = await query<Record<string, unknown>>(`SELECT ${fields} FROM website_projects WHERE slug=$1 AND published=true LIMIT 1`, [slug]);
  return result.rows[0] ? map(result.rows[0]) : null;
}
