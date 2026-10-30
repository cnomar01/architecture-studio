"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { JournalArticle } from "@/lib/server/websiteJournal";

function journalText(value: { en: string; ar: string; it: string }, locale: "en" | "ar" | "it") { return value[locale] || value.en; }

const back = { en: "All journal articles", ar: "كل المقالات", it: "Tutti gli articoli" } as const;

export default function JournalDetail({ article, related }: { article: JournalArticle; related: JournalArticle[] }) {
  const { locale } = useLocale();
  const title = journalText(article.title, locale);
  const excerpt = journalText(article.excerpt, locale);
  const body = journalText(article.body, locale);
  return <main className="min-h-screen bg-[#f8f7f4] text-neutral-900">
    <article>
      <header className="px-6 pb-20 pt-36 sm:px-8 md:px-10 md:pb-28 md:pt-44 lg:px-16"><p className="text-[9px] uppercase tracking-[.3em] text-neutral-400">{article.category}</p><h1 className="mt-8 max-w-6xl text-[clamp(3.5rem,10vw,9rem)] font-extralight leading-[.84] tracking-[-.055em]">{title}</h1><p className="mt-10 max-w-3xl text-lg font-light leading-8 text-neutral-600 md:text-2xl md:leading-10">{excerpt}</p></header>
      {article.cover_image_url && <div className="relative aspect-[16/9] w-full bg-neutral-200"><Image src={article.cover_image_url} alt={title} fill priority unoptimized sizes="100vw" className="object-cover" /></div>}
      <div className="px-6 py-20 sm:px-8 md:px-10 md:py-28 lg:px-16"><div className="grid gap-12 lg:grid-cols-[0.35fr_1.65fr]"><p className="text-[9px] uppercase tracking-[.3em] text-neutral-400">Mason & Arc Journal</p><div className="max-w-3xl whitespace-pre-line text-lg font-light leading-9 text-neutral-700 md:text-xl md:leading-10">{body}</div></div></div>
    </article>
    {related.length > 0 && <section className="border-t border-neutral-300 px-6 py-20 sm:px-8 md:px-10 lg:px-16"><div className="grid gap-8 md:grid-cols-3">{related.map((item) => <Link key={item.id} href={`/journal/${item.slug}`} className="border-b border-neutral-300 pb-6"><p className="text-[9px] uppercase tracking-[.25em] text-neutral-400">{item.category}</p><h2 className="mt-3 text-2xl font-light tracking-[-.03em]">{journalText(item.title, locale)}</h2></Link>)}</div></section>}
    <footer className="border-t border-neutral-300 px-6 py-10 sm:px-8 md:px-10 lg:px-16"><Link href="/journal" className="text-[9px] uppercase tracking-[.25em]">← {back[locale]}</Link></footer>
  </main>;
}
