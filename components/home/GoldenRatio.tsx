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
        gsap.set(guides, { opacity: 0.1, strokeDashoffset: 0 });
        gsap.set(spiral, { strokeDashoffset: 0 });
        gsap.set(point, { opacity: 1, scale: 1 });
        gsap.set(copy, { opacity: 1, y: 0 });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ratio,
            start: "top 85%",
            once: true,
          },
        })
        .to(
          guides,
          {
            opacity: 0.1,
            strokeDashoffset: 0,
            duration: 0.9,
            stagger: 0.035,
            ease: "power3.out",
          },
          0,
        )
        .to(
          spiral,
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power4.out",
          },
          0,
        )
        .to(
          copy,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
          },
          0.25,
        )
        .to(
          point,
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          1.1,
        );
    },
    { scope: ratioRef },
  );

  return (
    <div
      ref={ratioRef}
      className="mx-auto max-w-7xl border-b border-neutral-300 px-6 py-24 sm:px-8 sm:py-28 md:px-12 md:py-32"
    >
      <svg
        aria-hidden="true"
        className="mx-auto h-auto w-full max-w-[1120px]"
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
          {[
            "M698 70V688",
            "M698 452H1080",
            "M844 452V688",
            "M698 542H844",
            "M788 452V542",
            "M788 508H844",
            "M810 508V542",
            "M788 520H810",
          ].map((path) => (
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
          strokeWidth="2.25"
          style={{ strokeDasharray: 1, strokeDashoffset: -1 }}
          vectorEffect="non-scaling-stroke"
        />

        <circle
          className="home-ratio-point"
          cx="800"
          cy="508"
          fill="#4f6b7a"
          r="4"
          style={{ opacity: 0, transform: "scale(0.65)", transformOrigin: "center" }}
        />
      </svg>

      <p
        className="home-ratio-copy ml-auto mt-8 max-w-[780px] text-[34px] font-light leading-[1.02] tracking-[-0.045em] text-neutral-900 sm:text-[46px] md:mt-10 md:text-[58px] lg:text-[66px]"
        style={{ opacity: 0, transform: "translateY(40px)" }}
      >
        Proportion is a principle, not a formula.
      </p>
    </div>
  );
}
