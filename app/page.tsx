import Loader from "../components/ui/Loader";
import Hero from "../components/home/Hero";
import Manifesto from "../components/home/Manifesto";
import Projects from "../components/home/Projects";
import { listPublishedWebsiteProjects } from "@/lib/server/websiteProjects";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = await listPublishedWebsiteProjects();
  return (
    <>
      <Loader />
      <Hero />
      <Manifesto />
      <Projects projects={projects} />
    </>
  );
}
