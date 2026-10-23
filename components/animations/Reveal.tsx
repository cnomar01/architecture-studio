"use client";

import { ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  y?: number;
  delay?: number;
};

export default function Reveal({
  children,
  y = 60,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      y,
      opacity: 0,
      duration: 1,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        once: true,
      },
    });
  }, []);

  return <div ref={ref}>{children}</div>;
}