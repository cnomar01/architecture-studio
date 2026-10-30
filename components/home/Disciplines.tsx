"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const content = {
  en: {
    label: "02 — Expertise",
    heading: "Four practices.",
    explore: "Explore all services",
    items: [
      "Architecture & Interiors",
      "Branding & Creative Direction",
      "Visualization & Communication",
      "Digital Experiences",
    ],
  },
  ar: {
    label: "02 — التخصصات",
    heading: "أربع ممارسات.",
    explore: "استكشف كل الخدمات",
    items: [
      "العمارة والتصميم الداخلي",
      "الهوية والتوجيه الإبداعي",
      "التصور والتواصل",
      "التجارب الرقمية",
    ],
  },
  it: {
    label: "02 — Competenze",
    heading: "Quattro pratiche.",
    explore: "Esplora tutti i servizi",
    items: [
      "Architettura & Interni",
      "Branding & Direzione Creativa",
      "Visualizzazione & Comunicazione",
      "Esperienze Digitali",
    ],
  },
} as const;

export default function Disciplines() {
  const { locale } = useLocale();
  const copy = content[locale];

  return (
    <section aria-labelledby="home-expertise-title" className="bg-[#f8f7f4] px-6 pb-24 text-neutral-900 sm:px-8 sm:pb-32 md:px-10 lg:px-16 lg:pb-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-9 border-t border-neutral-300 pt-6 lg:grid-cols-[.35fr_1.65fr] lg:gap-12">
          <p className="pt-1 text-[10px] font-medium uppercase tracking-[.28em] text-[#4F6B7A]">
            {copy.label}
          </p>
          <h2
            id="home-expertise-title"
            className={`text-[clamp(2.65rem,5.7vw,6.25rem)] font-light leading-[1.04] ${locale === "ar" ? "tracking-[-.015em]" : "tracking-[-.055em]"}`}
          >
            {copy.heading}
          </h2>
        </div>

        <div className="mt-11 border-t border-neutral-300 sm:mt-16">
          {copy.items.map((item, index) => (
            <Link
              key={item}
              href={`/services#discipline-${index + 1}`}
              className="group grid grid-cols-[30px_minmax(0,1fr)_24px] items-start gap-3 border-b border-neutral-300 py-8 transition-colors hover:text-[#4F6B7A] sm:grid-cols-[45px_minmax(0,1fr)_28px] sm:gap-5 sm:py-10 md:grid-cols-[72px_minmax(0,1fr)_32px] md:gap-8"
            >
              <span className="pt-[.45em] text-[10px] font-medium tracking-[.16em] text-[#4F6B7A]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className={`min-w-0 max-w-full font-light leading-[1.1] tracking-[-.045em] ${locale === "ar" ? "text-[clamp(1.75rem,4vw,3.5rem)] tracking-[-.015em]" : "text-[clamp(1.7rem,4vw,3.8rem)]"}`}>
                {item}
              </h3>
              <span aria-hidden="true" className="pt-1 text-end text-xl font-light transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="/services"
          className="mt-9 inline-flex items-center gap-4 border-b border-neutral-400 pb-2 text-[11px] font-medium uppercase tracking-[.16em] transition-opacity hover:opacity-60 sm:mt-12"
        >
          {copy.explore} <span aria-hidden="true" className="text-base">↗</span>
        </Link>
      </div>
    </section>
  );
}
