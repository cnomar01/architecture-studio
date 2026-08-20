import ServicesHero from "@/components/services/ServicesHero";
import ServicesProjects from "@/components/services/Projects";
import Timeline from "@/components/sections/Timeline";
import Themes from "@/components/sections/Themes";

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