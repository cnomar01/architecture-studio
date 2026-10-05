"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function Hero({ imageUrl = "/images/hero.png" }: { imageUrl?: string }) {
  const { locale, copy } = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    if (!hero || !image || !content) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      gsap.set(content, { y: 24, opacity: 0 });

      gsap.to(content, {
        y: 0,
        opacity: 1,
        duration: 1.05,
        delay: 0.15,
        ease: "power3.out",
      });

      if (!reduceMotion && !mobile) {
        gsap.fromTo(
          image,
          { scale: 1 },
          {
            scale: 1.03,
            duration: 11,
            ease: "none",
          }
        );
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
      <div ref={imageRef} className="absolute inset-0 md:inset-[-1.5%] md:will-change-transform">
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/10" />

      <div
        ref={contentRef}
        className={`absolute bottom-[7vh] z-20 max-w-[980px] opacity-0 ${
          locale === "ar"
            ? "left-6 right-6 text-right sm:left-8 sm:right-8 md:left-12 md:right-12 lg:left-16 lg:right-16"
            : "left-6 right-6 sm:left-8 sm:right-8 md:left-12 md:right-12 lg:left-16 lg:right-16"
        }`}
      >
        <p
          className={`${
            locale === "ar" ? "font-[var(--font-arabic)]" : "font-[var(--font-display)]"
          } text-[13px] font-medium uppercase tracking-[0.24em] text-white/90 sm:text-[14px] md:text-[15px]`}
        >
          {copy.heroDesign}
        </p>

        <h1
          className={`${
            locale === "ar" ? "font-[var(--font-arabic)]" : "font-[var(--font-display)]"
          } mt-5 max-w-[900px] text-[42px] font-normal leading-[0.98] tracking-[-0.035em] sm:text-[58px] md:text-[72px] lg:text-[84px] xl:text-[96px]`}
        >
          <span className="block">{copy.heroBuild}</span>
          <span className="block">{copy.heroExperience}</span>
        </h1>
      </div>
    </section>
  );
}
