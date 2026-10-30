"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, projectCopy } from "@/components/i18n/LocaleProvider";
import type { WebsiteProject } from "@/lib/server/websiteProjects";

const sectionCopy = {
  en: { label: "03 — Selected Work", heading: "Selected work.", all: "View all projects", open: "View project" },
  ar: { label: "03 — أعمال مختارة", heading: "أعمال مختارة.", all: "كل المشروعات", open: "عرض المشروع" },
  it: { label: "03 — Progetti selezionati", heading: "Progetti scelti.", all: "Tutti i progetti", open: "Apri progetto" },
} as const;

export default function Projects({ projects }: { projects: WebsiteProject[] }) {
  const { locale, copy } = useLocale();
  const section = sectionCopy[locale];
  const featured = projects.slice(0, 3);

  return (
    <section aria-labelledby="home-projects-title" className="bg-[#f8f7f4] px-6 pb-28 text-neutral-900 sm:px-8 sm:pb-36 md:px-10 lg:px-16 lg:pb-44">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-9 border-t border-neutral-300 pt-6 lg:grid-cols-[.35fr_1.65fr] lg:gap-12">
          <p className="pt-1 text-[10px] font-medium uppercase tracking-[.28em] text-[#4F6B7A]">
            {section.label}
          </p>
          <h2
            id="home-projects-title"
            className="text-[clamp(2.9rem,5.7vw,6.25rem)] font-light leading-[1.02] tracking-[-.055em]"
          >
            {section.heading}
          </h2>
        </div>

        {featured.length > 0 ? (
          <div className="mt-11 grid gap-x-6 gap-y-14 sm:mt-16 md:grid-cols-2 md:gap-y-20">
            {featured.map((project, index) => {
              const translated = projectCopy(project, locale);
              return (
                <article key={project.id} className={index === 0 ? "md:col-span-2" : ""}>
                  <Link href={`/projects/${project.slug}`} className="group block" aria-label={`${section.open}: ${translated.title}`}>
                    <div className={`relative w-full overflow-hidden bg-neutral-200 ${index === 0 ? "aspect-[4/3] sm:aspect-[16/9] lg:aspect-[1.95]" : "aspect-[4/3]"}`}>
                      <Image
                        src={project.image_url}
                        alt={translated.title}
                        fill
                        unoptimized
                        priority={index === 0}
                        sizes={index === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
                      />
                      <span className="absolute bottom-5 end-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/15 text-lg text-white opacity-100 backdrop-blur-sm transition-colors group-hover:bg-black/40 sm:bottom-7 sm:end-7 md:opacity-0 md:group-hover:opacity-100" aria-hidden="true">↗</span>
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-5 sm:mt-6">
                      <div className="min-w-0">
                        <p className="mb-3 text-[10px] font-medium uppercase tracking-[.16em] text-[#4F6B7A]">
                          {translated.category}{translated.location ? ` · ${translated.location}` : ""}
                        </p>
                        <h3 className={`font-light leading-[1.05] ${locale === "ar" ? "text-[clamp(1.65rem,3.1vw,3rem)] tracking-[-.015em]" : "text-[clamp(1.75rem,3.2vw,3.4rem)] tracking-[-.045em]"}`}>
                          {translated.title}
                        </h3>
                      </div>
                      <span className="hidden shrink-0 text-[10px] uppercase tracking-[.14em] text-neutral-500 sm:inline">{section.open} ↗</span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-11 border-t border-neutral-300 py-14">
            <p className="text-sm font-light text-neutral-500">{copy.emptyProjects}</p>
          </div>
        )}

        <div className="mt-14 border-t border-neutral-300 pt-7 sm:mt-20">
          <Link href="/projects" className="inline-flex items-center gap-4 border-b border-neutral-400 pb-2 text-[11px] font-medium uppercase tracking-[.16em] transition-opacity hover:opacity-60">
            {section.all} <span aria-hidden="true" className="text-base">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
