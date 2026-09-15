import type { Metadata } from "next";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesProjects from "@/components/services/Projects";
import Timeline from "@/components/sections/Timeline";
import Themes from "@/components/sections/Themes";

export const metadata: Metadata = {
  title: "Services | Mason & Arc",
  description: "Architecture, interiors, design development, and execution by Mason & Arc.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
      <ServicesProjects />
      <Timeline />
      <Themes />
    </main>
  );
}