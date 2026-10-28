import type { Metadata } from "next";
import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Architecture",
    text: "Our architectural work focuses on creating buildings that respond to their surroundings while establishing a clear identity of their own. Form, proportion, structure, material, light, and landscape are considered together to create architecture that is both expressive and purposeful.",
  },
  {
    number: "02",
    title: "Interior Design",
    text: "Interior design is approached as an extension of architecture. Rather than treating interiors as isolated spaces, we develop environments where circulation, materials, lighting, furniture, textures, and architectural elements work together to create a coherent experience.",
  },
  {
    number: "03",
    title: "Design Development",
    text: "From concept to detailed design, we develop every element with precision, clarity, and careful attention to material, proportion, and constructability.",
  },
  {
    number: "04",
    title: "Design & Delivery Advisory",
    text: "Where required, we advise on the selection and coordination of specialist delivery partners. Execution supervision is available selectively when requested by the client.",
  },
];

export const metadata: Metadata = {
  title: "About | Mason & Arc",
  description: "About Mason & Arc — an architectural design studio for projects in Egypt and internationally.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="bg-white text-black">

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="min-h-screen px-6 pb-24 pt-36 md:px-10 md:pt-44">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/50">
              About
            </p>
          </div>

          <div className="lg:col-span-9">
            <h1
              className="
                max-w-[1200px]
                font-[var(--font-display)]
                text-[48px]
                uppercase
                leading-[0.82]
                tracking-[-0.025em]

                sm:text-[60px]
                md:text-[120px]
                lg:text-[150px]
                xl:text-[175px]
              "
            >
              Designing
              <br />
              spaces that
              <br />
              last.
            </h1>
          </div>

        </div>
      </section>


      {/* =====================================================
          HISTORY
      ===================================================== */}

      <section className="border-t border-black/15 px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <div
              className="
                font-[var(--font-display)]
                text-[60px]
                leading-none
                tracking-[-0.03em]
                md:text-[100px]
              "
            >
              2015
            </div>

            <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-black/50">
              Professional practice in Italy
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-5">

            <p
              className="
                text-[20px]
                leading-[1.2]
                tracking-[-0.02em]
                sm:text-[24px]
                md:text-[34px]
                lg:text-[42px]
              "
            >
              Beginning in 2015, the founder of Mason & Arc developed his
              professional experience in Italy, contributing to and supervising
              the delivery of major projects across different scales and contexts.
            </p>

            <p
              className="
                mt-10
                max-w-[720px]
                text-[14px]
                leading-[1.6]
                text-black/65
                md:text-[16px]
              "
            >
              This experience shaped a rigorous understanding of architecture,
              detailed coordination, material quality, and the relationship
              between design intent and the completed space.
            </p>

          </div>
        </div>
      </section>


      {/* =====================================================
          PROFESSIONAL EXPERIENCE
      ===================================================== */}

      <section className="bg-black px-6 py-28 text-white md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-end">

          <div className="lg:col-span-8">
            <div
              className="
                font-[var(--font-display)]
                text-[120px]
                leading-[0.7]
                tracking-[-0.04em]

                sm:text-[180px]
                md:text-[300px]
                lg:text-[360px]
              "
            >
              ITALY
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
              From 2015
            </p>

            <p className="mt-5 text-[14px] leading-[1.55] text-white/75 md:text-[16px]">
              Years of professional practice in Italy, including the supervision
              of major projects, inform the precision and attention to detail
              behind the studio today.
            </p>
          </div>

        </div>
      </section>


      {/* =====================================================
          A NEW CHAPTER IN EGYPT
      ===================================================== */}

      <section className="px-6 py-28 md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">

          <div className="lg:col-span-8">

            <p className="mb-8 text-[9px] uppercase tracking-[0.25em] text-black/45">
              A new chapter
            </p>

            <h2
              className="
                font-[var(--font-display)]
                text-[58px]
                uppercase
                leading-[0.78]
                tracking-[-0.025em]

                sm:text-[76px]
                md:text-[130px]
                lg:text-[170px]
              "
            >
              A new
              <br />
              chapter
            </h2>

          </div>

          <div className="flex items-end lg:col-span-4">
            <div>

              <p
                className="
                  text-[20px]
                  leading-[1.15]
                  tracking-[-0.02em]
                  sm:text-[24px]
                  md:text-[32px]
                "
              >
                A new, independent architectural design studio based in Egypt.
              </p>

              <p className="mt-8 text-[14px] leading-[1.6] text-black/65 md:text-[16px]">
                After returning and settling in Egypt, the founder established
                Mason & Arc as a new and independent chapter. The studio focuses
                on architecture, interiors, and detailed design development for
                projects in Egypt and internationally, with delivery advisory and
                execution supervision available selectively when requested.
              </p>

            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          APPROACH
      ===================================================== */}

      <section className="border-t border-black/15 px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/50">
              Our Approach
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">

            <p
              className="
                text-[26px]
                leading-[1.08]
                tracking-[-0.025em]
                sm:text-[30px]
                md:text-[46px]
                lg:text-[56px]
              "
            >
              Our approach begins with understanding the relationship between
              people, space, context, and purpose.
            </p>

            <p
              className="
                mt-12
                max-w-[760px]
                text-[15px]
                leading-[1.7]
                text-black/65
                md:text-[17px]
              "
            >
              Every project is considered as an opportunity to create
              environments that are not only visually distinctive, but also
              functional, considered, and capable of responding to the way
              people actually live, work, and interact with their surroundings.
              From the earliest concept to the development of materials,
              details, and spatial experience, design decisions are approached
              as part of one connected process.
            </p>

          </div>
        </div>
      </section>


      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="bg-[#f2f2f0] px-6 py-24 md:px-10 md:py-32">

        <div className="mb-20 flex items-end justify-between">

          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/45">
              What we do
            </p>

            <h2
              className="
                mt-5
                font-[var(--font-display)]
                text-[56px]
                uppercase
                leading-[0.8]
                tracking-[-0.025em]

                sm:text-[72px]
                md:text-[120px]
                lg:text-[150px]
              "
            >
              Services
            </h2>
          </div>

          <span className="hidden text-[9px] uppercase tracking-[0.2em] text-black/40 md:block">
            01 — 04
          </span>

        </div>


        <div className="border-t border-black/20">

          {services.map((service) => (
            <div
              key={service.number}
              className="
                grid
                grid-cols-1
                gap-8
                border-b
                border-black/20
                py-10

                md:grid-cols-12
                md:gap-10
                md:py-14
              "
            >

              <div className="md:col-span-1">
                <span className="text-[9px] tracking-[0.2em] text-black/40">
                  {service.number}
                </span>
              </div>

              <div className="md:col-span-4">
                <h3
                  className="
                    font-[var(--font-display)]
                    text-[42px]
                    uppercase
                    leading-[0.8]
                    tracking-[-0.02em]

                    sm:text-[48px]
                    md:text-[64px]
                    lg:text-[78px]
                  "
                >
                  {service.title}
                </h3>
              </div>

              <div className="md:col-span-5 md:col-start-8">
                <p
                  className="
                    max-w-[560px]
                    text-[14px]
                    leading-[1.65]
                    text-black/65
                    md:text-[16px]
                  "
                >
                  {service.text}
                </p>
              </div>

            </div>
          ))}

        </div>
      </section>


      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="bg-black px-6 py-28 text-white md:px-10 md:py-40">

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-9">

            <h2
              className="
                font-[var(--font-display)]
                text-[48px]
                uppercase
                leading-[0.8]
                tracking-[-0.025em]

                sm:text-[64px]
                md:text-[120px]
                lg:text-[155px]
              "
            >
              Places with
              <br />
              character.
              <br />
              Purpose.
              <br />
              Lasting value.
            </h2>

          </div>

          <div className="lg:col-span-3 lg:col-start-10 lg:flex lg:items-end">

            <p className="text-[14px] leading-[1.65] text-white/60 md:text-[16px]">
              Our ambition is not simply to produce buildings or interiors,
              but to create places with character, purpose, and lasting value —
              environments where architecture, interior, exterior, and
              landscape come together as one considered experience.
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTACT CTA
      ===================================================== */}

      <section className="px-6 py-24 md:px-10 md:py-32">

        <div className="flex flex-col gap-10 border-t border-black/20 pt-8 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-[9px] uppercase tracking-[0.25em] text-black/45">
              Start a project
            </p>

            <h2
              className="
                mt-5
                font-[var(--font-display)]
                text-[56px]
                uppercase
                leading-[0.8]
                tracking-[-0.025em]

                sm:text-[72px]
                md:text-[110px]
                lg:text-[140px]
              "
            >
              Let&apos;s
              <br />
              design.
            </h2>

          </div>

          <Link
            href="/contact"
            className="
              inline-flex
              items-center
              gap-4
              border-b
              border-black
              pb-2
              text-[10px]
              uppercase
              tracking-[0.2em]
              transition-opacity
              duration-300
              hover:opacity-50
            "
          >
            Get in touch
            <span className="text-base">↗</span>
          </Link>

        </div>
      </section>

    </main>
  );
}
