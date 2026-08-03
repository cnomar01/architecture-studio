import Loader from "../components/Loader";
import Navbar from "../components/NavbarComponent";
import Hero from "../components/HeroComponent";
import Manifesto from "../components/Manifesto";
import Projects from "../components/Projects";
import Footer from "../components/Footer";

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