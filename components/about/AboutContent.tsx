"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { WebsiteLocale } from "@/lib/server/websiteProjects";

type AboutCopy = {
  eyebrow: string;
  title: string[];
  positionLabel: string;
  positionTitle: string;
  positionBody: string;
  focusLabel: string;
  focusTitle: string;
  focusBody: string;
  approachLabel: string;
  approachTitle: string;
  approachBody: string;
  servicesLabel: string;
  servicesTitle: string;
  closing: string[];
  closingBody: string;
  ctaLabel: string;
  ctaTitle: string[];
  cta: string;
  services: [string, string][];
};

const aboutCopy: Record<WebsiteLocale, AboutCopy> = {
  en: {
    eyebrow: "About",
    title: ["Architecture", "shaped by", "context."],
    positionLabel: "Our position",
    positionTitle: "Based in Egypt. Working internationally.",
    positionBody: "Mason & Arc is an architectural design studio for clients in Egypt and across international markets. We develop clear, considered design responses for residential, commercial, and mixed-use projects.",
    focusLabel: "Architectural design",
    focusTitle: "One discipline. A complete design process.",
    focusBody: "Our work stays focused on architecture: understanding the brief, studying the site, defining the concept, and developing the drawings and visual material needed to communicate a coherent design.",
    approachLabel: "Our approach",
    approachTitle: "Every project begins with context, purpose, and people.",
    approachBody: "We balance function, proportion, material, climate, and identity. Each decision is developed as part of one architectural idea, creating spaces that are useful, distinctive, and grounded in their setting.",
    servicesLabel: "What we do",
    servicesTitle: "Services",
    closing: ["Clear ideas.", "Precise design.", "Architecture", "with purpose."],
    closingBody: "From an early brief to a resolved architectural proposal, we help clients make confident design decisions with clarity at every stage.",
    ctaLabel: "Start a project",
    ctaTitle: ["Let’s", "design."],
    cta: "Get in touch",
    services: [
      ["Architectural Design", "Concepts and complete architectural proposals shaped around site, program, function, and identity."],
      ["Concept & Strategy", "Early studies that clarify the brief, spatial priorities, massing, circulation, and the central design idea."],
      ["Design Development", "The architectural concept developed into coordinated plans, elevations, sections, materials, and details."],
      ["Technical Documentation", "Clear architectural drawing packages prepared to communicate design intent and support project coordination."],
      ["Visualization", "Images, diagrams, and presentations that make the architectural proposal easy to understand and evaluate."],
    ],
  },
  ar: {
    eyebrow: "عن الاستوديو",
    title: ["عمارة", "يصوغها", "السياق."],
    positionLabel: "نطاق عملنا",
    positionTitle: "من مصر إلى عملاء في أسواق دولية.",
    positionBody: "Mason & Arc استوديو تصميم معماري يعمل مع عملاء في مصر والأسواق الدولية. نطوّر حلولًا مدروسة وواضحة للمشروعات السكنية والتجارية ومتعددة الاستخدامات.",
    focusLabel: "التصميم المعماري",
    focusTitle: "تخصص واحد. عملية تصميم متكاملة.",
    focusBody: "يركز عملنا على العمارة: فهم متطلبات المشروع، ودراسة الموقع، وصياغة الفكرة، وتطوير الرسومات والمواد البصرية اللازمة لعرض تصميم مترابط.",
    approachLabel: "منهجنا",
    approachTitle: "يبدأ كل مشروع من السياق والهدف والإنسان.",
    approachBody: "نوازن بين الوظيفة والنِسب والخامات والمناخ والهوية. تتطور كل القرارات ضمن فكرة معمارية واحدة لتكوين مساحات عملية ومميزة ومرتبطة بمكانها.",
    servicesLabel: "ما نقدمه",
    servicesTitle: "الخدمات",
    closing: ["أفكار واضحة.", "تصميم دقيق.", "عمارة", "ذات هدف."],
    closingBody: "من المتطلبات الأولى إلى المقترح المعماري المتكامل، نساعد العملاء على اتخاذ قرارات تصميم واثقة وواضحة في كل مرحلة.",
    ctaLabel: "ابدأ مشروعًا",
    ctaTitle: ["لنبدأ", "التصميم."],
    cta: "تواصل معنا",
    services: [
      ["التصميم المعماري", "أفكار ومقترحات معمارية متكاملة تتشكل وفق الموقع والبرنامج والوظيفة والهوية."],
      ["الفكرة والاستراتيجية", "دراسات أولية توضّح المتطلبات والأولويات الفراغية والكتل والحركة والفكرة التصميمية الأساسية."],
      ["تطوير التصميم", "تحويل الفكرة المعمارية إلى مخططات وواجهات وقطاعات وخامات وتفاصيل منسقة."],
      ["التوثيق الفني", "حزم رسومات معمارية واضحة تنقل مقاصد التصميم وتدعم تنسيق المشروع."],
      ["الإظهار المعماري", "صور ورسومات توضيحية وعروض تجعل المقترح المعماري سهل الفهم والتقييم."],
    ],
  },
  it: {
    eyebrow: "Studio",
    title: ["Architettura", "plasmata dal", "contesto."],
    positionLabel: "Il nostro raggio d’azione",
    positionTitle: "Con base in Egitto. Attivi a livello internazionale.",
    positionBody: "Mason & Arc è uno studio di progettazione architettonica per clienti in Egitto e nei mercati internazionali. Sviluppiamo risposte chiare e consapevoli per progetti residenziali, commerciali e polifunzionali.",
    focusLabel: "Progettazione architettonica",
    focusTitle: "Una disciplina. Un processo progettuale completo.",
    focusBody: "Il nostro lavoro resta focalizzato sull’architettura: comprendere il brief, studiare il sito, definire il concept e sviluppare disegni e materiali visivi per comunicare un progetto coerente.",
    approachLabel: "Il nostro approccio",
    approachTitle: "Ogni progetto nasce dal contesto, dallo scopo e dalle persone.",
    approachBody: "Equilibriamo funzione, proporzione, materia, clima e identità. Ogni decisione fa parte di un’unica idea architettonica, per creare spazi utili, distintivi e radicati nel luogo.",
    servicesLabel: "Cosa facciamo",
    servicesTitle: "Servizi",
    closing: ["Idee chiare.", "Design preciso.", "Architettura", "con uno scopo."],
    closingBody: "Dal brief iniziale a una proposta architettonica risolta, aiutiamo i clienti a prendere decisioni progettuali consapevoli e chiare in ogni fase.",
    ctaLabel: "Avvia un progetto",
    ctaTitle: ["Progettiamo", "insieme."],
    cta: "Contattaci",
    services: [
      ["Progettazione architettonica", "Concept e proposte architettoniche complete, definite da sito, programma, funzione e identità."],
      ["Concept e strategia", "Studi iniziali che chiariscono brief, priorità spaziali, volumi, percorsi e idea guida."],
      ["Sviluppo del progetto", "Il concept architettonico sviluppato in piante, prospetti, sezioni, materiali e dettagli coordinati."],
      ["Documentazione tecnica", "Elaborati architettonici chiari per comunicare l’intento progettuale e supportare il coordinamento."],
      ["Visualizzazione", "Immagini, diagrammi e presentazioni che rendono la proposta facile da comprendere e valutare."],
    ],
  },
};

