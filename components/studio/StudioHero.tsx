"use client";

import Reveal from "@/components/animations/Reveal";
import Container from "@/components/shared/Container";

export default function StudioHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f8f7f4]">
      <Container
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-8
          py-32
          md:px-12
          lg:px-16
        "
      >
        <div className="w-full max-w-[1200px]">

          {/* Intro */}
          <Reveal>
            <p
              className="
                mb-10
                text-center
                text-[10px]
                font-light
                uppercase
                tracking-[0.45em]
                text-neutral-500
              "
            >
              MASON & ARC
            </p>
          </Reveal>

          {/* Main title */}
          <Reveal>
            <h1
              className="
                text-center
                text-[76px]
                font-extralight
                leading-[0.82]
                tracking-[-0.06em]
                text-neutral-900
                sm:text-[100px]
                md:text-[130px]
                lg:text-[160px]
              "
            >
              Studio
            </h1>
          </Reveal>

          {/* Divider */}
          <Reveal>
            <div className="mx-auto mt-14 h-px w-full max-w-[900px] bg-neutral-300" />
          </Reveal>

          {/* Description */}
          <Reveal>
            <p
              className="
                mx-auto
                mt-12
                max-w-[620px]
                text-center
                text-[15px]
                font-light
                leading-[1.9]
                tracking-[0.01em]
                text-neutral-600
                md:text-[17px]
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