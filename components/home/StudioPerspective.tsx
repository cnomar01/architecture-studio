"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const content = {
  en: {
    label: "04 — Begin",
    first: "Have something",
    second: "in mind?",
    link: "Start a conversation",
  },
  ar: {
    label: "04 — البداية",
    first: "عندك فكرة",
    second: "نبدأ منها؟",
    link: "ابدأ محادثة",
  },
  it: {
    label: "04 — Iniziamo",
    first: "Hai qualcosa",
    second: "in mente?",
    link: "Parliamone",
  },
} as const;

export default function StudioPerspective() {
  const { locale } = useLocale();
  const copy = content[locale];

  return (
    <section aria-labelledby="home-contact-title" className="bg-[#17191a] px-6 py-24 text-white sm:px-8 sm:py-32 md:px-10 lg:px-16 lg:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-12 border-t border-white/20 pt-7 lg:grid-cols-[.35fr_1.65fr] lg:gap-12">
        <p className="pt-1 text-[10px] font-medium uppercase tracking-[.28em] text-white/50">{copy.label}</p>
        <div>
          <h2
            id="home-contact-title"
            className={`max-w-[1100px] font-light leading-[1.03] ${locale === "ar" ? "text-[clamp(3rem,6vw,6.5rem)] tracking-[-.02em]" : "text-[clamp(3rem,6.1vw,7rem)] tracking-[-.055em]"}`}
          >
            <span className="block">{copy.first}</span>
            <span className="block">{copy.second}</span>
          </h2>
          <Link
            href="/contact"
            className="mt-12 inline-flex items-center justify-between gap-12 border-b border-white/65 pb-3 text-sm font-light tracking-[.01em] transition-colors hover:border-[#9fb2bb] hover:text-[#c4d4dc] sm:mt-16 sm:min-w-72"
          >
            {copy.link} <span aria-hidden="true" className="text-xl">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