export default function AboutContent() {
  const { locale } = useLocale();
  const copy = aboutCopy[locale];
  const displayClass = locale === "ar" ? "font-[var(--font-arabic)]" : "font-[var(--font-display)] uppercase";

  return (
    <main className="bg-white text-black">
      <section className="min-h-screen px-6 pb-24 pt-36 md:px-10 md:pt-44">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <p className="text-[9px] uppercase tracking-[0.25em] text-black/50 lg:col-span-3">{copy.eyebrow}</p>
          <h1 className={`${displayClass} text-[48px] leading-[0.86] tracking-[-0.025em] sm:text-[60px] md:text-[92px] lg:col-span-9 lg:text-[106px] xl:text-[126px] 2xl:text-[150px]`}>
            {copy.title.map((line) => <span className="block" key={line}>{line}</span>)}
          </h1>
        </div>
      </section>

      <section className="border-t border-black/15 px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <p className="text-[9px] uppercase tracking-[0.25em] text-black/50 lg:col-span-3">{copy.positionLabel}</p>
          <div className="lg:col-span-7 lg:col-start-5">
            <h2 className="text-[28px] leading-[1.08] tracking-[-0.025em] md:text-[48px]">{copy.positionTitle}</h2>
            <p className="mt-10 max-w-[720px] text-[15px] leading-[1.7] text-black/65 md:text-[17px]">{copy.positionBody}</p>
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-28 text-white md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <p className="text-[9px] uppercase tracking-[0.25em] text-white/50 lg:col-span-3">{copy.focusLabel}</p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className={`${displayClass} text-[48px] leading-[0.86] tracking-[-0.025em] md:text-[90px]`}>{copy.focusTitle}</h2>
            <p className="mt-10 max-w-[720px] text-[15px] leading-[1.7] text-white/65 md:text-[17px]">{copy.focusBody}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-black/15 px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <p className="text-[9px] uppercase tracking-[0.25em] text-black/50 lg:col-span-3">{copy.approachLabel}</p>
          <div className="lg:col-span-8 lg:col-start-5">
            <h2 className="text-[28px] leading-[1.08] tracking-[-0.025em] md:text-[52px]">{copy.approachTitle}</h2>
            <p className="mt-12 max-w-[760px] text-[15px] leading-[1.7] text-black/65 md:text-[17px]">{copy.approachBody}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f2f0] px-6 py-24 md:px-10 md:py-32">
        <div className="mb-20 flex items-end justify-between">
          <div><p className="text-[9px] uppercase tracking-[0.25em] text-black/45">{copy.servicesLabel}</p><h2 className={`${displayClass} mt-5 text-[56px] leading-[0.8] sm:text-[72px] md:text-[120px] lg:text-[150px]`}>{copy.servicesTitle}</h2></div>
          <span className="hidden text-[9px] tracking-[0.2em] text-black/40 md:block">01 — 05</span>
        </div>
        <div className="border-t border-black/20">
          {copy.services.map(([title, description], index) => (
            <div key={title} className="grid grid-cols-1 gap-8 border-b border-black/20 py-10 md:grid-cols-12 md:gap-10 md:py-14">
              <span className="text-[9px] tracking-[0.2em] text-black/40 md:col-span-1">{String(index + 1).padStart(2, "0")}</span>
              <h3 className={`${displayClass} text-[40px] leading-[0.9] tracking-[-0.02em] md:col-span-4 md:text-[64px]`}>{title}</h3>
              <p className="max-w-[560px] text-[14px] leading-[1.65] text-black/65 md:col-span-5 md:col-start-8 md:text-[16px]">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black px-6 py-28 text-white md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <h2 className={`${displayClass} text-[48px] leading-[0.84] tracking-[-0.025em] sm:text-[64px] md:text-[110px] lg:col-span-9 lg:text-[145px]`}>{copy.closing.map((line) => <span className="block" key={line}>{line}</span>)}</h2>
          <p className="text-[14px] leading-[1.65] text-white/60 md:text-[16px] lg:col-span-3 lg:col-start-10 lg:self-end">{copy.closingBody}</p>
        </div>
      </section>

      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-10 border-t border-black/20 pt-8 md:flex-row md:items-end md:justify-between">
          <div><p className="text-[9px] uppercase tracking-[0.25em] text-black/45">{copy.ctaLabel}</p><h2 className={`${displayClass} mt-5 text-[56px] leading-[0.84] sm:text-[72px] md:text-[110px] lg:text-[140px]`}>{copy.ctaTitle.map((line) => <span className="block" key={line}>{line}</span>)}</h2></div>
          <Link href="/contact" className="inline-flex items-center gap-4 border-b border-black pb-2 text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-50">{copy.cta}<span className="text-base">↗</span></Link>
        </div>
      </section>
    </main>
  );
}
