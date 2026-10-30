import Loader from "../components/ui/Loader";
import Hero from "../components/home/Hero";
import Manifesto from "../components/home/Manifesto";
import Projects from "../components/home/Projects";
import Disciplines from "../components/home/Disciplines";
import StudioPerspective from "../components/home/StudioPerspective";
const approvedHeroImage = "https://d2ol7oe51mr4n9.cloudfront.net/user_3HDVjjdApfFlxvKkHr2XjkIPjln/a038160e-176f-4621-996a-29acbc8cbf46.png";
import { listPublishedWebsiteProjects } from "@/lib/server/websiteProjects";
import { listPublishedJournalArticles } from "@/lib/server/websiteJournal";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, journal] = await Promise.all([listPublishedWebsiteProjects(), listPublishedJournalArticles(3)]);
  return (
    <>
      <Loader />
      <Hero imageUrl={approvedHeroImage} />
      <Manifesto />
      <Disciplines />
      <Projects projects={projects} />
      <StudioPerspective articles={journal} />
    </>
  );
}
