import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="bg-black text-white">

      {/* =====================================================
          PROJECT HERO
      ===================================================== */}

      <section className="relative min-h-screen overflow-hidden">

        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/25" />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black
              via-black/20
              to-transparent
            "
          />
        </div>

        <div
          className="
            relative
            z-10
            flex
            min-h-screen
            flex-col
            justify-end
            px-6
            pb-10

            md:px-10
            md:pb-14

            lg:px-16
            lg:pb-16
          "
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <p
                className="
                  mb-5
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-white/55
                "
              >
                Project 01
              </p>

              <h1
                className="
                  max-w-[1200px]
                  font-[var(--font-display)]
                  text-[64px]
                  uppercase
                  leading-[0.78]
                  tracking-[-0.035em]

                  sm:text-[82px]
                  md:text-[120px]
                  lg:text-[150px]
                  xl:text-[175px]
                "
              >
                {project.title}
              </h1>
            </div>

            <div className="flex flex-col gap-2 text-[10px] uppercase tracking-[0.2em] text-white/60 lg:text-right">
              <span>{project.location}</span>
              <span>{project.year}</span>
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="px-6 py-24 md:px-10 md:py-32 lg:px-16">

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">
              Overview
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">

            <p
              className="
                text-[25px]
                leading-[1.08]
                tracking-[-0.025em]

                sm:text-[32px]
                md:text-[46px]
                lg:text-[54px]
              "
            >
              {project.description}
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          PROJECT DATA
      ===================================================== */}

      <section className="border-t border-white/15 px-6 py-20 md:px-10 md:py-28 lg:px-16">

        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-4">

          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/35">
              Project Type
            </p>

            <p className="mt-5 text-[18px] leading-[1.3]">
              Mixed-Use Development
            </p>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/35">
              Program
            </p>

            <p className="mt-5 text-[18px] leading-[1.45]">
              Shopping Mall
              <br />
              Retail
              <br />
              Offices
              <br />
              Medical Clinics
              <br />
              Residential
              <br />
              Rooftop Leisure
            </p>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/35">
              Scope
            </p>

            <p className="mt-5 text-[18px] leading-[1.45]">
              Architecture
              <br />
              Façade
              <br />
              MEP
              <br />
              HVAC
              <br />
              Vertical Transportation
              <br />
              Interior Finishing
            </p>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/35">
              Status
            </p>

            <p className="mt-5 text-[18px] leading-[1.3]">
              Ongoing
              <br />
              Started 2025
            </p>
          </div>

        </div>
      </section>


      {/* =====================================================
          EXECUTION
      ===================================================== */}

      <section className="bg-[#f2f2f0] px-6 py-24 text-black md:px-10 md:py-32 lg:px-16">

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              Execution
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">

            <h2
              className="
                font-[var(--font-display)]
                text-[50px]
                uppercase
                leading-[0.8]
                tracking-[-0.03em]

                sm:text-[70px]
                md:text-[100px]
                lg:text-[130px]
              "
            >
              From
              <br />
              concept
              <br />
              to reality.
            </h2>

            <p className="mt-12 max-w-[760px] text-[15px] leading-[1.7] text-black/65 md:text-[17px]">
              City Edge is being delivered as a fully coordinated
              mixed-use development, bringing architectural design,
              building systems, façade construction, vertical
              transportation, mechanical and electrical works, and
              interior finishing together as one integrated process.
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          GALLERY
      ===================================================== */}

      <section className="px-6 py-24 md:px-10 md:py-32 lg:px-16">

        <div className="mb-16 flex items-end justify-between">

          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/40">
              Project Documentation
            </p>

            <h2
              className="
                mt-5
                font-[var(--font-display)]
                text-[54px]
                uppercase
                leading-[0.8]
                tracking-[-0.03em]

                sm:text-[72px]
                md:text-[110px]
                lg:text-[140px]
              "
            >
              The Work.
            </h2>
          </div>

          <span className="hidden text-[9px] uppercase tracking-[0.2em] text-white/35 md:block">
            01 — 05
          </span>

        </div>


        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

          {project.gallery.map((image, index) => (
            <div
              key={image}
              className={`
                relative
                overflow-hidden
                bg-white/5

                ${
                  index === 0
                    ? "md:col-span-2 aspect-[16/9]"
                    : "aspect-[4/3]"
                }
              `}
            >
              <img
                src={image}
                alt={`${project.title} — ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

        </div>
      </section>


      {/* =====================================================
          NEXT / BACK
      ===================================================== */}

      <section className="border-t border-white/15 px-6 py-10 md:px-10 lg:px-16">

        <div className="flex items-center justify-between">

          <Link
            href="/projects"
            className="
              text-[9px]
              uppercase
              tracking-[0.25em]
              text-white/50
              transition-opacity
              duration-300
              hover:text-white
            "
          >
            ← All Projects
          </Link>

          <span className="text-[9px] uppercase tracking-[0.25em] text-white/30">
            Mason & Arc
          </span>

        </div>

      </section>

    </main>
  );
}