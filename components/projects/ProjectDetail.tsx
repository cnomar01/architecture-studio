"use client";

import Link from "next/link";
import Image from "next/image";
import { localizedText, localizedYear, projectCopy, useLocale } from "@/components/i18n/LocaleProvider";
import type { WebsiteProject } from "@/lib/server/websiteProjects";

export default function ProjectDetail({ project }: { project: WebsiteProject }) {
  const { locale, copy } = useLocale();
  const translated = projectCopy(project, locale);
  const gallery = project.gallery.length ? project.gallery : [project.image_url];

  return (
    <main className="bg-black text-white">
      <section className="relative min-h-[100svh] overflow-hidden">
        <Image src={project.image_url} alt={translated.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/10" />
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-10 md:px-10 md:pb-14 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-5 text-[9px] uppercase tracking-[.3em] text-white/60">{translated.category}</p>
              <h1 className={`max-w-[1200px] uppercase leading-[.82] tracking-[-.035em] ${locale === "ar" ? "font-[var(--font-arabic)] text-[58px] font-light sm:text-[76px] md:text-[105px] lg:text-[132px]" : "font-[var(--font-display)] text-[64px] sm:text-[82px] md:text-[120px] lg:text-[150px]"}`}>{translated.title}</h1>
            </div>
            <div className="text-[10px] uppercase tracking-[.2em] text-white/65 lg:text-end"><p>{translated.location}</p><p className="mt-2">{localizedYear(project.year, locale)}</p></div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <p className="text-[9px] uppercase tracking-[.3em] text-white/40 lg:col-span-3">{copy.overview}</p>
          <p className={`leading-[1.12] tracking-[-.025em] sm:text-[32px] md:text-[46px] lg:col-span-8 lg:col-start-5 ${locale === "ar" ? "text-[27px] md:leading-[1.35]" : "text-[25px]"}`}>{translated.description}</p>
        </div>
      </section>

      <section className="bg-[#f2f2f0] px-6 py-20 text-black md:px-10 md:py-28 lg:px-16">
        <p className="text-[9px] uppercase tracking-[.3em] text-black/45">{copy.projectDetails}</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div><p className="text-xs uppercase tracking-[.2em] text-black/45">{copy.type}</p><p className="mt-3 text-lg">{translated.category}</p></div>
          <div><p className="text-xs uppercase tracking-[.2em] text-black/45">{copy.location}</p><p className="mt-3 text-lg">{translated.location}</p></div>
          <div><p className="text-xs uppercase tracking-[.2em] text-black/45">{copy.timeline}</p><p className="mt-3 text-lg">{localizedYear(project.year, locale)}</p></div>
        </div>
      </section>

      {project.content_sections.map((section, index) => {
        const title = localizedText(section.title, locale);
        const body = localizedText(section.body, locale);
        const images = section.images.length ? section.images : index === 0 ? [project.image_url] : [];
        if (!title && !body && !images.length) return null;
        const light = index % 2 === 1;
        return <section key={section.id} className={`px-6 py-24 md:px-10 md:py-32 lg:px-16 ${light ? "bg-[#f2f2f0] text-black" : "bg-black text-white"}`}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-y-16">
            <p className={`text-[9px] uppercase tracking-[.3em] lg:col-span-3 ${light ? "text-black/45" : "text-white/40"}`}>{String(index + 2).padStart(2, "0")} — {title}</p>
            <div className="lg:col-span-8 lg:col-start-5">
              <h2 className={`leading-[.9] tracking-[-.045em] ${locale === "ar" ? "text-[48px] font-light sm:text-[64px] md:text-[82px]" : "font-[var(--font-display)] text-[58px] uppercase sm:text-[76px] md:text-[102px]"}`}>{title}</h2>
              <p className={`mt-10 max-w-4xl leading-[1.5] tracking-[-.015em] ${locale === "ar" ? "text-[22px] md:text-[30px] md:leading-[1.65]" : "text-[20px] md:text-[28px]"}`}>{body}</p>
            </div>
            {images.length > 0 && <div className="grid gap-5 lg:col-span-12 md:grid-cols-2">{images.map((image, imageIndex) => <div key={`${section.id}-${imageIndex}`} className={`relative overflow-hidden ${images.length === 1 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}><Image src={image} alt={`${title} — ${imageIndex + 1}`} fill sizes={images.length === 1 ? "100vw" : "(min-width: 768px) 50vw, 100vw"} className="object-cover" /></div>)}</div>}
          </div>
        </section>;
      })}

      <section className="px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mb-12">
          <p className="text-[9px] uppercase tracking-[.3em] text-white/40">{copy.documentation}</p>
          <h2 className={`mt-5 uppercase leading-[.82] tracking-[-.03em] ${locale === "ar" ? "font-[var(--font-arabic)] text-[52px] font-light sm:text-[68px] md:text-[92px]" : "font-[var(--font-display)] text-[54px] sm:text-[72px] md:text-[110px]"}`}>{copy.theWork}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">{gallery.map((image, index) => <div key={`${image}-${index}`} className={`relative overflow-hidden bg-white/5 ${index === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}><Image src={image} alt={`${translated.title} — ${index + 1}`} fill sizes={index === 0 ? "100vw" : "(min-width: 768px) 50vw, 100vw"} className="object-cover" /></div>)}</div>
      </section>

      <footer className="border-t border-white/15 px-6 py-10 md:px-10 lg:px-16"><Link href="/projects" className="text-[9px] uppercase tracking-[.25em] text-white/60">← {copy.allProjects}</Link></footer>
    </main>
  );
}
