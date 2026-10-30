"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function Hero({ imageUrl = "/images/hero.png" }: { imageUrl?: string }) {
  const { locale, copy } = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const image = imageRef.current;
    const title = titleRef.current;

    if (!hero || !image || !title) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) return;

      gsap.set(title, {
        scale: 1.035,
        y: 14,
        transformOrigin: locale === "ar" ? "right bottom" : "left bottom",
        opacity: 1,
      });

      gsap.timeline({ delay: 0.1 }).to(title, {
        scale: 1,
        y: 0,
        duration: 1.15,
        ease: "power4.out",
      });

      if (!mobile) {
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
      className="relative isolate h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#101414] text-white sm:min-h-[640px]"
    >
      <div ref={imageRef} className="hero-image-reveal absolute inset-0 md:inset-[-2%] md:will-change-transform">
        <Image
          src={imageUrl}
          alt="Mason & Arc studio featured work"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center md:object-[center_48%]"
        />
      </div>

      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25" />

      <div className="absolute inset-x-6 bottom-8 z-20 sm:inset-x-8 sm:bottom-10 md:inset-x-10 lg:inset-x-16 lg:bottom-12">
        <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
          <div className="min-w-0">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/80 sm:mb-7">
              {copy.heroStudioLabel}
            </p>
            <h1
              ref={titleRef}
              className={`${locale === "ar" ? "origin-bottom-right font-[var(--font-arabic)] tracking-[-0.02em]" : "origin-bottom-left font-[var(--font-body)] tracking-[-0.052em]"} max-w-[1000px] text-[clamp(2rem,7.5vw,3.65rem)] font-light leading-[1.075] sm:text-[clamp(3.6rem,5.8vw,6rem)] will-change-transform`}
            >
              <span className="block">{copy.heroBuild}</span>
              <span className="block">{copy.heroExperience}</span>
            </h1>
          </div>
          <div className="hidden flex-col items-end gap-3 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/70 md:flex">
            <span>01 / 04</span>
            <span className="h-[46px] w-px bg-white/55" aria-hidden="true" />
            <span>{locale === "ar" ? "اكتشف" : locale === "it" ? "Scopri" : "Explore"} &darr;</span>
          </div>
        </div>
        <div className="mt-9 flex items-center justify-between border-t border-white/40 pt-4 text-[9px] font-medium uppercase tracking-[0.18em] text-white/75 sm:mt-12">
          <span>© MASON & ARC</span>
          <span className="md:hidden">{locale === "ar" ? "مرّر للاستكشاف" : locale === "it" ? "Scorri per scoprire" : "Scroll to explore"} &darr;</span>
          <span className="hidden md:block">{locale === "ar" ? "تصميم متعدد التخصصات" : locale === "it" ? "Design multidisciplinare" : "Space / Identity / Image / Digital"}</span>
        </div>
      </div>
      <style jsx>{`
        .hero-image-reveal {
          animation: masonHeroReveal 0.7s ease-out both;
        }
        @keyframes masonHeroReveal {
          from { filter: blur(7px); opacity: 0.82; }
          to { filter: blur(0); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-image-reveal { animation: none; }
        }
      `}</style>
    </section>
  );
}
