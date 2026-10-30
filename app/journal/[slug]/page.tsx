import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JournalDetail from "@/components/journal/JournalDetail";
import { getPublishedJournalArticle, journalText, listPublishedJournalArticles } from "@/lib/server/websiteJournal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedJournalArticle(slug);
  if (!article) return {};
  const title = journalText(article.seo_title, "en") || journalText(article.title, "en");
  const description = journalText(article.seo_description, "en") || journalText(article.excerpt, "en");
  return { title, description, alternates: { canonical: `/journal/${article.slug}` }, openGraph: { title, description, images: article.cover_image_url ? [article.cover_image_url] : [] } };
}

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedJournalArticle(slug);
  if (!article) notFound();
  const related = (await listPublishedJournalArticles(4)).filter((item) => item.id !== article.id).slice(0, 3);
  return <JournalDetail article={article} related={related} />;
}
