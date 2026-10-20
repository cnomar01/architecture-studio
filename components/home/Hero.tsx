"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/components/i18n/LocaleProvider";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ imageUrl = "/images/hero-florence-sunset.png" }: { imageUrl?: string }) {
  const { locale, copy } = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const frame = frameRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const content = contentRef.current;

    if (!hero || !frame || !image || !title || !content) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set([title, content], { clearProps: "all", autoAlpha: 1 });
        return;
      }

      gsap.set(title, {
        scale: 1.28,
        y: 18,
        transformOrigin: locale === "ar" ? "right bottom" : "left bottom",
        opacity: 1,
      });
      gsap.set(content, { y: 30, opacity: 0 });

      gsap
        .timeline({ delay: 0.1 })
        .to(title, {
          scale: 1,
          y: 0,
          duration: 1.15,
          ease: "power4.out",
        })
        .to(
          content,
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
          },
          "-=0.35"
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
            scale: mobile ? 0.965 : 0.94,
            borderRadius: mobile ? 20 : 32,
          },
          0
        )
        .to(
          image,
          {
            scale: mobile ? 1.075 : 1.105,
            yPercent: mobile ? 1 : 2,
          },
          0
        )
        .to(
          title,
          {
            scale: mobile ? 0.98 : 0.94,
            yPercent: mobile ? -5 : -8,
            autoAlpha: 0.16,
          },
          0
        )
        .to(content, { y: mobile ? -12 : -20, autoAlpha: 0 }, 0);
    }, hero);

    return () => ctx.revert();
  }, [locale]);

  return (
    <section
      ref={heroRef}
      data-header-theme="light"
      className="relative h-[150svh] min-h-[900px] w-full bg-black text-white motion-reduce:h-auto motion-reduce:min-h-0 md:h-[170svh]"
    >
      <div className="sticky top-0 h-[100svh] min-h-[680px] overflow-hidden motion-reduce:relative">
        <div
          ref={frameRef}
          className="absolute inset-0 overflow-hidden bg-neutral-950 will-change-transform"
        >
          <div ref={imageRef} className="absolute inset-0 will-change-transform md:inset-[-2%]">
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
        </div>

        <div className="absolute bottom-[92px] left-6 right-6 z-20 sm:bottom-[96px] sm:left-7 sm:right-7 md:bottom-[102px] md:left-8 md:right-8 lg:bottom-[105px] lg:left-10 lg:right-10">
          <h1
            ref={titleRef}
            className={`${
              locale === "ar"
                ? "origin-bottom-right font-[var(--font-arabic)] text-[58px] font-light leading-[.95] sm:text-[88px] md:text-[108px] lg:text-[128px]"
                : "origin-bottom-left font-[var(--font-display)] text-[48px] font-normal uppercase leading-[0.76] tracking-[-0.025em] sm:text-[88px] md:text-[108px] lg:text-[130px] xl:text-[150px] 2xl:text-[170px]"
            } will-change-transform`}
          >
            <span className="block">{copy.heroDesign}</span>
            <span className="block">{copy.heroBuild}</span>
            <span className="block">{copy.heroExperience}</span>
          </h1>

          <div ref={contentRef} className="mt-5 max-w-[500px] opacity-0 sm:mt-6 md:mt-7">
            <div className="mb-3 h-px w-[82px] bg-white" />
            <p className="max-w-[520px] text-[11px] font-medium leading-[1.5] text-white sm:text-[16px] md:text-[17px]">
              {copy.heroIntro}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
