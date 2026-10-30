"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const aboutCopy = {
  en: {
    eyebrow: "About",
    hero: ["One vision.", "Many", "disciplines."],
    practiceLabel: "Professional practice in Italy",
    historyLead: "Mason & Arc is informed by professional experience developed in Italy since 2015, including contributions to and supervision of major projects across different scales and contexts.",
    historyBody: "This experience shaped a rigorous understanding of architecture, detailed coordination, material quality, and the relationship between design intent and the completed space.",
    country: "Italy",
    since: "From 2015",
    experience: "Years of professional practice in Italy, including the supervision of major projects, inform the precision and attention to detail behind the studio today.",
    chapterLabel: "A new chapter",
    chapterTitle: ["A new", "chapter"],
    chapterLead: "A new, independent multidisciplinary design studio based in Egypt.",
    chapterBody: "This experience now informs a new and independent chapter based in Egypt. Mason & Arc works across four connected practices: Architecture & Interiors, Branding & Creative Direction, Visualization & Communication, and Digital Experiences, for projects in Egypt and internationally.",
    approachLabel: "Our Approach",
    approachLead: "Our approach begins by defining the central idea that connects space, identity, image, and experience.",
    approachBody: "Every project is considered as one connected expression. From the earliest concept to the final physical or digital touchpoint, decisions are made with clarity, consistency, and purpose so that every part belongs to the same story.",
    closingTitle: ["Work with", "character.", "Purpose.", "Lasting value."],
    closingBody: "Our ambition is to shape spaces, identities, images, and digital experiences with character, purpose, and lasting value — where every touchpoint feels connected and intentional.",
    ctaLabel: "Start a project",
    ctaTitle: ["Let's", "design."],
    ctaLink: "Get in touch",
  },
  ar: {
    eyebrow: "عن الاستوديو",
    hero: ["رؤية واحدة.", "وتخصصات", "متعددة."],
    practiceLabel: "خبرة مهنية في إيطاليا",
    historyLead: "تستند Mason & Arc إلى خبرة مهنية تطورت في إيطاليا منذ عام 2015، وشملت المشاركة في مشروعات كبيرة والإشراف على تنفيذها عبر مقاييس وسياقات مختلفة.",
    historyBody: "شكّلت هذه الخبرة فهمًا دقيقًا للعمارة والتنسيق التفصيلي وجودة الخامات والعلاقة بين الفكرة التصميمية والفراغ بعد اكتماله.",
    country: "إيطاليا",
    since: "منذ 2015",
    experience: "سنوات من الممارسة المهنية في إيطاليا، بما في ذلك الإشراف على مشروعات كبيرة، تقف خلف الدقة والاهتمام بالتفاصيل اللذين يميزان الاستوديو اليوم.",
    chapterLabel: "فصل جديد",
    chapterTitle: ["فصل", "جديد"],
    chapterLead: "استوديو تصميم متعدد التخصصات، جديد ومستقل، مقره مصر.",
    chapterBody: "تشكل هذه الخبرة اليوم أساس فصل جديد ومستقل مقره مصر. تعمل Mason & Arc عبر أربع ممارسات مترابطة: العمارة والتصميم الداخلي، الهوية والتوجيه الإبداعي، التصور والتواصل، والتجارب الرقمية، لمشروعات في مصر ودوليًا.",
    approachLabel: "منهجنا",
    approachLead: "يبدأ منهجنا بتحديد الفكرة المركزية التي تربط المساحة والهوية والصورة والتجربة.",
    approachBody: "نتعامل مع كل مشروع كتعبير واحد مترابط. من الفكرة الأولى إلى آخر نقطة تواصل مادية أو رقمية، تُتخذ القرارات بوضوح واتساق وهدف، ليبقى كل جزء ضمن الحكاية نفسها.",
    closingTitle: ["عمل ذو", "شخصية.", "وهدف.", "وقيمة تدوم."],
    closingBody: "طموحنا هو صياغة مساحات وهويات وصور وتجارب رقمية ذات شخصية وهدف وقيمة تدوم، حيث تبدو كل نقطة تواصل مترابطة ومقصودة.",
    ctaLabel: "ابدأ مشروعًا",
    ctaTitle: ["لنصمّم", "معًا."],
    ctaLink: "تواصل معنا",
  },
  it: {
    eyebrow: "Studio",
    hero: ["Una visione.", "Molte", "discipline."],
    practiceLabel: "Esperienza professionale in Italia",
    historyLead: "Mason & Arc si fonda su un’esperienza professionale maturata in Italia dal 2015, che comprende il contributo e la supervisione alla realizzazione di importanti progetti di scale e contesti diversi.",
    historyBody: "Questa esperienza ha costruito una conoscenza rigorosa dell’architettura, del coordinamento di dettaglio, della qualità dei materiali e del rapporto tra intento progettuale e spazio realizzato.",
    country: "Italia",
    since: "Dal 2015",
    experience: "Gli anni di pratica professionale in Italia, compresa la supervisione di importanti progetti, guidano oggi la precisione e l’attenzione al dettaglio dello studio.",
    chapterLabel: "Un nuovo capitolo",
    chapterTitle: ["Un nuovo", "capitolo"],
    chapterLead: "Un nuovo studio di design multidisciplinare e indipendente con sede in Egitto.",
    chapterBody: "Questa esperienza informa oggi un nuovo capitolo indipendente con sede in Egitto. Mason & Arc lavora attraverso quattro pratiche connesse: Architettura & Interni, Branding & Direzione Creativa, Visualizzazione & Comunicazione ed Esperienze Digitali, in Egitto e a livello internazionale.",
    approachLabel: "Il nostro approccio",
    approachLead: "Il nostro approccio parte dall’idea centrale che connette spazio, identità, immagine ed esperienza.",
    approachBody: "Ogni progetto viene considerato come un’unica espressione connessa. Dal primo concept all’ultimo punto di contatto fisico o digitale, le decisioni sono guidate da chiarezza, coerenza e intenzione, perché ogni parte appartenga alla stessa storia.",
    closingTitle: ["Un lavoro con", "carattere.", "Scopo.", "Valore duraturo."],
    closingBody: "La nostra ambizione è dare forma a spazi, identità, immagini ed esperienze digitali con carattere, scopo e valore duraturo, dove ogni punto di contatto è connesso e intenzionale.",
    ctaLabel: "Inizia un progetto",
    ctaTitle: ["Progettiamo", "insieme."],
    ctaLink: "Contattaci",
  },
} as const;

