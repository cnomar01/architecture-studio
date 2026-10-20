"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/components/i18n/LocaleProvider";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ imageUrl = "/images/hero.png" }: { imageUrl?: string }) {
  const { locale, copy } = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const frame = frameRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const cue = cueRef.current;
    const progress = progressRef.current;

    if (!hero || !frame || !image || !content || !cue || !progress) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const introItems = content.querySelectorAll<HTMLElement>("[data-hero-intro]");

      if (reduceMotion) {
        gsap.set([content, cue, introItems], { clearProps: "all", autoAlpha: 1 });
        return;
      }

      gsap.set(content, { autoAlpha: 1 });
      gsap.set(progress, {
        scaleX: 0,
        transformOrigin: locale === "ar" ? "right center" : "left center",
      });

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(introItems, {
          y: mobile ? 28 : 46,
          autoAlpha: 0,
          duration: 1.15,
          stagger: 0.09,
        })
        .from(
          cue,
          {
            y: 14,
            autoAlpha: 0,
            duration: 0.8,
          },
          "-=0.55"
        );

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: mobile ? 0.35 : 0.7,
            invalidateOnRefresh: true,
          },
        })
        .to(
          frame,
          {
            scale: mobile ? 0.955 : 0.925,
            borderRadius: mobile ? 22 : 36,
          },
          0
        )
        .to(
          image,
          {
            scale: mobile ? 1.1 : 1.145,
            yPercent: mobile ? 1.5 : 3,
          },
          0
        )
        .to(
          content,
          {
            yPercent: mobile ? -16 : -24,
            autoAlpha: 0,
          },
          0
        )
        .to(cue, { y: -18, autoAlpha: 0 }, 0)
        .to(progress, { scaleX: 1 }, 0);
    }, hero);

    return () => ctx.revert();
  }, [locale]);

  const scrollLabel = locale === "ar" ? "مرّر" : locale === "it" ? "Scorri" : "Scroll";

  return (
    <section
      ref={heroRef}
      data-header-theme="light"
      className="relative h-[145svh] min-h-[880px] w-full bg-black text-white motion-reduce:h-auto motion-reduce:min-h-0 md:h-[165svh]"
    >
      <div className="sticky top-0 h-[100svh] min-h-[620px] overflow-hidden motion-reduce:relative">
        <div
          ref={frameRef}
          className="absolute inset-0 overflow-hidden bg-neutral-950 will-change-transform"
        >
          <div ref={imageRef} className="absolute inset-[-3%] will-change-transform">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/15" />
        </div>

        <div
          ref={contentRef}
          className={`absolute bottom-[8.5vh] left-6 right-6 z-20 max-w-[980px] opacity-0 will-change-transform sm:left-8 sm:right-8 md:left-12 md:right-12 lg:left-16 lg:right-16 ${
            locale === "ar" ? "text-right" : ""
          }`}
        >
          <p
            data-hero-intro
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
            <span data-hero-intro className="block">
              {copy.heroBuild}
            </span>
            <span data-hero-intro className="block">
              {copy.heroExperience}
            </span>
          </h1>
        </div>

        <div
          ref={cueRef}
          className="absolute bottom-8 right-6 z-20 flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-white/60 sm:right-8 md:bottom-10 md:right-12 lg:right-16"
        >
          <span>{scrollLabel}</span>
          <span className="relative block h-px w-14 overflow-hidden bg-white/25">
            <span ref={progressRef} className="absolute inset-0 block bg-white" />
          </span>
        </div>
      </div>
    </section>
  );
}
