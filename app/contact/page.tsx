import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell Mason & Arc what you’re working on across space, identity, image or digital experience.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  return (
    <main>
      <ContactHero />
      <ContactForm initialService={service} />
    </main>
  );
}
