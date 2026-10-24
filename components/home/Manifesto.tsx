"use client";

import Reveal from "../animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";
import GoldenRatio from "./GoldenRatio";

export default function Manifesto() {
  const { copy } = useLocale();
  return (
    <section className="bg-[#f8f7f4] text-neutral-900">
      <GoldenRatio />

      <div className="mx-auto max-w-7xl px-8 py-40 md:px-12 md:py-56">

        <p className="mb-10 text-xs uppercase tracking-[10px] text-neutral-500">
          {copy.philosophyLabel}
        </p>

        <Reveal>
          <h2 className="max-w-6xl text-5xl font-extralight leading-[1] tracking-[-0.03em] text-neutral-900 md:text-7xl lg:text-[90px]">
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
          <div className="mt-20 max-w-xl">
            <p className="text-lg leading-8 text-neutral-600">
              {copy.philosophyIntro}
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