export default function AboutPage() {
  const { locale } = useLocale();
  const copy = aboutCopy[locale];

  return (
    <main className="bg-white text-black">

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="min-h-screen px-6 pb-24 pt-36 md:px-10 md:pt-44">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/50">
              {copy.eyebrow}
            </p>
          </div>

          <div className="lg:col-span-9">
            <h1
              className="
                max-w-[1200px]
                font-extralight
                text-[48px]
                leading-[0.86]
                tracking-[-0.055em]

                sm:text-[64px]
                md:text-[120px]
                lg:text-[145px]
                xl:text-[160px]
              "
            >
              {copy.hero[0]}
              <br />
              {copy.hero[1]}
              <br />
              {copy.hero[2]}
            </h1>
          </div>

        </div>
      </section>


      {/* =====================================================
          HISTORY
      ===================================================== */}

      <section className="border-t border-black/15 px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <div
              className="
                font-extralight
                text-[60px]
                leading-none
                tracking-[-0.03em]
                md:text-[100px]
              "
            >
              2015
            </div>

            <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-black/50">
              {copy.practiceLabel}
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-5">

            <p
              className="
                text-[20px]
                leading-[1.2]
                tracking-[-0.02em]
                sm:text-[24px]
                md:text-[34px]
                lg:text-[42px]
              "
            >
              {copy.historyLead}
            </p>

            <p
              className="
                mt-10
                max-w-[720px]
                text-[14px]
                leading-[1.6]
                text-black/65
                md:text-[16px]
              "
            >
              {copy.historyBody}
            </p>

          </div>
        </div>
      </section>


      {/* =====================================================
          PROFESSIONAL EXPERIENCE
      ===================================================== */}

      <section className="bg-black px-6 py-28 text-white md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-end">

          <div className="lg:col-span-8">
            <div
              className="
                font-extralight
                text-[120px]
                leading-[0.7]
                tracking-[-0.04em]

                sm:text-[180px]
                md:text-[300px]
                lg:text-[360px]
              "
            >
              {copy.country}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
              {copy.since}
            </p>

            <p className="mt-5 text-[14px] leading-[1.55] text-white/75 md:text-[16px]">
              {copy.experience}
            </p>
          </div>

        </div>
      </section>


      {/* =====================================================
          A NEW CHAPTER IN EGYPT
      ===================================================== */}

      <section className="px-6 py-28 md:px-10 md:py-40">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-12">

          <div className="lg:col-span-8">

            <p className="mb-8 text-[9px] uppercase tracking-[0.25em] text-black/45">
              {copy.chapterLabel}
            </p>

            <h2
              className="
                font-extralight
                text-[58px]
                leading-[0.86]
                tracking-[-0.055em]

                sm:text-[76px]
                md:text-[130px]
                lg:text-[170px]
              "
            >
              {copy.chapterTitle[0]}
              <br />
              {copy.chapterTitle[1]}
            </h2>

          </div>

          <div className="flex items-end lg:col-span-4">
            <div>

              <p
                className="
                  text-[20px]
                  leading-[1.15]
                  tracking-[-0.02em]
                  sm:text-[24px]
                  md:text-[32px]
                "
              >
                {copy.chapterLead}
              </p>

              <p className="mt-8 text-[14px] leading-[1.6] text-black/65 md:text-[16px]">
                {copy.chapterBody}
              </p>

            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          APPROACH
      ===================================================== */}

      <section className="border-t border-black/15 px-6 py-24 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-3">
            <p className="text-[9px] uppercase tracking-[0.25em] text-black/50">
              {copy.approachLabel}
            </p>
          </div>

          <div className="lg:col-span-8 lg:col-start-5">

            <p
              className="
                text-[26px]
                leading-[1.08]
                tracking-[-0.025em]
                sm:text-[30px]
                md:text-[46px]
                lg:text-[56px]
              "
            >
              {copy.approachLead}
            </p>

            <p
              className="
                mt-12
                max-w-[760px]
                text-[15px]
                leading-[1.7]
                text-black/65
                md:text-[17px]
              "
            >
              {copy.approachBody}
            </p>

          </div>
        </div>
      </section>


      {/* =====================================================
          CLOSING
      ===================================================== */}

      <section className="bg-black px-6 py-28 text-white md:px-10 md:py-40">

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

          <div className="lg:col-span-9">

            <h2
              className="
                font-extralight
                text-[48px]
                leading-[0.86]
                tracking-[-0.055em]

                sm:text-[64px]
                md:text-[120px]
                lg:text-[155px]
              "
            >
              {copy.closingTitle[0]}
              <br />
              {copy.closingTitle[1]}
              <br />
              {copy.closingTitle[2]}
              <br />
              {copy.closingTitle[3]}
            </h2>

          </div>

          <div className="lg:col-span-3 lg:col-start-10 lg:flex lg:items-end">

            <p className="text-[14px] leading-[1.65] text-white/60 md:text-[16px]">
              {copy.closingBody}
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTACT CTA
      ===================================================== */}

      <section className="px-6 py-24 md:px-10 md:py-32">

        <div className="flex flex-col gap-10 border-t border-black/20 pt-8 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-[9px] uppercase tracking-[0.25em] text-black/45">
              {copy.ctaLabel}
            </p>

            <h2
              className="
                mt-5
                font-extralight
                text-[56px]
                leading-[0.86]
                tracking-[-0.055em]

                sm:text-[72px]
                md:text-[110px]
                lg:text-[140px]
              "
            >
              {copy.ctaTitle[0]}
              <br />
              {copy.ctaTitle[1]}
            </h2>

          </div>

          <Link
            href="/contact"
            className="
              inline-flex
              items-center
              gap-4
              border-b
              border-black
              pb-2
              text-[10px]
              uppercase
              tracking-[0.2em]
              transition-opacity
              duration-300
              hover:opacity-50
            "
          >
            {copy.ctaLink}
            <span className="text-base">↗</span>
          </Link>

        </div>
      </section>

    </main>
  );
}
