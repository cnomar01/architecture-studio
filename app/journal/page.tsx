import type { Metadata } from "next";
import JournalIndex from "@/components/journal/JournalIndex";
import { listPublishedJournalArticles } from "@/lib/server/websiteJournal";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Journal", description: "Ideas, process and perspective from Mason & Arc.", alternates: { canonical: "/journal" } };

export default async function JournalPage() {
  return <JournalIndex articles={await listPublishedJournalArticles()} />;
}
