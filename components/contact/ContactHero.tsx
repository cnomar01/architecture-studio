"use client";

import Reveal from "@/components/animations/Reveal";
import Container from "@/components/shared/Container";

export default function ContactHero() {
  return (
    <section className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <Container className="flex min-h-screen flex-col justify-between px-8 py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">

        {/* Top */}
        <div>
          <Reveal>
            <p >
              
            </p>
          </Reveal>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 gap-20 pb-20 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">

          {/* Heading */}
          <div>
            <Reveal>
              <h1
                className="
                  max-w-[900px]
                  text-[72px]
                  font-extralight
                  leading-[0.84]
                  tracking-[-0.06em]
                  sm:text-[96px]
                  md:text-[125px]
                  lg:text-[150px]
                "
              >
                Let’s
                <br />
                Create.
              </h1>
            </Reveal>

            <Reveal>
              <p className="mt-12 max-w-[560px] text-[15px] font-light leading-[1.9] text-neutral-600 md:text-[17px]">
                Have a project in mind? Tell us about it. From architecture
                and interior design to design development and execution,
                we would be glad to hear from you.
              </p>
            </Reveal>
          </div>

          {/* Contact Details */}
          <Reveal>
            <div className="border-t border-neutral-300">

              {/* Email */}
              <a
                href="mailto:Masonandarc@gmail.com"
                className="flex items-center justify-between gap-6 border-b border-neutral-300 py-7 transition-opacity duration-300 hover:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  Email
                </span>

                <span className="text-right text-[13px] font-light">
                  Masonandarc@gmail.com
                </span>
              </a>

              {/* Egypt */}
              <a
                href="tel:+2010044007555"
                className="flex items-center justify-between gap-6 border-b border-neutral-300 py-7 transition-opacity duration-300 hover:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  Egypt
                </span>

                <span className="text-[13px] font-light">
                  +20 1044007555
                </span>
              </a>

              {/* Italy */}
              <a
                href="tel:+393200534654"
                className="flex items-center justify-between gap-6 border-b border-neutral-300 py-7 transition-opacity duration-300 hover:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  Italy
                </span>

                <span className="text-[13px] font-light">
                  +39 320 053 4654
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/masonandarc/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-6 border-b border-neutral-300 py-7 transition-opacity duration-300 hover:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  Instagram
                </span>

                <span className="text-[13px] font-light">
                  @masonandarc ↗
                </span>
              </a>

            </div>
          </Reveal>

        </div>

        {/* Bottom */}
        <Reveal>
          <div className="flex flex-col gap-4 border-t border-neutral-300 pt-6 text-[10px] uppercase tracking-[0.3em] text-neutral-400 md:flex-row md:items-center md:justify-between">
            <span>Start a conversation</span>
            <span>Architecture · Design · Execution</span>
          </div>
        </Reveal>

      </Container>
    </section>
  );
}