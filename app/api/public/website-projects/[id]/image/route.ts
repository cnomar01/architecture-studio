import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") || "cover";
  const index = Math.max(0, Number.parseInt(url.searchParams.get("index") || "0", 10) || 0);
  let source = "";
  if (kind === "cover") {
    const result = await query<{ image_url: string }>("SELECT image_url FROM website_projects WHERE id=$1 AND published=true LIMIT 1", [id]);
    source = result.rows[0]?.image_url || "";
  }
  if (kind === "gallery") {
    const result = await query<{ image_url: string }>("SELECT gallery ->> $2::int AS image_url FROM website_projects WHERE id=$1 AND published=true LIMIT 1", [id, index]);
    source = result.rows[0]?.image_url || "";
  }
  if (kind === "section") {
    const result = await query<{ image_url: string }>(`SELECT image.value AS image_url
      FROM website_projects website
      CROSS JOIN LATERAL jsonb_array_elements(COALESCE(website.content_sections, '[]'::jsonb)) section
      CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(section->'images', '[]'::jsonb)) WITH ORDINALITY image(value, position)
      WHERE website.id=$1 AND website.published=true AND section->>'id'=$2 AND image.position=$3 LIMIT 1`, [id, url.searchParams.get("section") || "", index + 1]);
    source = result.rows[0]?.image_url || "";
  }
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
      "CDN-Cache-Control": "public, max-age=31536000, immutable",
      "Vercel-CDN-Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
