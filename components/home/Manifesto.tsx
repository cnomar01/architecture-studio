"use client";

import Reveal from "@/components/animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";

const content = {
  en: {
    label: "01 — Perspective",
    first: "One idea.",
    second: "Many expressions.",
    description: "Space, identity, image and digital — brought together by a clear point of view.",
  },
  ar: {
    label: "01 — رؤيتنا",
    first: "فكرة واحدة.",
    second: "بتعبيرات متعددة.",
    description: "نربط المكان والهوية والصورة والتجربة الرقمية برؤية تصميمية واضحة.",
  },
  it: {
    label: "01 — Visione",
    first: "Un’idea.",
    second: "Molte espressioni.",
    description: "Spazio, identità, immagine e digitale, riuniti da una visione chiara.",
  },
} as const;

export default function Manifesto() {
  const { locale } = useLocale();
  const copy = content[locale];

  return (
    <section
      aria-labelledby="home-perspective-title"
      className="relative isolate overflow-hidden bg-[#f8f7f4] text-[#181b1b]"
    >
      <div className="mx-auto max-w-[1740px] px-6 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32 md:px-10 md:pb-36 md:pt-36 lg:px-16 lg:pb-44 lg:pt-44">
        <div className="grid gap-12 border-t border-[#c9cdca] pt-5 lg:grid-cols-[minmax(160px,1fr)_minmax(0,3.5fr)] lg:gap-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#4F6B7A]">
              {copy.label}
            </p>
            <div className="mt-14 hidden items-start gap-[5px] opacity-35 lg:flex" aria-hidden="true">
              <span className="h-16 w-px bg-[#4F6B7A]" />
              <span className="mt-4 h-8 w-px bg-[#4F6B7A]" />
              <span className="h-11 w-px bg-[#4F6B7A]" />
            </div>
          </div>
          <div className="min-w-0">
            <Reveal y={20}>
              <h2
                id="home-perspective-title"
                className={`font-light leading-[1.035] ${locale === "ar" ? "text-[clamp(2.5rem,6.5vw,7rem)] tracking-[-.018em]" : "text-[clamp(3.2rem,6.5vw,7.65rem)] tracking-[-.065em]"}`}
              >
                <span className="block">{copy.first}</span>
                <span className={`block ${locale === "ar" ? "lg:ms-[3%]" : locale === "it" ? "" : "lg:ms-[5%]"}`}>
                  {copy.second}
                </span>
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 border-t border-[#d3d6d2] pt-6 sm:mt-20 lg:grid-cols-[1fr_minmax(250px,380px)] lg:gap-10">
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#8a928f] lg:block">
                M / A — 01
              </span>
              <p className="max-w-[410px] text-[15px] font-light leading-[1.8] text-[#666b68] sm:text-base">
                {copy.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
