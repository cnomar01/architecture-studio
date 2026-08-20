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
    title: "Exterior Design",
    text: "The spaces between buildings are as important as the buildings themselves. Our exterior design work considers landscape, circulation, planting, outdoor living, lighting, materials, and the relationship between architecture and its surrounding environment.",
  },
  {
    number: "04",
    title: "Urban Planning",
    text: "At a larger scale, Mason & Arc works with the relationships between buildings, public spaces, movement, landscape, and the wider city. Urban planning allows individual projects to become part of a larger and more connected environment.",
  },
  {
    number: "05",
    title: "Research",
    text: "Research is an important part of the design process. We investigate materials, technologies, spatial strategies, environmental conditions, and emerging ways of living and working in order to develop solutions that are relevant to each project's specific context.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-black">

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section
        className="
          min-h-[auto]
          px-5
          pb-20
          pt-28

          sm:px-6
          sm:pb-24
          sm:pt-32

          md:min-h-screen
          md:px-10
          md:pb-24
          md:pt-44
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-10

            sm:gap-12

            lg:grid-cols-12
            lg:gap-16
          "
        >
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

                sm:text-[64px]
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

      <section
        className="
          border-t
          border-black/15
          px-5
          py-20

          sm:px-6
          sm:py-24

          md:px-10
          md:py-32
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-12

            sm:gap-16

            lg:grid-cols-12
          "
        >
          <div className="lg:col-span-3">
            <div
              className="
                font-[var(--font-display)]
                text-[58px]
                leading-none
                tracking-[-0.03em]

                sm:text-[70px]
                md:text-[100px]
              "
            >
              2001
            </div>

            <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-black/50">
              Founded in Italy
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-5">
            <p
              className="
                text-[20px]
                leading-[1.18]
                tracking-[-0.02em]

                sm:text-[23px]
                md:text-[34px]
                lg:text-[42px]
              "
            >
              Mason & Arc was founded in Italy in 2001, with a commitment to
              creating architecture and interiors that combine strong design
              thinking with careful attention to detail, materiality, and the
              experience of space.
            </p>

            <p
              className="
                mt-8
                max-w-[720px]
                text-[13px]
                leading-[1.6]
                text-black/65

                sm:mt-10
                sm:text-[14px]

                md:text-[16px]
              "
            >
              Over the years, the practice has developed a diverse body of
              work spanning more than 350 projects across interior and exterior
              environments, building an extensive experience across different
              scales, contexts, and design challenges.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          350+
      ===================================================== */}

      <section
        className="
          overflow-hidden
          bg-black
          px-5
          py-20
          text-white

          sm:px-6
          sm:py-28

          md:px-10
          md:py-40
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-12

            sm:gap-16

            lg:grid-cols-12
            lg:items-end
          "
        >
          <div className="lg:col-span-8">
            <div
              className="
                whitespace-nowrap
                font-[var(--font-display)]
                text-[128px]
                leading-[0.72]
                tracking-[-0.05em]

                sm:text-[170px]
                md:text-[300px]
                lg:text-[360px]
              "
            >
              350+
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
              Projects
            </p>

            <p className="mt-4 text-[13px] leading-[1.55] text-white/75 sm:text-[14px] md:text-[16px]">
              More than three hundred and fifty projects across interior and
              exterior environments have shaped the experience and approach of
              Mason & Arc.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ITALY → EGYPT
      ===================================================== */}

      <section
        className="
          px-5
          py-20

          sm:px-6
          sm:py-28

          md:px-10
          md:py-40
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-14

            sm:gap-20

            lg:grid-cols-12
          "
        >
          <div className="lg:col-span-8">
            <p className="mb-7 text-[9px] uppercase tracking-[0.25em] text-black/45">
              A new chapter
            </p>

            <h2
              className="
                font-[var(--font-display)]
                text-[58px]
                uppercase
                leading-[0.8]
                tracking-[-0.025em]

                sm:text-[76px]
                md:text-[130px]
                lg:text-[170px]
              "
            >
              Italy
              <br />
              <span className="text-black/25">→</span>
              <br />
              Egypt
            </h2>
          </div>

          <div className="flex items-end lg:col-span-4">
            <div>
              <p
                className="
                  text-[20px]
                  leading-[1.18]
                  tracking-[-0.02em]

                  sm:text-[24px]
                  md:text-[32px]
                "
              >
                From our first studio in Italy to our new presence in Egypt.
              </p>

              <p
                className="
                  mt-7
                  text-[13px]
                  leading-[1.6]
                  text-black/65

                  sm:mt-8
                  sm:text-[14px]

                  md:text-[16px]
                "
              >
                Today, Mason & Arc brings this experience to a new chapter with
                the opening of its first branch in Egypt, extending the practice
                beyond its Italian origins while maintaining the same design
                approach, standards, and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          APPROACH
      ===================================================== */}

      <section
        className="
          border-t
          border-black/15
          px-5
          py-20

          sm:px-6
          sm:py-24

          md:px-10
          md:py-32
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-12

            sm:gap-16

            lg:grid-cols-12
          "
        >
          <div className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/50">
              Our Approach
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">
            <p
              className="
                text-[25px]
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
                mt-9
                max-w-[760px]
                text-[14px]
                leading-[1.65]
                text-black/65

                sm:mt-12
                sm:text-[15px]

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

      <section
        className="
          bg-[#f2f2f0]
          px-5
          py-20

          sm:px-6
          sm:py-24

          md:px-10
          md:py-32
        "
      >
        <div
          className="
            mb-14
            flex
            items-end
            justify-between

            sm:mb-20
          "
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/50">
              What we do
            </p>

            <h2
              className="
                mt-4
                font-[var(--font-display)]
                text-[60px]
                uppercase
                leading-[0.8]
                tracking-[-0.025em]

                sm:text-[80px]
                md:text-[120px]
                lg:text-[150px]
              "
            >
              Services
            </h2>
          </div>

          <span className="hidden text-[9px] uppercase tracking-[0.2em] text-black/40 md:block">
            01 — 05
          </span>
        </div>

        <div className="border-t border-black/20">
          {services.map((service) => (
            <div
              key={service.number}
              className="
                grid
                grid-cols-1
                gap-6
                border-b
                border-black/20
                py-8

                sm:gap-8
                sm:py-10

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
                    text-[38px]
                    uppercase
                    leading-[0.82]
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
                <p className="max-w-[560px] text-[13px] leading-[1.65] text-black/65 sm:text-[14px] md:text-[16px]">
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

      <section
        className="
          bg-black
          px-5
          py-20
          text-white

          sm:px-6
          sm:py-28

          md:px-10
          md:py-40
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-12

            sm:gap-16

            lg:grid-cols-12
          "
        >
          <div className="lg:col-span-9">
            <h2
              className="
                font-[var(--font-display)]
                text-[52px]
                uppercase
                leading-[0.8]
                tracking-[-0.025em]

                sm:text-[72px]
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
            <p className="text-[13px] leading-[1.65] text-white/60 sm:text-[14px] md:text-[16px]">
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

      <section
        className="
          px-5
          py-20

          sm:px-6
          sm:py-24

          md:px-10
          md:py-32
        "
      >
        <div
          className="
            flex
            flex-col
            gap-8
            border-t
            border-black/20
            pt-7

            sm:gap-10
            sm:pt-8

            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/45">
              Start a project
            </p>

            <h2
              className="
                mt-4
                font-[var(--font-display)]
                text-[58px]
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
              build.
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