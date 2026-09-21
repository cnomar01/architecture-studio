import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { isWebsiteImage } from "@/lib/server/websiteHero";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Sign in as the Owner to manage website content." }, { status: 401 });
  if (message === "FORBIDDEN") return NextResponse.json({ error: "Only the Owner can manage public website content." }, { status: 403 });
  console.error("Website hero CMS error", error);
  return NextResponse.json({ error: "Could not manage the home hero photo." }, { status: 500 });
}

export async function GET() {
  try {
    await requireServerUser(["Owner"]);
    const result = await query<{ value: { image_url?: unknown } }>("SELECT value FROM website_settings WHERE key='home_hero' LIMIT 1");
    const imageUrl = result.rows[0]?.value?.image_url;
    return NextResponse.json({ image_url: isWebsiteImage(imageUrl) ? imageUrl : "/images/hero.png" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireServerUser(["Owner"]);
    const body = await request.json() as { image_url?: unknown };
    if (!isWebsiteImage(body.image_url)) return NextResponse.json({ error: "Choose a valid hero image first." }, { status: 400 });
    await query(
      `INSERT INTO website_settings(key,value,updated_at) VALUES('home_hero',$1,NOW())
       ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value,updated_at=NOW()`,
      [JSON.stringify({ image_url: body.image_url })],
    );
    await audit("website_home_hero.updated", "WebsiteSettings", "home_hero", { actor: user.id });
    return NextResponse.json({ image_url: body.image_url });
  } catch (error) { return failure(error); }
}
