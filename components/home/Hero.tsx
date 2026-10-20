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

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const frame = frameRef.current;
    const image = imageRef.current;
    const title = titleRef.current;

    if (!hero || !frame || !image || !title) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(title, { clearProps: "all", autoAlpha: 1 });
        return;
      }

      gsap.set(title, {
        scale: 1.28,
        y: 18,
        transformOrigin: "left bottom",
        opacity: 1,
      });

      gsap.to(title, {
        scale: 1,
        y: 0,
        duration: 1.15,
        delay: 0.1,
        ease: "power4.out",
      });

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
        );
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
            className="origin-bottom-left font-[var(--font-display)] text-[clamp(36px,10vw,150px)] font-normal uppercase leading-[0.78] tracking-[-0.025em] will-change-transform"
          >
            <span className="block whitespace-nowrap">{copy.heroBuild}</span>
            <span className="block whitespace-nowrap">{copy.heroExperience}</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
