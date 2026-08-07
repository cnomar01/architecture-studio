"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    gsap.from(".hero-line", {
      y: 80,
      opacity: 0,
      duration: 1,
      stagger: 0.18,
      ease: "power4.out",
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Background */}
      <Image
        src="/images/hero.jpg"
        alt="MASON & ARC"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 sm:px-8 md:px-12 lg:px-16 lg:pb-20">

          {/* Brand */}
          

          {/* Heading */}
          <h1 className="max-w-5xl font-extralight leading-[0.88] tracking-[-0.04em] text-white text-5xl sm:text-6xl md:text-7xl lg:text-[110px]">
            <span className="hero-line block">
              Designing
            </span>

            <span className="hero-line block">
              Timeless
            </span>

            <span className="hero-line block">
              Architecture
            </span>
          </h1>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center text-white/80 animate-bounce">

          <span className="mb-2 text-[10px] uppercase tracking-[0.35em]">
            Scroll
          </span>

          <span className="text-xl">
            ↓
          </span>

        </div>
      </div>
    </section>
  );
}