import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesProjects from "@/components/services/Projects";
import { listPublishedWebsiteProjects } from "@/lib/server/websiteProjects";

export const metadata: Metadata = {
  title: "Services",
  description: "Four connected practices: Architecture & Interiors, Branding & Creative Direction, Visualization & Communication, and Digital Experiences.",
  alternates: { canonical: "/services" },
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const projects = await listPublishedWebsiteProjects();
  return (
    <main>
      <ServicesHero />
      <ServicesProjects projects={projects} />
    </main>
  );
}
