"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const title = useRef<HTMLHeadingElement>(null);
  const subtitle = useRef<HTMLParagraphElement>(null);
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(image.current, {
      scale: 1.15,
      duration: 2,
      ease: "power3.out",
    });

    tl.from(
      subtitle.current,
      {
        y: 40,
        opacity: 0,
        duration: 0.8,
      },
      "-=1.4"
    );

    tl.from(
      title.current,
      {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
      },
      "-=0.4"
    );
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      <img
        ref={image}
        src="https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2070&auto=format&fit=crop"
        alt="Architecture"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex h-full items-end px-24 pb-24">
        <div>
          <p
            ref={subtitle}
            className="uppercase tracking-[7px] text-sm text-white"
          >
            Architecture Studio
          </p>

          <h1
            ref={title}
            className="mt-5 text-[110px] leading-[95px] font-light text-white"
          >
            Designing
            <br />
            Timeless
            <br />
            Spaces
          </h1>
        </div>
      </div>
    </section>
  );
}