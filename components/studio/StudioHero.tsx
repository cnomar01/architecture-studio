"use client";

import Reveal from "@/components/animations/Reveal";
import Container from "@/components/shared/Container";

export default function StudioHero() {
  return (
    <section className="bg-[#f8f7f4]">
      <Container className="flex min-h-screen items-center justify-center py-32">

        <div className="max-w-4xl text-center">

          <Reveal>
            <p className="mb-8 text-xs uppercase tracking-[8px] text-neutral-500">
              MASON & ARC
            </p>
          </Reveal>

          <Reveal>
            <h1
              className="
                text-6xl
                sm:text-7xl
                md:text-8xl
                lg:text-[120px]
                font-extralight
                tracking-[-0.05em]
                leading-[0.9]
              "
            >
              Studio
            </h1>
          </Reveal>

          <Reveal>
            <p
              className="
                mx-auto
                mt-12
                max-w-2xl
                text-lg
                leading-9
                text-neutral-600
                md:text-xl
              "
            >
              Designing architecture through timeless thinking,
              material honesty and human experience.
            </p>
          </Reveal>

        </div>

      </Container>
    </section>
  );
}