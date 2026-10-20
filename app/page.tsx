import Hero from "../components/home/Hero";
import Manifesto from "../components/home/Manifesto";
import Projects from "../components/home/Projects";
import { getWebsiteHeroImage } from "@/lib/server/websiteHero";
import { listPublishedWebsiteProjects } from "@/lib/server/websiteProjects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, heroImage] = await Promise.all([listPublishedWebsiteProjects(), getWebsiteHeroImage()]);
  return (
    <>
      <Hero imageUrl={heroImage} />
      <Manifesto />
      <Projects projects={projects} />
    </>
  );
}
