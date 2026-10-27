"use client";

import Reveal from "../animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";
import GoldenRatio from "./GoldenRatio";

export default function Manifesto() {
  const { copy } = useLocale();
  return (
    <section className="bg-[#f8f7f4] text-neutral-900">
      <GoldenRatio />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32 md:px-12 md:py-56">

        <p className="mb-8 text-[10px] uppercase tracking-[7px] text-neutral-500 sm:mb-10 sm:text-xs sm:tracking-[10px]">
          {copy.philosophyLabel}
        </p>

        <Reveal>
          <h2 className="max-w-6xl text-[32px] font-extralight leading-[1.04] tracking-[-0.03em] text-neutral-900 sm:text-[44px] md:text-7xl md:leading-[1] lg:text-[90px]">
            {copy.philosophyLine1}
            <br />
            {copy.philosophyLine2}
            <br />
            {copy.philosophyLine3}
            <br />
            {copy.philosophyLine4}
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 max-w-xl sm:mt-16 md:mt-20">
            <p className="text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
              {copy.philosophyIntro}
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
