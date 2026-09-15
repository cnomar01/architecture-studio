import Loader from "../components/ui/Loader";
import Hero from "../components/home/Hero";
import Manifesto from "../components/home/Manifesto";
import Projects from "../components/home/Projects";

export default function Home() {
  return (
    <>
      <Loader />
      <Hero />
      <Manifesto />
      <Projects />
    </>
  );
}