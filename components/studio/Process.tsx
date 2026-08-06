"use client";

import Reveal from "../animations/Reveal";

const steps = [
  {
    number: "01",
    title: "Research",
    text: "Understanding the site, context, and client vision before every design decision.",
  },
  {
    number: "02",
    title: "Design",
    text: "Transforming ideas into timeless architectural concepts with clarity and precision.",
  },
  {
    number: "03",
    title: "Deliver",
    text: "Executing every detail with quality, collaboration, and material honesty.",
  },
];

export default function Process() {
  return (
    <section className="bg-[#f8f7f4] py-40 md:py-56">
      <div className="mx-auto max-w-7xl px-8 md:px-16">

        <p className="mb-10 text-xs uppercase tracking-[8px] text-neutral-500">
          Process
        </p>

        <Reveal>
          <h2 className="max-w-4xl text-5xl md:text-7xl font-extralight tracking-[-0.03em] leading-tight mb-24">
            Every project follows
            a clear design process.
          </h2>
        </Reveal>

        <div className="grid gap-16 md:grid-cols-3">
          {steps.map((step) => (
            <Reveal key={step.number}>
              <div className="border-t border-neutral-300 pt-8">

                <p className="mb-6 text-sm tracking-[6px] text-neutral-400">
                  {step.number}
                </p>

                <h3 className="mb-5 text-3xl font-light">
                  {step.title}
                </h3>

                <p className="leading-8 text-neutral-600">
                  {step.text}
                </p>

              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}