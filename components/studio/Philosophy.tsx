"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Reveal from "../animations/Reveal";
import Container from "../shared/Container";

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".philosophy-line", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        border-t
        border-neutral-300
        bg-[#f8f7f4]
        text-neutral-900
      "
    >
      <Container
        className="
          !max-w-none
          px-6
          py-28
          sm:px-8
          md:px-12
          md:py-40
          lg:px-16
          lg:py-52
          xl:px-20
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-14
            lg:grid-cols-[0.35fr_1.65fr]
            lg:gap-x-16
          "
        >
          {/* LABEL */}

          <Reveal>
            <div>
              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.35em]
                  text-neutral-400
                "
              >
                02 — Philosophy
              </span>
            </div>
          </Reveal>

          {/* CONTENT */}

          <div>
            <Reveal>
              <h2
                className="
                  max-w-[1150px]
                  overflow-hidden
                  text-[48px]
                  font-light
                  leading-[0.88]
                  tracking-[-0.055em]
                  sm:text-[62px]
                  md:text-[82px]
                  lg:text-[105px]
                  xl:text-[125px]
                "
              >
                <span className="philosophy-line block">
                  We believe
                </span>

                <span className="philosophy-line block">
                  architecture
                </span>

                <span className="philosophy-line block">
                  should create
                </span>

                <span className="philosophy-line block">
                  spaces that
                </span>

                <span className="philosophy-line block">
                  remain meaningful
                </span>

                <span className="philosophy-line block">
                  for generations.
                </span>
              </h2>
            </Reveal>

            <Reveal>
              <div
                className="
                  mt-16
                  grid
                  grid-cols-1
                  gap-10
                  border-t
                  border-neutral-300
                  pt-6
                  md:mt-24
                  md:grid-cols-[0.55fr_1fr]
                  md:gap-16
                "
              >
                <span
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.3em]
                    text-neutral-400
                  "
                >
                  Our approach
                </span>

                <p
                  className="
                    max-w-[650px]
                    text-[14px]
                    font-light
                    leading-[1.85]
                    text-neutral-500
                    md:text-[16px]
                  "
                >
                  Every project begins with listening. We study the
                  context, understand the people, and transform ideas
                  into timeless architecture through simplicity,
                  precision and material honesty.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* BOTTOM MARKER */}

        <Reveal>
          <div
            className="
              mt-24
              flex
              items-center
              justify-between
              border-t
              border-neutral-300
              pt-5
              md:mt-36
            "
          >
            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.3em]
                text-neutral-400
              "
            >
              Context / People / Material
            </span>

            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.3em]
                text-neutral-400
              "
            >
              02 / 03
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}