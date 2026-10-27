import type { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Mason & Arc",
  description: "Start a conversation with Mason & Arc about architecture, interiors, detailed design development, and optional delivery advisory.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <section className="bg-[#f8f7f4] px-8 pb-28 md:px-12 md:pb-40 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.35fr_1.65fr] lg:gap-x-16">
            <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-400">02 — Inquiry</span>
            <div>
              <h2 className="max-w-4xl text-4xl font-light tracking-[-0.04em] text-neutral-900 md:text-6xl">Tell us about your project.</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
