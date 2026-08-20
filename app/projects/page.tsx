import Link from "next/link";
import Image from "next/image";

import { projects } from "../../data/projects";

const filters = [
  "All",
  "Architecture",
  "Interiors",
  "Design",
  "Execution",
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] text-neutral-900">

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section
        className="
          px-6
          pb-20
          pt-32
          sm:px-8
          md:px-12
          md:pb-28
          md:pt-40
          lg:px-16
          lg:pt-48
          xl:px-20
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-12
            lg:grid-cols-[0.35fr_1.65fr]
            lg:gap-x-16
          "
        >
          {/* LABEL */}

          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
            01 — Archive
          </span>

          {/* TITLE */}

          <div>
            <h1
              className="
                max-w-[1300px]
                text-[64px]
                font-light
                leading-[0.8]
                tracking-[-0.055em]
                sm:text-[86px]
                md:text-[115px]
                lg:text-[145px]
                xl:text-[175px]
              "
            >
              Projects
              <br />
              Archive.
            </h1>

            <p
              className="
                mt-10
                max-w-[600px]
                text-[13px]
                font-light
                leading-[1.8]
                text-neutral-500
                md:text-[15px]
              "
            >
              Architecture, interiors, and spaces developed
              through design, material, and execution.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FILTER BAR
      ====================================================== */}

      <section
        className="
          border-y
          border-neutral-300
          px-6
          sm:px-8
          md:px-12
          lg:px-16
          xl:px-20
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-8
            gap-y-4
            py-5
          "
        >
          <span
            className="
              mr-4
              text-[8px]
              uppercase
              tracking-[0.3em]
              text-neutral-400
            "
          >
            Filter
          </span>

          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`
                text-[9px]
                uppercase
                tracking-[0.28em]
                transition-opacity
                duration-300
                ${
                  index === 0
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-900"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          PROJECT ARCHIVE
      ====================================================== */}

      <section
        className="
          px-5
          pb-32
          pt-10
          sm:px-8
          md:px-10
          md:pb-48
          md:pt-14
          lg:px-14
          xl:px-16
        "
      >
        <div className="border-t border-neutral-300">

          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="
                group
                block
                border-b
                border-neutral-300
                py-8
                md:py-12
              "
            >
              {/* TOP META */}

              <div
                className="
                  mb-7
                  flex
                  items-center
                  justify-between
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >
                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[0.3em]
                      text-neutral-400
                    "
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="h-px w-8 bg-neutral-300" />

                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[0.3em]
                      text-neutral-400
                    "
                  >
                    {project.location}
                  </span>
                </div>

                <span
                  className="
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-neutral-400
                  "
                >
                  {project.year}
                </span>
              </div>

              {/* IMAGE */}

              <div
                className="
                  relative
                  h-[58vh]
                  min-h-[420px]
                  w-full
                  overflow-hidden
                  bg-neutral-200
                  md:h-[72vh]
                  lg:h-[80vh]
                "
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="100vw"
                  className="
                    object-cover
                    transition-transform
                    duration-[1400ms]
                    ease-out
                    group-hover:scale-[1.035]
                  "
                />

                {/* HOVER */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/0
                    transition-colors
                    duration-700
                    group-hover:bg-black/10
                  "
                />

                <div
                  className="
                    absolute
                    bottom-7
                    right-7
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/60
                    text-white
                    opacity-0
                    transition-all
                    duration-500
                    group-hover:opacity-100
                    md:bottom-10
                    md:right-10
                  "
                >
                  ↗
                </div>
              </div>

              {/* PROJECT TITLE */}

              <div
                className="
                  mt-7
                  flex
                  items-end
                  justify-between
                  gap-8
                "
              >
                <div>
                  <span
                    className="
                      mb-3
                      block
                      text-[8px]
                      uppercase
                      tracking-[0.3em]
                      text-neutral-400
                    "
                  >
                    Architecture
                  </span>

                  <h2
                    className="
                      text-[46px]
                      font-light
                      leading-[0.86]
                      tracking-[-0.05em]
                      transition-transform
                      duration-700
                      group-hover:translate-x-2
                      sm:text-[58px]
                      md:text-[76px]
                      lg:text-[94px]
                    "
                  >
                    {project.title}
                  </h2>
                </div>

                <span
                  className="
                    hidden
                    pb-2
                    text-[9px]
                    uppercase
                    tracking-[0.3em]
                    text-neutral-400
                    md:block
                  "
                >
                  View project ↗
                </span>
              </div>
            </Link>
          ))}

        </div>
      </section>

      {/* =====================================================
          END
      ====================================================== */}

      <section
        className="
          border-t
          border-neutral-300
          px-6
          py-20
          sm:px-8
          md:px-12
          md:py-28
          lg:px-16
          xl:px-20
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-10
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
            Mason & Arc
          </span>

          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-neutral-400
            "
          >
            End of archive
          </span>
        </div>
      </section>
    </main>
  );
}