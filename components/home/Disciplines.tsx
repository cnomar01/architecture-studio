"use client";

import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import { useLocale } from "@/components/i18n/LocaleProvider";

const content = {
  en: {
    label: "What we do",
    title: ["Four practices.", "One point of view."],
    intro: "Some projects begin with a place. Others begin with a name, an image, or a digital idea. We bring the right disciplines together around what the project needs.",
    explore: "Explore the practice",
    items: [
      ["Architecture & Interiors", "Places shaped from the first spatial idea through material, detail, coordination and delivery guidance.", "Architecture · Interior Design · Spatial Strategy · Design Development"],
      ["Branding & Creative Direction", "Identities with a clear voice, a useful system and enough character to be remembered.", "Strategy · Naming · Identity Systems · Signature Design Language"],
      ["Visualization & Communication", "Images, motion and presentation systems that make ideas clear before they are built or launched.", "Visualization · Motion · Campaign Imagery · Architectural Storytelling"],
      ["Digital Experiences", "Websites and digital touchpoints designed as a natural part of the brand, then built to work well.", "Web Design · Development · Digital Direction · Social Systems"],
    ],
  },
  ar: {
    label: "ما نعمل عليه",
    title: ["أربع ممارسات.", "ورؤية واحدة."],
    intro: "بعض المشروعات تبدأ بمكان، وأخرى تبدأ باسم أو صورة أو فكرة رقمية. نجمع التخصصات المناسبة حول ما يحتاجه كل مشروع فعلًا.",
    explore: "استكشف الممارسة",
    items: [
      ["العمارة والتصميم الداخلي", "أماكن تتطور من الفكرة المكانية الأولى إلى الخامات والتفاصيل والتنسيق ودعم التنفيذ.", "العمارة · التصميم الداخلي · الاستراتيجية المكانية · تطوير التصميم"],
      ["الهوية والتوجيه الإبداعي", "هويات بصوت واضح ونظام عملي وشخصية تستحق أن تُذكر.", "الاستراتيجية · التسمية · أنظمة الهوية · اللغة التصميمية المميزة"],
      ["التصور والتواصل", "صور وحركة وأنظمة عرض تجعل الفكرة واضحة قبل أن تُبنى أو تُطلق.", "التصور · الحركة · صور الحملات · السرد المعماري"],
      ["التجارب الرقمية", "مواقع ونقاط تواصل رقمية تُصمم كجزء طبيعي من الهوية، ثم تُطوّر لتعمل بكفاءة.", "تصميم المواقع · التطوير · التوجيه الرقمي · أنظمة التواصل"],
    ],
  },
  it: {
    label: "Cosa facciamo",
    title: ["Quattro pratiche.", "Un solo punto di vista."],
    intro: "Alcuni progetti iniziano da un luogo. Altri da un nome, un’immagine o un’idea digitale. Riuniamo le discipline giuste attorno a ciò di cui il progetto ha davvero bisogno.",
    explore: "Esplora la pratica",
    items: [
      ["Architettura & Interni", "Luoghi sviluppati dalla prima idea spaziale fino a materia, dettaglio, coordinamento e supporto alla realizzazione.", "Architettura · Interior Design · Strategia spaziale · Sviluppo del progetto"],
      ["Branding & Direzione Creativa", "Identità con una voce chiara, un sistema utile e un carattere capace di farsi ricordare.", "Strategia · Naming · Sistemi d’identità · Linguaggio distintivo"],
      ["Visualizzazione & Comunicazione", "Immagini, motion e sistemi di presentazione che rendono chiare le idee prima di costruirle o lanciarle.", "Visualizzazione · Motion · Immagini di campagna · Storytelling architettonico"],
      ["Esperienze Digitali", "Siti e touchpoint digitali progettati come parte naturale del brand, poi sviluppati per funzionare bene.", "Web Design · Sviluppo · Direzione digitale · Sistemi social"],
    ],
  },
} as const;

export default function Disciplines() {
  const { locale } = useLocale(); const copy = content[locale];
  return <section className="bg-[#f8f7f4] px-6 py-24 text-neutral-900 sm:px-8 md:px-10 md:py-36 lg:px-16">
    <div className="grid gap-10 border-t border-neutral-300 pt-7 lg:grid-cols-[.35fr_1.65fr]">
      <Reveal><p className="text-[9px] uppercase tracking-[.35em] text-neutral-400">{copy.label}</p></Reveal>
      <Reveal><div><h2 className="text-[clamp(3.5rem,9vw,8rem)] font-extralight leading-[.86] tracking-[-.055em]">{copy.title[0]}<br />{copy.title[1]}</h2><p className="mt-10 max-w-2xl text-base font-light leading-8 text-neutral-600">{copy.intro}</p></div></Reveal>
    </div>
    <div className="mt-20 border-t border-neutral-300 md:mt-28">{copy.items.map((item, index) => <Reveal key={item[0]}><Link href={`/services#discipline-${index + 1}`} className="group grid gap-5 border-b border-neutral-300 py-9 md:grid-cols-[60px_.85fr_1fr_40px] md:gap-8 md:py-12"><span className="text-[9px] tracking-[.25em] text-[#4F6B7A]">0{index + 1}</span><h3 className={`${locale === "ar" ? "text-3xl md:text-4xl" : "text-3xl md:text-5xl"} font-light leading-[1.02] tracking-[-.04em] transition-transform duration-500 group-hover:translate-x-2`}>{item[0]}</h3><div><p className="max-w-xl text-sm font-light leading-7 text-neutral-600">{item[1]}</p><p className="mt-5 text-[9px] uppercase leading-5 tracking-[.18em] text-neutral-400">{item[2]}</p></div><span className="hidden text-neutral-400 md:block">↗</span></Link></Reveal>)}</div>
  </section>;
}
