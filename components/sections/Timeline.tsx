"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import Reveal from "@/components/animations/Reveal";
import Container from "@/components/shared/Container";

const timeline = [
  {
    year: "2024",
    title: "The Beginning",
    description:
      "Mason & Arc begins with a simple idea: architecture should connect design, material, and the experience of space.",
  },
  {
    year: "2025",
    title: "Design & Development",
    description:
      "The studio expands its approach across architecture, interiors, and detailed design development.",
  },
  {
    year: "2026",
    title: "Building the Vision",
    description:
      "Ideas move from the first sketch into carefully considered built spaces.",
  },
  {
    year: "NOW",
    title: "Looking Forward",
    description:
      "A growing body of work shaped by experimentation, collaboration, and a continuous search for better architecture.",
  },
];

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const items =
      sectionRef.current.querySelectorAll<HTMLElement>(".timeline-item");

    const ctx = gsap.context(() => {
      gsap.from(items, {
        y: 70,
        opacity: 0,
        duration: 1,
        stagger: 0.14,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-t border-neutral-300 bg-[#f8f7f4] text-neutral-900"
    >
      <Container
        className="
          !max-w-none
          px-5
          py-28
          sm:px-8
          md:px-10
          md:py-40
          lg:px-14
          lg:py-52
          xl:px-16
        "
      >
        {/* HEADER */}

        <div
          className="
            grid
            grid-cols-1
            gap-12
            lg:grid-cols-[0.7fr_1.3fr]
            lg:gap-x-20
          "
        >
          <Reveal>
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
              03 — Timeline
            </span>
          </Reveal>

          <Reveal>
            <h2
              className="
                max-w-[950px]
                text-[58px]
                font-extralight
                leading-[0.86]
                tracking-[-0.055em]
                sm:text-[76px]
                md:text-[100px]
                lg:text-[120px]
                xl:text-[135px]
              "
            >
              How we
              <br />
              got here.
            </h2>
          </Reveal>
        </div>

        {/* TIMELINE */}

        <div className="mt-32 border-t border-neutral-300 md:mt-48">
          {timeline.map((item, index) => (
            <div
              key={item.year}
              className="
                timeline-item
                grid
                grid-cols-[70px_1fr]
                gap-x-6
                border-b
                border-neutral-300
                py-12
                md:grid-cols-[150px_0.8fr_1.2fr_30px]
                md:gap-x-10
                md:py-16
                lg:gap-x-16
                lg:py-20
              "
            >
              <span
                className="
                  pt-2
                  text-[13px]
                  font-light
                  text-neutral-500
                  md:text-[16px]
                "
              >
                {item.year}
              </span>

              <h3
                className="
                  text-[32px]
                  font-extralight
                  leading-[0.95]
                  tracking-[-0.045em]
                  sm:text-[40px]
                  md:text-[50px]
                  lg:text-[58px]
                "
              >
                {item.title}
              </h3>

              <p
                className="
                  col-start-2
                  mt-7
                  max-w-[620px]
                  text-[13px]
                  font-light
                  leading-[1.8]
                  text-neutral-500
                  md:col-start-3
                  md:mt-0
                  md:text-[14px]
                  lg:text-[15px]
                "
              >
                {item.description}
              </p>

              <span
                className="
                  hidden
                  pt-2
                  text-[8px]
                  tracking-[0.25em]
                  text-neutral-400
                  md:block
                "
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}