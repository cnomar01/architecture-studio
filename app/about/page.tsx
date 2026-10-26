import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About | Mason & Arc",
  description: "Mason & Arc is an architectural design studio based in Egypt and working with clients internationally.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
