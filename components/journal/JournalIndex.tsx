"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { JournalArticle } from "@/lib/server/websiteJournal";

function journalText(value: { en: string; ar: string; it: string }, locale: "en" | "ar" | "it") { return value[locale] || value.en; }

const pageCopy = {
  en: { eyebrow: "Studio Journal", title: "Ideas, process and perspective.", intro: "Notes from the work: design thinking, visual culture, material decisions and the systems behind coherent experiences.", empty: "No journal articles are published yet.", read: "Read article" },
  ar: { eyebrow: "دفتر الاستوديو", title: "أفكار وعمل ووجهات نظر.", intro: "ملاحظات من قلب العمل حول التفكير التصميمي والثقافة البصرية وقرارات الخامات والأنظمة التي تصنع تجارب متماسكة.", empty: "لا توجد مقالات منشورة حاليًا.", read: "اقرأ المقال" },
  it: { eyebrow: "Journal dello studio", title: "Idee, processo e prospettive.", intro: "Note dal lavoro: pensiero progettuale, cultura visiva, scelte materiche e sistemi che rendono coerente un’esperienza.", empty: "Non ci sono ancora articoli pubblicati.", read: "Leggi l’articolo" },
} as const;

export default function JournalIndex({ articles }: { articles: JournalArticle[] }) {
  const { locale } = useLocale();
  const copy = pageCopy[locale];
  return <main className="min-h-screen bg-[#f8f7f4] px-6 pb-28 pt-36 text-neutral-900 sm:px-8 md:px-10 md:pb-40 md:pt-44 lg:px-16">
    <div className="grid gap-10 border-b border-neutral-300 pb-20 lg:grid-cols-[0.35fr_1.65fr]">
      <p className="text-[9px] uppercase tracking-[.35em] text-neutral-400">{copy.eyebrow}</p>
      <div><h1 className="max-w-5xl text-[clamp(3.7rem,10vw,9rem)] font-extralight leading-[.86] tracking-[-.055em]">{copy.title}</h1><p className="mt-10 max-w-2xl text-base font-light leading-8 text-neutral-600">{copy.intro}</p></div>
    </div>
    {articles.length ? <div className="grid gap-x-8 gap-y-20 pt-20 md:grid-cols-2">{articles.map((article) => {
      const title = journalText(article.title, locale); const excerpt = journalText(article.excerpt, locale);
      return <article key={article.id}><Link href={`/journal/${article.slug}`} className="group block">{article.cover_image_url && <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200"><Image src={article.cover_image_url} alt={title} fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /></div>}<p className="mt-6 text-[9px] uppercase tracking-[.3em] text-neutral-400">{article.category}</p><h2 className="mt-4 text-3xl font-light leading-tight tracking-[-.035em] md:text-5xl">{title}</h2><p className="mt-5 max-w-xl text-sm leading-7 text-neutral-500">{excerpt}</p><span className="mt-6 inline-block text-[9px] uppercase tracking-[.25em]">{copy.read} ↗</span></Link></article>;
    })}</div> : <p className="py-24 text-sm text-neutral-500">{copy.empty}</p>}
  </main>;
}
