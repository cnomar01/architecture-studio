"use client";

import Reveal from "../animations/Reveal";

export default function Manifesto() {
  return (
    <section className="bg-[#f8f7f4] py-40 md:py-56">
      <div className="mx-auto max-w-7xl px-8 md:px-12">

        <p className="mb-10 text-xs uppercase tracking-[10px] text-neutral-500">
          Studio Philosophy
        </p>

        <Reveal>
          <h2 className="max-w-6xl text-5xl font-extralight leading-[1] tracking-[-0.03em] text-neutral-900 md:text-7xl lg:text-[90px]">
            We create architecture
            <br />
            that balances
            <br />
            emotion, function
            <br />
            and simplicity.
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-20 max-w-xl">
            <p className="text-lg leading-8 text-neutral-600">
              Every project is designed with clarity, timeless proportions,
              and attention to detail to create spaces that feel calm,
              functional, and memorable.
            </p>
          </div>
        </Reveal>

      </div>
    </section>
  );
}