"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GUIDE_PATHS = [
  "M698 70V688",
  "M698 452H1080",
  "M844 452V688",
  "M698 542H844",
  "M788 452V542",
  "M788 508H844",
  "M810 508V542",
  "M788 520H810",
];

export default function GoldenRatio() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const artwork = section?.querySelector<HTMLElement>(".home-ratio-artwork");
      const spiral = section?.querySelector<SVGPathElement>(".home-golden-spiral");
      const guides = section?.querySelectorAll<SVGGeometryElement>(".home-ratio-guide");
      const point = section?.querySelector<SVGCircleElement>(".home-ratio-point");
      const copyLines = section?.querySelectorAll<HTMLElement>(".home-ratio-line");

      if (!section || !artwork || !spiral || !guides || !point || !copyLines?.length) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(artwork, { opacity: 1, scale: 1, y: 0 });
        gsap.set(guides, { opacity: 0.1, strokeDashoffset: 0 });
        gsap.set(spiral, { strokeDashoffset: 0 });
        gsap.set(point, { opacity: 1, scale: 1 });
        gsap.set(copyLines, { y: 0 });
        return;
      }

      gsap.set(copyLines, { y: "110%" });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        })
        .to(
          artwork,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
          },
          0,
        )
        .to(
          guides,
          {
            opacity: 0.1,
            strokeDashoffset: 0,
            duration: 1.15,
            stagger: 0.04,
            ease: "power3.out",
          },
          0.08,
        )
        .to(
          spiral,
          {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power4.out",
          },
          0.15,
        )
        .to(
          copyLines,
          {
            y: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: "power4.out",
          },
          0.55,
        )
        .to(
          point,
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          1.7,
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[700px] overflow-hidden border-b border-neutral-300 bg-[#f8f7f4] text-neutral-900"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[10%] flex justify-center md:top-1/2 md:-translate-y-[58%]"
      >
        <div
          className="home-ratio-artwork flex w-full justify-center"
          style={{ opacity: 0.35, transform: "translateY(36px) scale(0.975)" }}
        >
          <svg
            className="h-auto w-[118%] max-w-none sm:w-[94vw] md:h-[74svh] md:w-auto"
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
                className="home-ratio-guide"
                height="618"
                pathLength="1"
                style={{ opacity: 0, strokeDasharray: 1, strokeDashoffset: 1 }}
                width="1000"
                x="80"
                y="70"
              />
              {GUIDE_PATHS.map((path) => (
                <path
                  key={path}
                  className="home-ratio-guide"
                  d={path}
                  pathLength="1"
                  style={{ opacity: 0, strokeDasharray: 1, strokeDashoffset: 1 }}
                />
              ))}
            </g>

            <path
              className="home-golden-spiral"
              d="M800 508 A12 12 0 0 0 788 520 A22 22 0 0 0 810 542 A34 34 0 0 0 844 508 A56 56 0 0 0 788 452 A90 90 0 0 0 698 542 A146 146 0 0 0 844 688 A236 236 0 0 0 1080 452 A382 382 0 0 0 698 70 A618 618 0 0 0 80 688"
              pathLength="1"
              stroke="#4f6b7a"
              strokeLinecap="round"
              strokeWidth="2.4"
              style={{ strokeDasharray: 1, strokeDashoffset: -1 }}
              vectorEffect="non-scaling-stroke"
            />

            <circle
              className="home-ratio-point"
              cx="800"
              cy="508"
              fill="#4f6b7a"
              r="4"
              style={{
                opacity: 0,
                transform: "scale(0.65)",
                transformOrigin: "center",
              }}
            />
          </svg>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-14 z-10 mx-auto max-w-7xl px-6 sm:bottom-16 sm:px-8 md:bottom-20 md:px-12">
        <p
          aria-label="Proportion is a principle, not a formula."
          className="max-w-[1000px] text-[38px] font-light leading-[0.92] tracking-[-0.05em] sm:text-[54px] md:text-[72px] lg:text-[88px]"
        >
          <span aria-hidden="true" className="block overflow-hidden">
            <span
              className="home-ratio-line block"
              style={{ transform: "translateY(110%)" }}
            >
              Proportion is a principle,
            </span>
          </span>
          <span aria-hidden="true" className="block overflow-hidden">
            <span
              className="home-ratio-line block"
              style={{ transform: "translateY(110%)" }}
            >
              not a formula.
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}
