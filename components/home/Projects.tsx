"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, projectCopy } from "@/components/i18n/LocaleProvider";
import type { WebsiteProject } from "@/lib/server/websiteProjects";

const sectionCopy = {
  en: {
    label: "03 — Selected Work",
    heading: "Selected work.",
    all: "View all projects",
    open: "View project",
  },
  ar: {
    label: "03 — أعمال مختارة",
    heading: "أعمال مختارة.",
    all: "كل المشروعات",
    open: "عرض المشروع",
  },
  it: {
    label: "03 — Progetti selezionati",
    heading: "Progetti scelti.",
    all: "Tutti i progetti",
    open: "Apri progetto",
  },
} as const;

export default function Projects({ projects }: { projects: WebsiteProject[] }) {
  const { locale, copy } = useLocale();
  const section = sectionCopy[locale];
  const featured = projects.slice(0, 3);

  return (
    <section
      aria-labelledby="home-projects-title"
      className="bg-[#f8f7f4] px-6 pb-28 pt-24 text-[#181b1b] sm:px-8 sm:pb-36 sm:pt-32 md:px-10 lg:px-16 lg:pb-44 lg:pt-40"
    >
      <div className="mx-auto max-w-[1740px]">
        <div className="grid gap-9 border-t border-[#c9cdca] pt-6 lg:grid-cols-[minmax(160px,1fr)_minmax(0,3.5fr)] lg:gap-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#4F6B7A]">
            {section.label}
          </p>
          <h2
            id="home-projects-title"
            className={`font-light leading-[1.03] ${locale === "ar" ? "text-[clamp(2.65rem,6.1vw,6.5rem)] tracking-[-.018em]" : "text-[clamp(3.3rem,7vw,7.25rem)] tracking-[-.065em]"}`}
          >
            {section.heading}
          </h2>
        </div>

        {featured.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-y-20 sm:mt-20 sm:gap-y-24 md:grid-cols-12 md:gap-x-8 md:gap-y-28">
            {featured.map((project, index) => {
              const translated = projectCopy(project, locale);
              const articleLayout =
                index === 0
                  ? "md:col-span-12"
                  : index === 1
                    ? "md:col-span-5 md:col-start-1"
                    : "md:col-span-6 md:col-start-7 md:mt-40";
              const mediaRatio =
                index === 0
                  ? "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[1.9]"
                  : index === 1
                    ? "aspect-[4/3] md:aspect-[4/5]"
                    : "aspect-[4/3] md:aspect-[5/4]";

              return (
                <article key={project.id} className={articleLayout}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block"
                    aria-label={`${section.open}: ${translated.title}`}
                  >
                    <div className="mb-4 flex items-center justify-between gap-5 text-[10px] font-medium uppercase tracking-[.18em] sm:mb-5">
                      <span className="text-[#4F6B7A]">{String(index + 1).padStart(2, "0")} / 0{featured.length}</span>
                      <span className="truncate text-[#777e7a]">{translated.category}</span>
                    </div>

                    <div className={`relative w-full overflow-hidden bg-[#e0e1dd] ${mediaRatio}`}>
                      <Image
                        src={project.image_url}
                        alt={translated.title}
                        fill
                        unoptimized
                        priority={index === 0}
                        sizes={index === 0 ? "100vw" : "(min-width: 768px) 55vw, 100vw"}
                        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
                      />
                      <span
                        className="absolute inset-0 bg-black/0 transition-colors duration-700 group-hover:bg-black/10"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-6 sm:mt-7">
                      <div className="min-w-0">
                        <h3
                          className={`font-light leading-[1.06] ${locale === "ar" ? "text-[clamp(1.7rem,3.1vw,3.35rem)] tracking-[-.015em]" : "text-[clamp(2rem,3.1vw,3.6rem)] tracking-[-.055em]"}`}
                        >
                          {translated.title}
                        </h3>
                        {translated.location && (
                          <p className="mt-3 text-[10px] font-medium uppercase tracking-[.16em] text-[#797f7c]">
                            {translated.location}
                          </p>
                        )}
                      </div>
                      <span
                        className="mt-1 shrink-0 text-2xl font-light text-[#4F6B7A] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-14 border-t border-[#c9cdca] py-20">
            <p className="text-base font-light text-[#777e7a]">{copy.emptyProjects}</p>
          </div>
        )}

        <div className="mt-20 flex justify-end border-t border-[#c9cdca] pt-7 sm:mt-28">
          <Link
            href="/projects"
            className="inline-flex items-center gap-8 border-b border-[#929c98] pb-3 text-[10px] font-medium uppercase tracking-[.2em] text-[#252929] transition-colors hover:border-[#4F6B7A] hover:text-[#4F6B7A]"
          >
            {section.all}
            <span aria-hidden="true" className="text-lg font-light">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
