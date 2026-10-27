import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function imageList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function imageFromSection(value: unknown, sectionId: string, index: number) {
  if (!Array.isArray(value)) return "";
  const section = value.find((item) => item && typeof item === "object" && !Array.isArray(item) && (item as { id?: unknown }).id === sectionId);
  if (!section || typeof section !== "object" || Array.isArray(section)) return "";
  return imageList((section as { images?: unknown }).images)[index] || "";
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") || "cover";
  const index = Math.max(0, Number.parseInt(url.searchParams.get("index") || "0", 10) || 0);
  const result = await query<Record<string, unknown>>(
    "SELECT image_url,gallery,content_sections,updated_at FROM website_projects WHERE id=$1 AND published=true LIMIT 1",
    [id],
  );
  const project = result.rows[0];
  if (!project) return NextResponse.json({ error: "Image not found." }, { status: 404 });

  let source = "";
  if (kind === "cover") source = typeof project.image_url === "string" ? project.image_url : "";
  if (kind === "gallery") source = imageList(project.gallery)[index] || "";
  if (kind === "section") source = imageFromSection(project.content_sections, url.searchParams.get("section") || "", index);
  if (kind === "section-image") {
    const image = await query<{ image_url: string }>(`SELECT image.image_url FROM website_project_section_images image JOIN website_project_sections section ON section.id=image.section_id JOIN website_projects website ON website.id=section.project_id WHERE image.id=$1 AND website.id=$2 AND website.published=true LIMIT 1`, [url.searchParams.get("id") || "", id]);
    source = image.rows[0]?.image_url || "";
  }

  const match = /^data:(image\/(?:png|jpe?g|webp|gif));base64,([a-z0-9+/=\s]+)$/i.exec(source);
  if (!match) return NextResponse.json({ error: "Image not found." }, { status: 404 });

  const bytes = new Uint8Array(Buffer.from(match[2].replace(/\s/g, ""), "base64"));
  return new Response(bytes, {
    headers: {
      "Content-Type": match[1].toLowerCase(),
      "Content-Length": String(bytes.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
