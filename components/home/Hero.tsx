"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(".hero-line", {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out",
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2070&auto=format&fit=crop"
        alt="Architecture"
        fill
        priority
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-[1600px] px-12 md:px-16 pb-12 md:pb-16">

          <p className="mb-8 text-sm uppercase tracking-[12px] text-white/70">
            MASON
            & ARC
          </p>

          <h1 className="max-w-6xl text-7xl font-extralight leading-[0.88] tracking-[-0.03em] text-white md:text-8xl lg:text-[118px]">
            <span className="block hero-line">
              Designing
            </span>

            <span className="block hero-line">
              Timeless
            </span>

            <span className="block hero-line">
              Architecture
            </span>
          </h1>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 animate-bounce">
        <span className="mb-2 text-xs uppercase tracking-[4px]">
          Scroll
        </span>

        <span className="text-2xl">
          ↓
        </span>
      </div>
    </section>
  );
}