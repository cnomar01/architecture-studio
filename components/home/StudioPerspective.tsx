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
    <section
      aria-labelledby="home-contact-title"
      className="relative isolate overflow-hidden bg-[#171b1c] px-6 pb-28 pt-24 text-[#f5f4f0] sm:px-8 sm:pb-36 sm:pt-32 md:px-10 lg:px-16 lg:pb-44 lg:pt-40"
    >
      <div className="pointer-events-none absolute end-[8%] top-[18%] hidden items-start gap-[10px] opacity-10 lg:flex" aria-hidden="true">
        <span className="h-44 w-px bg-[#9eb4be]" />
        <span className="mt-10 h-24 w-px bg-[#9eb4be]" />
        <span className="h-36 w-px bg-[#9eb4be]" />
        <span className="mt-16 h-28 w-px bg-[#9eb4be]" />
      </div>

      <div className="relative mx-auto max-w-[1740px]">
        <div className="grid gap-12 border-t border-white/25 pt-6 lg:grid-cols-[minmax(160px,1fr)_minmax(0,3.5fr)] lg:gap-10">
          <p className="text-[10px] font-medium uppercase tracking-[.24em] text-[#9eb4be]">
            {copy.label}
          </p>
          <div className="min-w-0">
            <h2
              id="home-contact-title"
              className={`max-w-[1100px] font-light leading-[1.02] ${locale === "ar" ? "text-[clamp(2.8rem,6.5vw,7rem)] tracking-[-.015em]" : "text-[clamp(3.4rem,7.5vw,9rem)] tracking-[-.065em]"}`}
            >
              <span className="block">{copy.first}</span>
              <span className="block">{copy.second}</span>
            </h2>

            <Link
              href="/contact"
              className="group mt-16 flex w-full items-center justify-between gap-6 border-t border-b border-white/35 py-6 transition-colors hover:border-[#9eb4be] hover:text-[#c2d0d6] sm:mt-24 sm:py-8"
            >
              <span className="text-[clamp(1.15rem,2vw,1.65rem)] font-light tracking-[-.035em]">
                {copy.link}
              </span>
              <span
                aria-hidden="true"
                className="text-3xl font-light transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              >
                ↗
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
