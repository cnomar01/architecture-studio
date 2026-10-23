"use client";

import Reveal from "../animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function Manifesto() {
  const { copy } = useLocale();

  return (
    <section className="bg-[var(--mason-off-white)] py-28 text-[var(--mason-black)] sm:py-36 md:py-44 lg:py-52">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-y-14 px-6 sm:px-8 md:px-12 lg:grid-cols-12 lg:px-16 xl:px-20">
        <div className="lg:col-span-2">
          <p className="text-[9px] font-medium uppercase tracking-[0.24em] text-black/50">
            {copy.philosophyLabel}
          </p>
        </div>

        <div className="lg:col-span-8 lg:col-start-4">
          <Reveal>
            <h2 className="max-w-[1000px] text-[40px] font-extralight leading-[1.04] tracking-[-0.03em] sm:text-[52px] md:text-[64px] lg:text-[78px] xl:text-[90px]">
              {copy.philosophyLine1}
              <br />
              {copy.philosophyLine2}
              <br />
              {copy.philosophyLine3}
              <br />
              {copy.philosophyLine4}
            </h2>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-12 max-w-[650px] text-[14px] font-normal leading-[1.75] text-black/60 sm:text-[15px] md:mt-16 md:text-[16px]">
              {copy.philosophyIntro}
            </p>
            <span className="mason-line mt-10" aria-hidden="true" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
