"use client";

import Reveal from "../animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function Manifesto() {
  const { copy } = useLocale();

  return (
    <section className="bg-[#F4F1EC] py-28 text-[#0B0B0B] sm:py-36 md:py-44 lg:py-52">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-y-14 px-6 sm:px-8 md:px-12 lg:grid-cols-12 lg:px-16 xl:px-20">
        <div className="lg:col-span-2">
          <p className="text-[9px] uppercase tracking-[0.34em] text-[#7D7D79]">
            {copy.philosophyLabel}
          </p>
        </div>

        <div className="lg:col-span-8 lg:col-start-4">
          <Reveal>
            <h2 className="max-w-[1000px] text-[46px] font-normal leading-[0.98] tracking-[-0.04em] sm:text-[58px] md:text-[72px] lg:text-[84px] xl:text-[94px]">
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
            <p className="mt-12 max-w-[650px] text-[14px] font-light leading-[1.8] text-[#5F5F5B] sm:text-[15px] md:mt-16 md:text-[16px]">
              {copy.philosophyIntro}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
