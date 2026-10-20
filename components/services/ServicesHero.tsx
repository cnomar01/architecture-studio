"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Container from "@/components/shared/Container";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Architecture",
    description:
      "Architectural concepts and complete design solutions shaped around context, function, and timeless form.",
  },
  {
    number: "02",
    title: "Interior Design",
    description:
      "Interior spaces developed through material, proportion, light, and a clear relationship between architecture and experience.",
  },
  {
    number: "03",
    title: "Design Development",
    description:
      "From concept to detailed design, we develop every element with precision, clarity, and attention to detail.",
  },
  {
    number: "04",
    title: "Execution",
    description:
      "We carry the design into reality through coordinated execution, quality control, and attention to every built detail.",
  },
];

export default function ServicesHero() {
  const heroRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  const heroProgressRef = useRef<HTMLSpanElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const servicesIntroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const statement = statementRef.current;
    const aside = asideRef.current;
    const heroProgress = heroProgressRef.current;
    const servicesSection = servicesRef.current;
    const servicesIntro = servicesIntroRef.current;

    if (!hero || !statement || !aside || !heroProgress || !servicesSection || !servicesIntro) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const lines = statement.querySelectorAll<HTMLElement>("[data-services-line]");
      const introItems = hero.querySelectorAll<HTMLElement>("[data-services-intro]");
      const rows = servicesSection.querySelectorAll<HTMLElement>(".service-row");

      if (reduceMotion) {
        gsap.set([lines, introItems, rows, heroProgress], { clearProps: "all", autoAlpha: 1 });
        return;
      }

      gsap.set(heroProgress, { scaleX: 0, transformOrigin: "left center" });

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(lines, {
          yPercent: 112,
          duration: 1.25,
          stagger: 0.1,
        })
        .from(
          introItems,
          {
            y: mobile ? 20 : 34,
            autoAlpha: 0,
            duration: 0.95,
            stagger: 0.08,
          },
          "-=0.72"
        );

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom bottom",
            scrub: mobile ? 0.35 : 0.75,
            invalidateOnRefresh: true,
          },
        })
        .to(lines[0], { xPercent: mobile ? -4 : -8, yPercent: -16, autoAlpha: 0.16 }, 0)
        .to(lines[1], { xPercent: mobile ? 3 : 7, yPercent: -9, autoAlpha: 0.38 }, 0)
        .to(lines[2], { xPercent: mobile ? -1 : -3, yPercent: -3 }, 0)
        .to(statement, { yPercent: mobile ? -7 : -11 }, 0)
        .to(aside, { yPercent: mobile ? -14 : -24, autoAlpha: 0 }, 0)
        .to(heroProgress, { scaleX: 1 }, 0);

      gsap.fromTo(
        servicesIntro.children,
        { y: mobile ? 34 : 70, autoAlpha: 0.12 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: servicesIntro,
            start: "top 88%",
            end: "top 48%",
            scrub: mobile ? 0.3 : 0.7,
          },
        }
      );

      rows.forEach((row) => {
        const content = row.querySelector<HTMLElement>("[data-service-content]");
        const rule = row.querySelector<HTMLElement>("[data-service-rule]");

        if (!content || !rule) return;

        gsap.fromTo(
          content,
          { y: mobile ? 28 : 52, autoAlpha: mobile ? 0.45 : 0.18 },
          {
            y: 0,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              end: "top 48%",
              scrub: mobile ? 0.25 : 0.65,
            },
          }
        );

        gsap.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              end: "top 54%",
              scrub: mobile ? 0.25 : 0.65,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#f8f7f4] text-neutral-900">
      <section
        ref={heroRef}
        className="relative h-[150svh] min-h-[980px] overflow-clip motion-reduce:h-auto motion-reduce:min-h-0 md:h-[185svh]"
      >
        <div className="sticky top-0 h-[100svh] min-h-[700px] motion-reduce:relative">
          <Container className="!max-w-none h-full px-5 pb-12 pt-28 sm:px-8 md:px-10 md:pb-16 lg:px-14 lg:pb-20 lg:pt-32 xl:px-16">
            <div className="grid h-full grid-cols-1 gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-x-16 xl:grid-cols-[1.12fr_0.88fr] xl:gap-x-24">
              <div ref={statementRef} className="flex min-w-0 flex-col justify-end will-change-transform">
                <p
                  data-services-intro
                  className="mb-7 text-[9px] uppercase tracking-[0.35em] text-neutral-400 md:mb-9"
                >
                  Mason &amp; Arc — Services
                </p>

                <h1 className="max-w-[900px] text-[64px] font-extralight leading-[0.82] tracking-[-0.065em] sm:text-[88px] md:text-[112px] lg:text-[126px] xl:text-[150px]">
                  {["Design.", "Build.", "Experience."].map((line) => (
                    <span key={line} className="block overflow-hidden pb-[0.08em]">
                      <span data-services-line className="block will-change-transform">
                        {line}
                      </span>
                    </span>
                  ))}
                </h1>

                <p
                  data-services-intro
                  className="mt-8 max-w-[560px] text-[14px] font-light leading-[1.85] text-neutral-600 sm:text-[15px] md:mt-10 md:text-[16px]"
                >
                  We approach architecture as a complete process — from the first idea and design
                  development to the final built space.
                </p>
              </div>

              <div
                ref={asideRef}
                className="flex flex-col justify-end pb-1 will-change-transform lg:pb-2"
              >
                <p
                  data-services-intro
                  className="max-w-[680px] text-[18px] font-light leading-[1.6] tracking-[-0.01em] text-neutral-600 sm:text-[20px] md:text-[22px]"
                >
                  From concept to completion, we bring design and execution together to create
                  spaces that are considered, precise, and built to last.
                </p>

                <div data-services-intro className="mt-10 flex items-center gap-4 md:mt-12">
                  <span className="flex h-9 w-5 items-start justify-center rounded-full border border-neutral-400">
                    <span className="mt-2 h-2 w-px bg-neutral-800" />
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-500">
                    Scroll to explore
                  </span>
                </div>
              </div>
            </div>

            <span className="absolute bottom-0 left-5 right-5 h-px overflow-hidden bg-neutral-300 sm:left-8 sm:right-8 md:left-10 md:right-10 lg:left-14 lg:right-14 xl:left-16 xl:right-16">
              <span ref={heroProgressRef} className="absolute inset-0 block bg-neutral-900" />
            </span>
          </Container>
        </div>
      </section>

      <section ref={servicesRef} className="border-t border-neutral-300 bg-[#f8f7f4]">
        <Container className="!max-w-none px-5 py-24 sm:px-8 md:px-10 md:py-32 lg:px-14 lg:py-40 xl:px-16">
          <div
            ref={servicesIntroRef}
            className="mb-20 grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-x-20"
          >
            <div>
              <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-400">
                01 — Services
              </span>
            </div>

            <h2 className="max-w-[900px] text-[42px] font-extralight leading-[0.95] tracking-[-0.045em] sm:text-[55px] md:text-[68px] lg:text-[78px]">
              Architecture,
              <br />
              interior,
              <br />
              design and execution.
            </h2>
          </div>

          <div className="border-t border-neutral-300">
            {services.map((service) => (
              <div
                key={service.number}
                className="service-row group relative overflow-hidden border-b border-neutral-300 py-8 sm:py-10 md:py-12 lg:py-14"
              >
                <span
                  data-service-rule
                  className="absolute left-0 right-0 top-0 h-px origin-left bg-neutral-900"
                />

                <div
                  data-service-content
                  className="grid grid-cols-[35px_1fr] gap-x-5 will-change-transform md:grid-cols-[55px_0.8fr_1.2fr_30px] md:gap-x-8 lg:gap-x-12"
                >
                  <span className="pt-2 text-[8px] tracking-[0.25em] text-neutral-400">
                    {service.number}
                  </span>

                  <h3 className="text-[32px] font-extralight leading-[0.95] tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-3 sm:text-[40px] md:text-[44px] lg:text-[50px]">
                    {service.title}
                  </h3>

                  <p className="col-start-2 mt-5 max-w-[650px] text-[13px] font-light leading-[1.8] text-neutral-500 md:col-start-3 md:mt-0 md:text-[14px] lg:text-[15px]">
                    {service.description}
                  </p>

                  <span className="hidden pt-1 text-[16px] font-light text-neutral-400 transition-transform duration-500 group-hover:translate-x-2 md:block">
                    ↗
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-300">
        <Container className="!max-w-none px-5 py-24 sm:px-8 md:px-10 md:py-32 lg:px-14 lg:py-40 xl:px-16">
          <div className="flex items-end justify-between gap-10">
            <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-400">
              02 — Experience
            </span>
            <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-400">Next</span>
          </div>
        </Container>
      </section>
    </main>
  );
}
