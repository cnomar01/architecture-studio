"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const content = contentRef.current;

    if (!hero || !image || !title || !content) return;

    const ctx = gsap.context(() => {
      gsap.set(title, {
        scale: 1.28,
        y: 18,
        transformOrigin: "left bottom",
        opacity: 1,
      });

      gsap.set(content, { y: 30, opacity: 0 });

      const intro = gsap.timeline({ delay: 0.1 });

      intro.to(title, {
        scale: 1,
        y: 0,
        duration: 1.15,
        ease: "power4.out",
      });

      intro.to(
        content,
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: "power3.out",
        },
        "-=0.35"
      );

      gsap.to(image, {
        scale: 1.045,
        duration: 10,
        ease: "none",
      });
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      data-header-theme="light"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-black text-white"
    >
      <div ref={imageRef} className="absolute inset-[-2%] will-change-transform">
        <Image
          src="/images/hero.png"
          alt="Mason & Arc architecture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />

      <div className="absolute bottom-[190px] left-6 right-6 z-20 sm:bottom-[190px] sm:left-7 sm:right-7 md:bottom-[102px] md:left-8 md:right-8 lg:bottom-[105px] lg:left-10 lg:right-10">
        <h1
          ref={titleRef}
          className="origin-bottom-left font-[var(--font-display)] text-[48px] font-normal uppercase leading-[0.76] tracking-[-0.025em] will-change-transform sm:text-[88px] md:text-[108px] lg:text-[130px] xl:text-[150px] 2xl:text-[170px]"
        >
          <span className="block">Design</span>
          <span className="block">Build</span>
          <span className="block">Experience</span>
        </h1>

        <div ref={contentRef} className="mt-5 max-w-[500px] opacity-0 sm:mt-6 md:mt-7">
          <div className="mb-3 h-px w-[82px] bg-white" />
          <p className="max-w-[520px] text-[11px] font-medium leading-[1.5] text-white sm:text-[16px] md:text-[17px]">
            We design architecture, interiors, and spaces
            that bring ideas to life through thoughtful
            design and precise execution.
          </p>
        </div>
      </div>

      <Link
        href="/app/login"
        aria-label="Open Mason & Arc Studio"
        className="
          group
          absolute
          bottom-6
          left-6
          right-6
          z-30
          block
          rounded-[14px]
          border
          border-white/20
          bg-black/55
          p-3
          text-white
          shadow-2xl
          backdrop-blur-md
          transition-all
          duration-500
          hover:border-white/35
          hover:bg-black/70
          md:block
          md:left-auto
          md:w-[285px]
          md:right-8
          lg:bottom-8
          lg:right-10
          lg:w-[320px]
        "
      >
        <div className="px-3 pt-1 pb-2 text-[9px] font-medium uppercase tracking-[0.28em] text-white/50">
          Workspace
        </div>

        <div className="flex items-center justify-between rounded-[11px] border border-white/15 px-4 py-3 transition-colors duration-300 group-hover:border-white/25">
          <div>
            <div className="text-[14px] font-medium tracking-[-0.01em]">
              Mason & Arc Studio
            </div>
            <div className="mt-1 text-[10px] tracking-[0.08em] text-white/45">
              Design · Build · Manage
            </div>
          </div>

          <span className="ml-4 text-[22px] font-light text-white/65 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </div>
      </Link>
    </section>
  );
}
