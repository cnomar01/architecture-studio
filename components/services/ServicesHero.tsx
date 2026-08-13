"use client";

import Reveal from "@/components/animations/Reveal";
import Container from "@/components/shared/Container";

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
  return (
    <section className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <Container className="px-8 py-32 md:px-12 lg:px-16 lg:py-40">

        {/* Header */}
        <div className="flex min-h-[70vh] flex-col justify-center">

          <Reveal>
            <p className="mb-8 text-[10px] font-light uppercase tracking-[0.45em] text-neutral-500">
              MASON & ARC
            </p>
          </Reveal>

          <Reveal>
            <h1
              className="
                max-w-[1100px]
                text-[72px]
                font-extralight
                leading-[0.84]
                tracking-[-0.06em]
                sm:text-[100px]
                md:text-[130px]
                lg:text-[155px]
              "
            >
              Design.
              <br />
              Build.
              <br />
              Experience.
            </h1>
          </Reveal>

          <Reveal>
            <p
              className="
                mt-14
                max-w-[620px]
                text-[15px]
                font-light
                leading-[1.9]
                text-neutral-600
                md:text-[17px]
              "
            >
              We approach architecture as a complete process — from the first
              idea and design development to the final built space.
            </p>
          </Reveal>

        </div>

        {/* Services */}
        <div className="border-t border-neutral-300">

          {services.map((service) => (
            <Reveal key={service.number}>
              <div className="group border-b border-neutral-300 py-9 md:py-12">

                <div className="grid grid-cols-[60px_1fr_auto] items-start gap-6 md:grid-cols-[100px_1fr_2fr_auto] md:gap-10">

                  <span className="pt-1 text-[10px] tracking-[0.25em] text-neutral-400">
                    {service.number}
                  </span>

                  <h2
                    className="
                      text-[28px]
                      font-extralight
                      tracking-[-0.03em]
                      transition-transform
                      duration-500
                      group-hover:translate-x-2
                      md:text-[42px]
                    "
                  >
                    {service.title}
                  </h2>

                  <p className="max-w-[420px] text-[14px] font-light leading-[1.8] text-neutral-500 md:text-[15px]">
                    {service.description}
                  </p>

                  <span className="pt-1 text-lg font-light text-neutral-400 transition-transform duration-500 group-hover:translate-x-1">
                    ↗
                  </span>

                </div>

              </div>
            </Reveal>
          ))}

        </div>

        {/* Closing statement */}
        <Reveal>
          <div className="flex justify-end pt-24">
            <p className="max-w-[520px] text-[18px] font-light leading-[1.8] tracking-[-0.01em] text-neutral-600 md:text-[21px]">
              From concept to completion, we bring design and execution
              together to create spaces that are considered, precise, and
              built to last.
            </p>
          </div>
        </Reveal>

      </Container>
    </section>
  );
}