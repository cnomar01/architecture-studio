import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { getAdminJournalArticle, listAdminJournalArticles } from "@/lib/server/websiteJournal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const text = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const object = (value: unknown) => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);

function localized(value: unknown, limit: number) {
  const source = object(value);
  return { en: text(source.en, limit), ar: text(source.ar, limit), it: text(source.it, limit) };
}

function image(value: unknown) {
  const source = text(value, 5_500_000);
  return /^https?:\/\//.test(source) || source.startsWith("/") || /^data:image\/(png|jpe?g|webp);base64,/i.test(source) ? source : "";
}

function body(value: Record<string, unknown>) {
  const title = localized(value.title, 180);
  const slug = slugify(text(value.slug, 120) || title.en);
  const published = Boolean(value.published);
  const requestedDate = text(value.published_at, 60);
  const publishedAt = published ? (requestedDate || new Date().toISOString()) : null;
  return {
    slug,
    category: text(value.category, 80) || "Journal",
    title,
    excerpt: localized(value.excerpt, 600),
    articleBody: localized(value.body, 50_000),
    coverImageUrl: image(value.cover_image_url),
    seoTitle: localized(value.seo_title, 180),
    seoDescription: localized(value.seo_description, 320),
    published,
    publishedAt,
  };
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Sign in as the Owner to manage the journal." }, { status: 401 });
  if (message === "FORBIDDEN") return NextResponse.json({ error: "Only the Owner can manage public journal content." }, { status: 403 });
  if ((error as { code?: string })?.code === "23505") return NextResponse.json({ error: "That journal URL is already in use." }, { status: 409 });
  console.error("Journal CMS error", error);
  return NextResponse.json({ error: "Journal operation failed." }, { status: 500 });
}

export async function GET() {
  try {
    await requireServerUser(["Owner"]);
    return NextResponse.json({ articles: await listAdminJournalArticles() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireServerUser(["Owner"]);
    const value = body(await request.json());
    if (!value.slug || !value.title.en || !value.excerpt.en || !value.articleBody.en) {
      return NextResponse.json({ error: "English title, excerpt, article body and public URL are required." }, { status: 400 });
    }
    const id = `JOURNAL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    await query(
      `INSERT INTO website_journal_articles(id,slug,category,title,excerpt,body,cover_image_url,seo_title,seo_description,published,published_at)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, value.slug, value.category, JSON.stringify(value.title), JSON.stringify(value.excerpt), JSON.stringify(value.articleBody), value.coverImageUrl, JSON.stringify(value.seoTitle), JSON.stringify(value.seoDescription), value.published, value.publishedAt],
    );
    await audit("website_journal.created", "WebsiteJournalArticle", id, { actor: user.id, slug: value.slug, published: value.published });
    return NextResponse.json({ article: await getAdminJournalArticle(id) }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireServerUser(["Owner"]);
    const raw = await request.json() as Record<string, unknown>;
    const id = text(raw.id, 100);
    const value = body(raw);
    if (!id || !value.slug || !value.title.en || !value.excerpt.en || !value.articleBody.en) {
      return NextResponse.json({ error: "ID, English title, excerpt, article body and public URL are required." }, { status: 400 });
    }
    const result = await query(
      `UPDATE website_journal_articles SET slug=$1,category=$2,title=$3,excerpt=$4,body=$5,cover_image_url=$6,seo_title=$7,seo_description=$8,published=$9,published_at=$10,updated_at=NOW()
       WHERE id=$11 RETURNING id`,
      [value.slug, value.category, JSON.stringify(value.title), JSON.stringify(value.excerpt), JSON.stringify(value.articleBody), value.coverImageUrl, JSON.stringify(value.seoTitle), JSON.stringify(value.seoDescription), value.published, value.publishedAt, id],
    );
    if (!result.rows[0]) return NextResponse.json({ error: "Journal article not found." }, { status: 404 });
    await audit("website_journal.updated", "WebsiteJournalArticle", id, { actor: user.id, slug: value.slug, published: value.published });
    return NextResponse.json({ article: await getAdminJournalArticle(id) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireServerUser(["Owner"]);
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!id) return NextResponse.json({ error: "Article ID is required." }, { status: 400 });
    const result = await query("DELETE FROM website_journal_articles WHERE id=$1 RETURNING id", [id]);
    if (!result.rows[0]) return NextResponse.json({ error: "Journal article not found." }, { status: 404 });
    await audit("website_journal.deleted", "WebsiteJournalArticle", id, { actor: user.id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
