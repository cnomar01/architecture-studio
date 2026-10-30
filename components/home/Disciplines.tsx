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
    <section
      aria-labelledby="home-expertise-title"
      className="relative overflow-hidden bg-[#171b1c] px-6 py-24 text-[#f5f4f0] sm:px-8 sm:py-32 md:px-10 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-[1740px]">
        <div className="grid gap-8 border-t border-white/25 pt-6 md:grid-cols-[minmax(160px,1fr)_minmax(0,3.5fr)] md:gap-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#9eb4be]">
            {copy.label}
          </p>
          <h2
            id="home-expertise-title"
            className={`font-light leading-[1.02] ${locale === "ar" ? "text-[clamp(2.3rem,6vw,6rem)] tracking-[-.02em]" : "text-[clamp(2.4rem,7vw,7.25rem)] tracking-[-.065em]"}`}
          >
            {copy.heading}
          </h2>
        </div>

        <div className="mt-16 border-t border-white/20 md:mt-24">
          {copy.items.map((item, index) => (
            <Link
              key={item}
              href={`/services#discipline-${index + 1}`}
              aria-label={item}
              className="group relative grid grid-cols-[34px_minmax(0,1fr)_26px] items-start gap-3 border-b border-white/20 py-9 transition-colors duration-300 hover:bg-white/[.035] sm:grid-cols-[50px_minmax(0,1fr)_28px] sm:gap-6 sm:py-11 lg:grid-cols-[minmax(160px,1fr)_minmax(0,3.5fr)_48px] lg:gap-10 lg:py-12"
            >
              <span className="pt-[.65em] text-[10px] font-medium tracking-[0.19em] text-[#9eb4be]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3
                className={`min-w-0 max-w-full font-light leading-[1.06] transition-transform duration-500 ease-out group-hover:translate-x-[6px] motion-reduce:transform-none ${locale === "ar" ? "text-[clamp(1.8rem,4.6vw,4.4rem)] tracking-[-.015em]" : "text-[clamp(1.875rem,4.5vw,5.1rem)] tracking-[-.055em]"}`}
              >
                {item}
              </h3>
              <span
                aria-hidden="true"
                className="pt-[.2em] text-end text-2xl font-light text-[#a5b9c2] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              >
                ↗
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-end sm:mt-14">
          <Link
            href="/services"
            className="inline-flex items-center gap-8 border-b border-[#9eb4be]/60 pb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#e1e5e4] transition-colors hover:border-white hover:text-white"
          >
            {copy.explore}
            <span aria-hidden="true" className="text-lg font-light">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
