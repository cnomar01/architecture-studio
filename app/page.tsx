import Loader from "../components/ui/Loader";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import Manifesto from "../components/home/Manifesto";
import Projects from "../components/home/Projects";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Loader />
      <Navbar />
      <Hero />
      <Manifesto />
      <Projects />
      <Footer />
    </>
  );
}