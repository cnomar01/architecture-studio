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
      /*
       * =====================================================
       * INITIAL STATE
       * =====================================================
       */

      gsap.set(title, {
        scale: 1.28,
        y: 18,
        transformOrigin: "left bottom",
        opacity: 1,
      });

      gsap.set(content, {
        y: 30,
        opacity: 0,
      });

      /*
       * =====================================================
       * OPENING ANIMATION
       *
       * Oversized → final
       * Bottom-left anchor
       * Fast / smooth settle
       * =====================================================
       */

      const intro = gsap.timeline({
        delay: 0.1,
      });

      intro.to(title, {
        scale: 1,
        y: 0,
        duration: 1.15,
        ease: "power4.out",
      });

      /*
       * Statement follows the title
       */

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

      /*
       * =====================================================
       * SUBTLE IMAGE MOVEMENT
       * =====================================================
       */

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
      className="
        relative
        h-[100svh]
        min-h-[680px]
        w-full
        overflow-hidden
        bg-black
        text-white
      "
    >
      {/* =====================================================
          HERO IMAGE
      ===================================================== */}

      <div
        ref={imageRef}
        className="
          absolute
          inset-[-2%]
          will-change-transform
        "
      >
        <Image
          src="/images/hero.png"
          alt="Mason & Arc architecture"
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-center
          "
        />
      </div>

      {/* =====================================================
          IMAGE OVERLAY
      ===================================================== */}

      <div className="absolute inset-0 bg-black/10" />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/75
          via-black/10
          to-black/5
        "
      />

      {/* =====================================================
          TITLE
      ===================================================== */}

      <div
        className="
          absolute
          bottom-[92px]
          left-6
          right-6
          z-20

          sm:bottom-[96px]
          sm:left-7
          sm:right-7

          md:bottom-[102px]
          md:left-8
          md:right-8

          lg:bottom-[105px]
          lg:left-10
          lg:right-10
        "
      >
        <h1
          ref={titleRef}
          className="
            origin-bottom-left
            font-[var(--font-display)]
            text-[72px]
            font-normal
            uppercase
            leading-[0.76]
            tracking-[-0.025em]
            will-change-transform

            sm:text-[88px]

            md:text-[108px]

            lg:text-[130px]

            xl:text-[150px]

            2xl:text-[170px]
          "
        >
          <span className="block">Design</span>
          <span className="block">Build</span>
          <span className="block">Experience</span>
        </h1>

        {/* =================================================
            STATEMENT
        ===================================================== */}

        <div
          ref={contentRef}
          className="
            mt-5
            max-w-[500px]
            opacity-0

            sm:mt-6
            md:mt-7
          "
        >
          <div
            className="
              mb-3
              h-px
              w-[82px]
              bg-white
            "
          />

          <p
            className="
              max-w-[520px]
              text-[11px]
              font-medium
              leading-[1.5]
              text-white

              sm:text-[16px]

              md:text-[17px]
            "
          >
            We design architecture, interiors, and spaces
            that bring ideas to life through thoughtful
            design and precise execution.
          </p>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE INDICATOR
      ===================================================== */}

      <div
        className="
          absolute
          right-5
          top-1/2
          z-20
          flex
          -translate-y-1/2
          flex-col
          items-center
          gap-[12px]

          md:right-7

          lg:right-8
        "
      >
        <span
          className="
            mb-1
            text-[8px]
            tracking-[0.12em]
            text-white
          "
        >
          01
        </span>

        <span className="h-[7px] w-[7px] bg-white" />

        <span className="h-[7px] w-[7px] border border-white/80" />

        <span className="h-[7px] w-[7px] border border-white/80" />

        <span className="h-[7px] w-[7px] border border-white/80" />

        <span className="h-[7px] w-[7px] border border-white/80" />

        <span className="h-[7px] w-[7px] border border-white/80" />
      </div>

      {/* =====================================================
          BOTTOM CONTROLS
      ===================================================== */}

      <div
        className="
          absolute
          bottom-6
          left-6
          right-6
          z-20
          flex
          items-center
          justify-between

          md:left-8
          md:right-8
        "
      >
        {/* SCROLL */}

        <div
          className="
            flex
            items-center
            gap-3
            text-[8px]
            font-medium
            uppercase
            tracking-[0.18em]
          "
        >
          <span>Scroll</span>

          <span className="h-px w-12 bg-white/80" />

          <span>01</span>
        </div>

        {/* EXPLORE */}

        <Link
          href="/projects"
          className="
            flex
            items-center
            gap-3
            text-[8px]
            font-medium
            uppercase
            tracking-[0.18em]
            transition-opacity
            duration-300
            hover:opacity-60
          "
        >
          <span>Explore Projects</span>

          <span className="text-sm">
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}