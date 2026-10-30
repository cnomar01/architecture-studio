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
    <section aria-labelledby="home-perspective-title" className="bg-[#f8f7f4] text-neutral-900">
      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-24 sm:px-8 sm:pb-32 sm:pt-32 md:px-10 lg:px-16 lg:pb-40 lg:pt-40">
        <div className="grid gap-9 border-t border-neutral-300 pt-6 md:gap-12 lg:grid-cols-[.35fr_1.65fr] lg:gap-12">
          <p className="pt-1 text-[10px] font-medium uppercase tracking-[.28em] text-[#4F6B7A]">
            {copy.label}
          </p>
          <div className="min-w-0">
            <Reveal y={24}>
              <h2
                id="home-perspective-title"
                className={`max-w-[1100px] text-[clamp(2.125rem,6vw,6.5rem)] font-light leading-[1.05] ${locale === "ar" ? "tracking-[-.015em]" : "tracking-[-.055em]"}`}
              >
                <span className="block">{copy.first}</span>
                <span className="block">{copy.second}</span>
              </h2>
            </Reveal>
            <p className="mt-8 max-w-[490px] text-[15px] font-light leading-[1.75] text-neutral-600 sm:mt-10 sm:text-base">
              {copy.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
