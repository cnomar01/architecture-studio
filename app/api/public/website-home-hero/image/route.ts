import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const result = await query<{ value: { image_url?: unknown } }>("SELECT value FROM website_settings WHERE key='home_hero' LIMIT 1");
    const source = result.rows[0]?.value?.image_url;
    const match = typeof source === "string" ? /^data:(image\/(?:png|jpe?g|webp|gif));base64,([a-z0-9+/=\s]+)$/i.exec(source) : null;
    if (!match) return NextResponse.redirect(new URL("/images/hero.png", request.url), 307);
    const bytes = new Uint8Array(Buffer.from(match[2].replace(/\s/g, ""), "base64"));
    return new Response(bytes, { headers: { "Content-Type": match[1].toLowerCase(), "Content-Length": String(bytes.byteLength), "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("[public-home] Hero image query failed; redirecting to the checked-in image.", error);
    return NextResponse.redirect(new URL("/images/hero.png", request.url), 307);
  }
}
