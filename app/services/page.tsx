import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";

export const metadata: Metadata = {
  title: "Services",
  description: "Four connected practices: Architecture & Interiors, Branding & Creative Direction, Visualization & Communication, and Digital Experiences.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
    </main>
  );
}
