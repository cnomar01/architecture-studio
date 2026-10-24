"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Reveal from "../animations/Reveal";
import Container from "../shared/Container";

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const ratioRef = useRef<HTMLDivElement>(null);

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

      const ratio = ratioRef.current;
      const spiral = ratio?.querySelector<SVGPathElement>(".golden-spiral");
      const guides = ratio?.querySelectorAll<SVGGeometryElement>(".ratio-guide");
      const point = ratio?.querySelector<SVGCircleElement>(".ratio-point");
      const copy = ratio?.querySelector<HTMLElement>(".ratio-copy");

      if (!ratio || !spiral || !guides || !point || !copy) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(guides, { opacity: 0.12, strokeDashoffset: 0 });
        gsap.set(spiral, { strokeDashoffset: 0 });
        gsap.set(point, { opacity: 1, scale: 1 });
        gsap.set(copy, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(guides, {
        opacity: 0,
        strokeDasharray: 1,
        strokeDashoffset: 1,
      });
      gsap.set(spiral, {
        strokeDasharray: 1,
        strokeDashoffset: 1,
      });
      gsap.set(point, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center",
      });
      gsap.set(copy, { opacity: 0, y: 24 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ratio,
            start: "top 82%",
            end: "bottom 42%",
            scrub: 1,
          },
        })
        .to(point, { opacity: 1, scale: 1, duration: 0.12 })
        .to(
          guides,
          {
            opacity: 0.28,
            strokeDashoffset: 0,
            duration: 0.7,
            stagger: 0.045,
            ease: "power1.inOut",
          },
          0.08,
        )
        .to(
          spiral,
          {
            strokeDashoffset: 0,
            duration: 1.25,
            ease: "power2.inOut",
          },
          0.42,
        )
        .to(guides, { opacity: 0.1, duration: 0.45 }, 1.3)
        .to(copy, { opacity: 1, y: 0, duration: 0.45 }, 1.35);
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

            <div
              ref={ratioRef}
              className="
                relative
                mt-20
                min-h-[66svh]
                overflow-hidden
                border-y
                border-neutral-300
                py-10
                sm:mt-24
                sm:py-14
                md:min-h-[76svh]
                md:py-16
              "
            >
              <div className="flex items-center justify-between gap-6">
                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-neutral-400
                  "
                >
                  Mason &amp; Arc — Design Principle 01
                </span>

                <span
                  aria-hidden="true"
                  className="
                    hidden
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-neutral-400
                    sm:block
                  "
                >
                  Proportion / Order / Restraint
                </span>
              </div>

              <svg
                aria-hidden="true"
                className="mt-10 h-auto w-full sm:mt-12"
                fill="none"
                viewBox="0 0 1160 758"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  stroke="#4f6b7a"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                >
                  <rect
                    className="ratio-guide"
                    height="618"
                    pathLength="1"
                    width="1000"
                    x="80"
                    y="70"
                  />
                  <path
                    className="ratio-guide"
                    d="M698 70V688"
                    pathLength="1"
                  />
                  <path
                    className="ratio-guide"
                    d="M698 452H1080"
                    pathLength="1"
                  />
                  <path
                    className="ratio-guide"
                    d="M844 452V688"
                    pathLength="1"
                  />
                  <path
                    className="ratio-guide"
                    d="M698 542H844"
                    pathLength="1"
                  />
                  <path
                    className="ratio-guide"
                    d="M788 452V542"
                    pathLength="1"
                  />
                  <path
                    className="ratio-guide"
                    d="M788 508H844"
                    pathLength="1"
                  />
                  <path
                    className="ratio-guide"
                    d="M810 508V542"
                    pathLength="1"
                  />
                  <path
                    className="ratio-guide"
                    d="M788 520H810"
                    pathLength="1"
                  />
                </g>

                <path
                  className="golden-spiral"
                  d="M800 508 A12 12 0 0 0 788 520 A22 22 0 0 0 810 542 A34 34 0 0 0 844 508 A56 56 0 0 0 788 452 A90 90 0 0 0 698 542 A146 146 0 0 0 844 688 A236 236 0 0 0 1080 452 A382 382 0 0 0 698 70 A618 618 0 0 0 80 688"
                  pathLength="1"
                  stroke="#4f6b7a"
                  strokeLinecap="round"
                  strokeWidth="2.25"
                  vectorEffect="non-scaling-stroke"
                />

                <circle
                  className="ratio-point"
                  cx="800"
                  cy="508"
                  fill="#4f6b7a"
                  r="4"
                />
              </svg>

              <p
                className="
                  ratio-copy
                  ml-auto
                  mt-8
                  max-w-[820px]
                  text-[34px]
                  font-light
                  leading-[1.02]
                  tracking-[-0.045em]
                  sm:text-[46px]
                  md:mt-10
                  md:text-[58px]
                  lg:text-[68px]
                "
              >
                Proportion is a principle, not a formula.
              </p>
            </div>

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
