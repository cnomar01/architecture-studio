import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projects } from "../../../data/projects";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const currentIndex = projects.findIndex(
    (item) => item.slug === project.slug
  );

  const nextProject =
    projects[(currentIndex + 1) % projects.length];

  return (
    <main className="bg-[#f8f7f4] text-neutral-900">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section
        className="
          relative
          h-[100svh]
          min-h-[680px]
          w-full
          overflow-hidden
          bg-black
          text-white
        "
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/70
            via-black/10
            to-transparent
          "
        />

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            px-6
            pb-8
            sm:px-8
            md:px-12
            lg:px-16
            lg:pb-12
            xl:px-20
          "
        >
          {/* META */}

          <div
            className="
              mb-6
              flex
              items-center
              gap-4
              text-[9px]
              uppercase
              tracking-[0.3em]
              text-white/70
            "
          >
            <span>{project.location}</span>

            <span className="h-px w-8 bg-white/40" />

            <span>{project.year}</span>
          </div>

          {/* TITLE */}

          <h1
            className="
              max-w-[1450px]
              text-[64px]
              font-light
              leading-[0.8]
              tracking-[-0.055em]
              sm:text-[90px]
              md:text-[120px]
              lg:text-[155px]
              xl:text-[190px]
            "
          >
            {project.title}
          </h1>

          {/* BOTTOM META */}

          <div
            className="
              mt-8
              flex
              items-center
              justify-between
              border-t
              border-white/40
              pt-4
            "
          >
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-white/70
              "
            >
              Mason & Arc
            </span>

            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.3em]
                text-white/70
              "
            >
              Project {String(project.id).padStart(2, "0")}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}

      <section
        className="
          border-b
          border-neutral-300
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-14
            px-6
            py-28
            sm:px-8
            md:px-12
            md:py-40
            lg:grid-cols-[0.55fr_1.45fr]
            lg:gap-20
            lg:px-16
            xl:px-20
          "
        >
          <div>
            <span
              className="
                text-[9px]
                uppercase
                tracking-[0.35em]
                text-neutral-400
              "
            >
              01 — About
            </span>
          </div>

          <div>
            <p
              className="
                max-w-[1050px]
                text-[32px]
                font-light
                leading-[1.05]
                tracking-[-0.035em]
                sm:text-[42px]
                md:text-[54px]
                lg:text-[66px]
              "
            >
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECT DATA
      ====================================================== */}

      <section
        className="
          border-b
          border-neutral-300
        "
      >
        <div
          className="
            grid
            grid-cols-2
            gap-y-12
            px-6
            py-20
            sm:px-8
            md:grid-cols-4
            md:px-12
            md:py-28
            lg:px-16
            xl:px-20
          "
        >
          <ProjectInfo
            label="Project"
            value={project.title}
          />

          <ProjectInfo
            label="Location"
            value={project.location}
          />

          <ProjectInfo
            label="Year"
            value={project.year}
          />

          <ProjectInfo
            label="Type"
            value="Architecture"
          />
        </div>
      </section>

      {/* =====================================================
          GALLERY
      ====================================================== */}

      <section
        className="
          px-5
          py-20
          sm:px-8
          md:px-10
          md:py-32
          lg:px-14
          xl:px-16
        "
      >
        <div className="space-y-8 md:space-y-12">

          {/* LARGE IMAGE */}

          <div
            className="
              relative
              h-[65vh]
              min-h-[460px]
              w-full
              overflow-hidden
              bg-neutral-200
              md:h-[82vh]
            "
          >
            <Image
              src={project.gallery[0]}
              alt={`${project.title} — 01`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* TWO IMAGES */}

          <div
            className="
              grid
              grid-cols-1
              gap-8
              md:grid-cols-2
            "
          >
            <div
              className="
                relative
                h-[60vh]
                min-h-[420px]
                overflow-hidden
                bg-neutral-200
              "
            >
              <Image
                src={project.gallery[1]}
                alt={`${project.title} — 02`}
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>

            <div
              className="
                relative
                h-[60vh]
                min-h-[420px]
                overflow-hidden
                bg-neutral-200
              "
            >
              <Image
                src={project.gallery[2]}
                alt={`${project.title} — 03`}
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          EXPERIENCE
      ====================================================== */}

      <section
        className="
          border-t
          border-neutral-300
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-12
            px-6
            py-28
            sm:px-8
            md:px-12
            md:py-40
            lg:grid-cols-[0.55fr_1.45fr]
            lg:gap-20
            lg:px-16
            xl:px-20
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
            02 — Experience
          </span>

          <div>
            <h2
              className="
                max-w-[1000px]
                text-[48px]
                font-light
                leading-[0.9]
                tracking-[-0.05em]
                sm:text-[62px]
                md:text-[82px]
                lg:text-[105px]
              "
            >
              Space,
              <br />
              material,
              <br />
              experience.
            </h2>

            <p
              className="
                mt-10
                max-w-[560px]
                text-[14px]
                font-light
                leading-[1.8]
                text-neutral-500
              "
            >
              Architecture shaped through proportion,
              material, light, and the relationship between
              people and space.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          NEXT PROJECT
      ====================================================== */}

      <section className="border-t border-neutral-300">
        <Link
          href={`/projects/${nextProject.slug}`}
          className="group block"
        >
          <div
            className="
              relative
              h-[75vh]
              min-h-[560px]
              overflow-hidden
              bg-black
              text-white
            "
          >
            <Image
              src={nextProject.image}
              alt={nextProject.title}
              fill
              sizes="100vw"
              className="
                object-cover
                transition-transform
                duration-[1400ms]
                ease-out
                group-hover:scale-[1.04]
              "
            />

            <div className="absolute inset-0 bg-black/35" />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                px-6
                pb-10
                sm:px-8
                md:px-12
                lg:px-16
                xl:px-20
              "
            >
              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.35em]
                  text-white/60
                "
              >
                Next Project
              </span>

              <div
                className="
                  mt-5
                  flex
                  items-end
                  justify-between
                  gap-8
                "
              >
                <h2
                  className="
                    text-[58px]
                    font-light
                    leading-[0.82]
                    tracking-[-0.055em]
                    sm:text-[78px]
                    md:text-[110px]
                    lg:text-[145px]
                  "
                >
                  {nextProject.title}
                </h2>

                <span
                  className="
                    hidden
                    pb-3
                    text-2xl
                    transition-transform
                    duration-500
                    group-hover:translate-x-2
                    md:block
                  "
                >
                  ↗
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>
    </main>
  );
}

/* ===========================================================
   PROJECT INFO
=========================================================== */

function ProjectInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <span
        className="
          block
          text-[8px]
          uppercase
          tracking-[0.3em]
          text-neutral-400
        "
      >
        {label}
      </span>

      <span
        className="
          mt-3
          block
          text-[15px]
          font-light
          md:text-[17px]
        "
      >
        {value}
      </span>
    </div>
  );
}