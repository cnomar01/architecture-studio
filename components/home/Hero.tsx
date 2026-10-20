"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/components/i18n/LocaleProvider";

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ imageUrl = "/images/hero-florence-sunset.png" }: { imageUrl?: string }) {
  const { locale, copy } = useLocale();
  const heroRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const imageRevealRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const hero = heroRef.current;
    const frame = frameRef.current;
    const image = imageRef.current;
    const imageReveal = imageRevealRef.current;
    const title = titleRef.current;
    const veil = veilRef.current;
    const accent = accentRef.current;

    if (!hero || !frame || !image || !imageReveal || !title || !veil || !accent) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = title.querySelectorAll<HTMLElement>("[data-hero-line-inner]");

    if (reduceMotion) {
      gsap.set(veil, { autoAlpha: 0 });
      gsap.set([frame, image, imageReveal, title, lines, accent], { clearProps: "all" });
      return;
    }

    gsap.set(veil, { autoAlpha: 1, scaleY: 1, transformOrigin: "bottom" });
    gsap.set(lines, { yPercent: 118 });
    gsap.set(accent, { scaleX: 0, transformOrigin: "left" });

    gsap
      .timeline({ defaults: { ease: "power4.out" } })
      .to(veil, { scaleY: 0, duration: 1.25, ease: "power4.inOut" }, 0)
      .fromTo(imageReveal, { scale: 1.12 }, { scale: 1, duration: 1.8 }, 0.08)
      .to(lines, { yPercent: 0, duration: 1.15, stagger: 0.12 }, 0.42)
      .to(accent, { scaleX: 1, duration: 0.9 }, 0.9);

    const media = gsap.matchMedia();
    media.add(
      {
        mobile: "(max-width: 767px)",
        desktop: "(min-width: 768px)",
      },
      (context) => {
        const mobile = context.conditions?.mobile;

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom bottom",
              scrub: mobile ? 0.35 : 0.8,
              invalidateOnRefresh: true,
            },
          })
          .to(frame, { scale: mobile ? 0.965 : 0.935, borderRadius: mobile ? 18 : 28 }, 0)
          .to(image, { scale: mobile ? 1.09 : 1.13, yPercent: mobile ? 1.5 : 2.5 }, 0)
          .to(title, { yPercent: mobile ? -6 : -9, autoAlpha: 0.08 }, 0)
          .to(accent, { scaleX: mobile ? 0.7 : 0.45, autoAlpha: 0.45 }, 0);
      }
    );

    return () => media.revert();
  }, { scope: heroRef, dependencies: [locale], revertOnUpdate: true });

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
            <div ref={imageRevealRef} className="absolute inset-0 will-change-transform">
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
          </div>

          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />
          <div
            ref={veilRef}
            aria-hidden="true"
            className="absolute inset-0 z-10 bg-[var(--mason-black)] opacity-0 will-change-transform"
          />
        </div>

        <div className="absolute bottom-[92px] left-6 right-6 z-20 sm:bottom-[96px] sm:left-7 sm:right-7 md:bottom-[102px] md:left-8 md:right-8 lg:bottom-[105px] lg:left-10 lg:right-10">
          <h1
            ref={titleRef}
            className="origin-bottom-left max-w-[1100px] text-[clamp(42px,6.5vw,96px)] font-medium leading-[0.98] tracking-[-0.025em] will-change-transform"
          >
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-line-inner className="block whitespace-nowrap will-change-transform">
                {copy.heroBuild}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-line-inner className="block whitespace-nowrap will-change-transform">
                {copy.heroExperience}
              </span>
            </span>
          </h1>
          <span
            ref={accentRef}
            aria-hidden="true"
            className="mt-6 block h-[3px] w-20 bg-[var(--mason-blue)] will-change-transform sm:w-24"
          />
        </div>
      </div>
    </section>
  );
}
