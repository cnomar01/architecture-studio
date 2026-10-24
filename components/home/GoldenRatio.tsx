"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GoldenRatio() {
  const ratioRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const ratio = ratioRef.current;
      const spiral = ratio?.querySelector<SVGPathElement>(".home-golden-spiral");
      const guides = ratio?.querySelectorAll<SVGGeometryElement>(".home-ratio-guide");
      const point = ratio?.querySelector<SVGCircleElement>(".home-ratio-point");
      const copy = ratio?.querySelector<HTMLElement>(".home-ratio-copy");

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
    },
    { scope: ratioRef },
  );

  return (
    <div
      ref={ratioRef}
      className="border-b border-neutral-300 px-6 py-24 sm:px-8 sm:py-28 md:px-12 md:py-32 lg:px-16 xl:px-20"
    >
      <div className="flex items-center justify-between gap-6">
        <span className="text-[8px] uppercase tracking-[0.3em] text-neutral-400">
          Mason &amp; Arc — Design Principle 01
        </span>

        <span
          aria-hidden="true"
          className="hidden text-[8px] uppercase tracking-[0.3em] text-neutral-400 sm:block"
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
            className="home-ratio-guide"
            height="618"
            pathLength="1"
            width="1000"
            x="80"
            y="70"
          />
          <path className="home-ratio-guide" d="M698 70V688" pathLength="1" />
          <path className="home-ratio-guide" d="M698 452H1080" pathLength="1" />
          <path className="home-ratio-guide" d="M844 452V688" pathLength="1" />
          <path className="home-ratio-guide" d="M698 542H844" pathLength="1" />
          <path className="home-ratio-guide" d="M788 452V542" pathLength="1" />
          <path className="home-ratio-guide" d="M788 508H844" pathLength="1" />
          <path className="home-ratio-guide" d="M810 508V542" pathLength="1" />
          <path className="home-ratio-guide" d="M788 520H810" pathLength="1" />
        </g>

        <path
          className="home-golden-spiral"
          d="M800 508 A12 12 0 0 0 788 520 A22 22 0 0 0 810 542 A34 34 0 0 0 844 508 A56 56 0 0 0 788 452 A90 90 0 0 0 698 542 A146 146 0 0 0 844 688 A236 236 0 0 0 1080 452 A382 382 0 0 0 698 70 A618 618 0 0 0 80 688"
          pathLength="1"
          stroke="#4f6b7a"
          strokeLinecap="round"
          strokeWidth="2.25"
          vectorEffect="non-scaling-stroke"
        />

        <circle
          className="home-ratio-point"
          cx="800"
          cy="508"
          fill="#4f6b7a"
          r="4"
        />
      </svg>

      <p className="home-ratio-copy ml-auto mt-8 max-w-[920px] text-[34px] font-light leading-[1.02] tracking-[-0.045em] text-neutral-900 sm:text-[48px] md:mt-10 md:text-[66px] lg:text-[78px]">
        Proportion is a principle, not a formula.
      </p>
    </div>
  );
}
