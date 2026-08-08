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
      duration: 1.1,
      stagger: 0.15,
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
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Content */}
      <div className="relative z-10 h-full">
        <div
          className="flex h-full w-full flex-col"
          style={{
            paddingLeft: "48px",
            paddingRight: "48px",
          }}
        >
          <div className="flex flex-1 items-end">
            <div className="w-full translate-y-[-80px]">

              {/* Title */}
              <h1
                className="
                  max-w-[560px]
                  text-white
                  font-extralight
                  leading-[0.92]
                  tracking-[-0.04em]
                  text-[50px]
                  sm:text-[30px]
                  lg:text-[60px]
                "
              >
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

              {/* White Frame Line */}
              <div className="mt-[180px] h-px w-full bg-white/70" />

              {/* Scroll BELOW the line */}
              <div className="mt-[35px] flex items-center gap-4">

                <div className="flex h-[30px] w-[15px] items-start justify-center rounded-full border border-white/60">
                  <div className="mt-[6px] h-[6px] w-[1px] animate-bounce bg-white" />
                </div>

                <span
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.8em]
                    text-white
                  "
                >
                  Scroll to Explore
                </span>

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}