"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function Hero({ imageUrl = "/images/hero-florence-sunset.png" }: { imageUrl?: string }) {
  const { locale, copy } = useLocale();
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

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(content, { y: 0, opacity: 1 });
        return;
      }

      gsap.set(title, {
        scale: 1.035,
        y: 14,
        transformOrigin: locale === "ar" ? "right bottom" : "left bottom",
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

      if (!reduceMotion && !mobile) {
        gsap.to(image, {
          scale: 1.035,
          duration: 10,
          ease: "none",
        });
      }
    }, hero);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section
      ref={heroRef}
      data-header-theme="light"
      className="relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-black text-white"
    >
      <div ref={imageRef} className="absolute inset-0 md:inset-[-2%] md:will-change-transform">
        <Image
          src={imageUrl}
          alt="Mason & Arc architecture"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />

      <div className="absolute bottom-[80px] left-6 right-6 z-20 sm:bottom-[88px] sm:left-7 sm:right-7 md:bottom-[96px] md:left-8 md:right-8 lg:bottom-[100px] lg:left-10 lg:right-10">
        <h1
          ref={titleRef}
          className={`${locale === "ar" ? "origin-bottom-right font-[var(--font-arabic)] text-[clamp(2.25rem,7.8vw,3rem)] font-light leading-[1.12] tracking-[-0.015em] sm:text-[clamp(3rem,5.25vw,5.5rem)]" : "origin-bottom-left font-[var(--font-display)] text-[clamp(2.25rem,7.8vw,3rem)] font-normal leading-[1.02] tracking-[-0.035em] sm:text-[clamp(3rem,5.25vw,5.5rem)]"} max-w-[980px] will-change-transform`}
        >
          <span className="block">{copy.heroBuild}</span>
          <span className="block">{copy.heroExperience}</span>
        </h1>

        <div ref={contentRef} className="mt-5 max-w-[460px] opacity-0 sm:mt-6">
          <div className="mb-3 h-px w-[72px] bg-white/80" />
          <p className="text-[13px] font-normal leading-[1.55] text-white/95 sm:text-[14px] md:text-[15px]">
            {copy.heroIntro}
          </p>
        </div>
      </div>

    </section>
  );
}
