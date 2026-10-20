"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
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
    image: "/images/hero-florence-sunset.png",
    imageAlt: "Mason & Arc architectural design",
    imagePosition: "center",
  },
  {
    number: "02",
    title: "Interior Design",
    description:
      "Interior spaces developed through material, proportion, light, and a clear relationship between architecture and experience.",
    image: "/images/hero.png",
    imageAlt: "Mason & Arc spatial and material design",
    imagePosition: "center",
  },
  {
    number: "03",
    title: "Design Development",
    description:
      "From concept to detailed design, we develop every element with precision, clarity, and attention to detail.",
    image: "/images/hero-florence-sunset.png",
    imageAlt: "Architecture developed from concept to detail",
    imagePosition: "68% center",
  },
  {
    number: "04",
    title: "Execution",
    description:
      "We carry the design into reality through coordinated execution, quality control, and attention to every built detail.",
    image: "/images/projects/city-edge/city-edge-exterior-wip.jpeg",
    imageAlt: "Mason & Arc project execution in progress",
    imagePosition: "center 42%",
  },
];

export default function ServicesHero() {
  const mainRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const servicesIntroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const hero = heroRef.current;
    const statement = statementRef.current;
    const aside = asideRef.current;
    const servicesSection = servicesRef.current;
    const servicesIntro = servicesIntroRef.current;

    if (!hero || !statement || !aside || !servicesSection || !servicesIntro) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const lines = statement.querySelectorAll<HTMLElement>("[data-services-line-inner]");
      const introItems = hero.querySelectorAll<HTMLElement>("[data-services-intro]");
      const rows = servicesSection.querySelectorAll<HTMLElement>(".service-row");
      const accents = mainRef.current?.querySelectorAll<HTMLElement>("[data-cinematic-accent]");

      if (reduceMotion) {
        gsap.set([lines, introItems, rows, accents], { clearProps: "all", autoAlpha: 1 });
        rows.forEach((row) => {
          const media = row.querySelector<HTMLElement>("[data-service-media]");
          const image = row.querySelector<HTMLElement>("[data-service-image]");
          if (media) gsap.set(media, { clearProps: "all", clipPath: "inset(0% 0% 0% 0%)" });
          if (image) gsap.set(image, { clearProps: "all" });
        });
        return;
      }

      gsap.set(lines, { yPercent: 112 });
      gsap.set(accents || [], { scaleX: 0, transformOrigin: "left" });

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(lines, { yPercent: 0, duration: 1.2, stagger: 0.11 })
        .from(
          introItems,
          {
            y: mobile ? 20 : 34,
            autoAlpha: 0,
            duration: 0.95,
            stagger: 0.08,
          },
          "-=0.74"
        )
        .to(accents || [], { scaleX: 1, duration: 0.85 }, "-=0.65");

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
        .to(lines[0], { xPercent: mobile ? -2 : -5, yPercent: -10, autoAlpha: 0.14 }, 0)
        .to(lines[1], { xPercent: mobile ? 2 : 4, yPercent: -6, autoAlpha: 0.35 }, 0)
        .to(lines[2], { yPercent: -2 }, 0)
        .to(statement, { yPercent: mobile ? -4 : -7 }, 0)
        .to(aside, { yPercent: mobile ? -10 : -16, autoAlpha: 0 }, 0);

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
        const media = row.querySelector<HTMLElement>("[data-service-media]");
        const image = row.querySelector<HTMLElement>("[data-service-image]");

        if (!content || !media || !image) return;

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
          media,
          { clipPath: mobile ? "inset(9% 0% 9% 0%)" : "inset(15% 0% 15% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              end: mobile ? "top 48%" : "center 58%",
              scrub: mobile ? 0.3 : 0.75,
            },
          }
        );

        gsap.fromTo(
          image,
          { scale: mobile ? 1.08 : 1.14, yPercent: mobile ? 0 : -3 },
          {
            scale: 1,
            yPercent: mobile ? -1 : 2,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: mobile ? 0.35 : 0.85,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, { scope: mainRef });

  return (
    <main ref={mainRef} className="bg-[var(--mason-off-white)] text-[var(--mason-black)]">
      <section
        ref={heroRef}
        className="relative h-[160svh] min-h-[980px] overflow-clip motion-reduce:h-auto motion-reduce:min-h-0 md:h-[185svh]"
      >
        <div className="sticky top-0 h-[100svh] min-h-[700px] motion-reduce:relative">
          <Container className="!max-w-none h-full px-5 pb-24 pt-32 sm:px-8 md:px-10 lg:px-14 lg:pt-36 xl:px-16">
            <div className="grid min-h-[calc(100vh-8rem)] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-16 xl:grid-cols-[1.1fr_0.9fr] xl:gap-x-24">
              <div
                ref={statementRef}
                className="flex h-full flex-col justify-end pb-10 will-change-transform lg:pb-20"
              >
                <h1 className="max-w-[850px] text-[clamp(54px,16.4vw,72px)] font-medium leading-[0.88] tracking-[-0.025em] sm:text-[96px] md:text-[116px] lg:text-[132px] xl:text-[148px]">
                  {["Design.", "Build.", "Experience."].map((line) => (
                    <span key={line} data-services-line className="block overflow-hidden pb-[0.04em]">
                      <span data-services-line-inner className="block will-change-transform">
                        {line}
                      </span>
                    </span>
                  ))}
                </h1>

                <span
                  data-cinematic-accent
                  aria-hidden="true"
                  className="mt-8 block h-[3px] w-20 bg-[var(--mason-blue)] will-change-transform"
                />

                <p
                  data-services-intro
                  className="mt-12 max-w-[560px] text-[14px] font-light leading-[1.85] text-neutral-600 sm:text-[15px] md:text-[16px] lg:mt-14"
                >
                  We approach architecture as a complete process — from the first idea and design
                  development to the final built space.
                </p>
              </div>

              <div
                ref={asideRef}
                className="flex items-end pb-10 will-change-transform lg:pb-20"
              >
                <div className="max-w-[720px]">
                  <p
                    data-services-intro
                    className="max-w-[680px] text-[18px] font-light leading-[1.6] tracking-[-0.01em] text-neutral-600 sm:text-[20px] md:text-[22px]"
                  >
                    From concept to completion, we bring design and execution together to create
                    spaces that are considered, precise, and built to last.
                  </p>

                  <div data-services-intro className="mt-12 flex items-center gap-4">
                    <span className="flex h-9 w-5 items-start justify-center rounded-full border border-neutral-400">
                      <span className="mt-2 h-2 w-px bg-neutral-800" />
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-500">
                      Scroll to explore
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </section>

      <section ref={servicesRef} className="border-t border-neutral-300 bg-[var(--mason-off-white)]">
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
                className="service-row group border-b border-neutral-300 py-8 sm:py-10 md:py-12 lg:py-14"
              >
                <div
                  data-service-content
                  className="grid grid-cols-[35px_1fr] gap-x-5 will-change-transform md:grid-cols-[55px_minmax(210px,0.75fr)_minmax(360px,1.25fr)_30px] md:gap-x-8 lg:gap-x-12"
                >
                  <span className="pt-2 text-[8px] tracking-[0.25em] text-neutral-400">
                    {service.number}
                  </span>

                  <div>
                    <h3 className="text-[32px] font-medium leading-[1] tracking-[-0.025em] transition-transform duration-500 group-hover:translate-x-3 sm:text-[40px] md:text-[44px] lg:text-[50px]">
                      {service.title}
                    </h3>

                    <p className="mt-5 max-w-[520px] text-[13px] font-normal leading-[1.75] text-neutral-500 md:text-[14px] lg:text-[15px]">
                      {service.description}
                    </p>
                  </div>

                  <figure
                    data-service-media
                    className="relative col-start-2 mt-8 aspect-[16/10] min-h-[250px] overflow-hidden bg-neutral-200 will-change-[clip-path] md:col-start-3 md:row-start-1 md:mt-0 md:aspect-[4/3] md:min-h-[340px]"
                  >
                    <div data-service-image className="absolute inset-[-5%] will-change-transform">
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        fill
                        unoptimized
                        sizes="(max-width: 767px) 85vw, 50vw"
                        className="object-cover"
                        style={{ objectPosition: service.imagePosition }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                    <figcaption className="absolute bottom-4 left-4 text-[8px] font-medium uppercase tracking-[0.18em] text-white/80 md:bottom-5 md:left-5">
                      {service.number} / {service.title}
                    </figcaption>
                  </figure>

                  <span className="hidden pt-1 text-[16px] font-normal text-neutral-400 transition-transform duration-500 group-hover:translate-x-2 md:block">
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
