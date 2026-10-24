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

const RATIO_TILES = [
  { x: 80, y: 70, width: 618, height: 618, opacity: 0.018 },
  { x: 698, y: 70, width: 382, height: 382, opacity: 0.032 },
  { x: 844, y: 452, width: 236, height: 236, opacity: 0.018 },
  { x: 698, y: 542, width: 146, height: 146, opacity: 0.032 },
  { x: 698, y: 452, width: 90, height: 90, opacity: 0.018 },
  { x: 788, y: 452, width: 56, height: 56, opacity: 0.032 },
];

export default function GoldenRatio() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const artwork = section?.querySelector<HTMLElement>(".home-ratio-artwork");
      const frame = section?.querySelector<SVGRectElement>(".home-ratio-frame");
      const spiral = section?.querySelector<SVGPathElement>(".home-golden-spiral");
      const guides = section?.querySelectorAll<SVGGeometryElement>(".home-ratio-guide");
      const tiles = section?.querySelectorAll<SVGRectElement>(".home-ratio-tile");
      const point = section?.querySelector<SVGCircleElement>(".home-ratio-point");
      const copyLines = section?.querySelectorAll<HTMLElement>(".home-ratio-line");

      if (
        !section ||
        !artwork ||
        !frame ||
        !spiral ||
        !guides ||
        !tiles ||
        !point ||
        !copyLines?.length
      ) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(artwork, { opacity: 1, scale: 1, y: 0 });
        gsap.set(frame, { opacity: 0.34, strokeDashoffset: 0 });
        gsap.set(guides, { opacity: 0.28, strokeDashoffset: 0 });
        gsap.set(tiles, { opacity: 1 });
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
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
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
          frame,
          {
            opacity: 0.34,
            strokeDashoffset: 0,
            duration: 1,
            ease: "power3.out",
          },
          0.02,
        )
        .to(
          tiles,
          {
            opacity: 1,
            duration: 1.15,
            stagger: 0.04,
            ease: "power3.out",
          },
          0.08,
        )
        .to(
          guides,
          {
            opacity: 0.28,
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
      className="relative h-[190svh] min-h-[1330px] bg-[#f8f7f4] text-neutral-900 motion-reduce:h-[100svh] motion-reduce:min-h-[700px]"
    >
      <div className="sticky top-0 h-[100svh] min-h-[700px] overflow-hidden border-b border-neutral-300">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[10%] flex justify-center md:top-1/2 md:-translate-y-[58%]"
        >
          <div
            className="home-ratio-artwork flex w-full justify-center"
            style={{ opacity: 0.45, transform: "translateY(36px) scale(0.975)" }}
          >
            <svg
              className="h-auto w-[118%] max-w-none sm:w-[92vw] md:h-[68svh] md:w-auto"
              fill="none"
              shapeRendering="geometricPrecision"
              viewBox="0 0 1160 758"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#4f6b7a">
                {RATIO_TILES.map((tile) => (
                  <rect
                    key={`${tile.x}-${tile.y}`}
                    className="home-ratio-tile"
                    fillOpacity={tile.opacity}
                    height={tile.height}
                    style={{ opacity: 0.15 }}
                    width={tile.width}
                    x={tile.x}
                    y={tile.y}
                  />
                ))}
              </g>

              <g
                stroke="#4f6b7a"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
              >
                <rect
                  className="home-ratio-frame"
                  height="618"
                  pathLength="1"
                  style={{ opacity: 0.12, strokeDasharray: 1, strokeDashoffset: 1 }}
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
                    style={{ opacity: 0.06, strokeDasharray: 1, strokeDashoffset: 1 }}
                  />
                ))}
              </g>

              <path
                className="home-golden-spiral"
                d="M800 508 A12 12 0 0 0 788 520 A22 22 0 0 0 810 542 A34 34 0 0 0 844 508 A56 56 0 0 0 788 452 A90 90 0 0 0 698 542 A146 146 0 0 0 844 688 A236 236 0 0 0 1080 452 A382 382 0 0 0 698 70 A618 618 0 0 0 80 688"
                pathLength="1"
                stroke="#4f6b7a"
                strokeLinecap="round"
                strokeWidth="2.8"
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
      </div>
    </section>
  );
}
