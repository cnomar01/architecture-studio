"use client";

import Reveal from "@/components/animations/Reveal";
import Container from "@/components/shared/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";

const contactCopy = {
  en: {
    heading: ["Tell us what", "you’re working on."],
    intro: "A place, a brand, an image, a digital experience—or a project that needs them to work together. Share the starting point and we’ll take it from there.",
    email: "Email",
    egypt: "Egypt",
    whatsapp: "WhatsApp",
    italy: "Italy",
    instagram: "Instagram",
  },
  ar: {
    heading: ["حدّثنا عمّا", "تعمل عليه."],
    intro: "مكان أو علامة أو صورة أو تجربة رقمية—أو مشروع يحتاج أن تعمل كلها معًا. شاركنا نقطة البداية وسنكمل من هناك.",
    email: "البريد الإلكتروني",
    egypt: "مصر",
    whatsapp: "واتساب",
    italy: "إيطاليا",
    instagram: "إنستغرام",
  },
  it: {
    heading: ["Raccontaci a cosa", "stai lavorando."],
    intro: "Un luogo, un brand, un’immagine, un’esperienza digitale—o un progetto che deve farli lavorare insieme. Condividi il punto di partenza e continueremo da lì.",
    email: "Email",
    egypt: "Egitto",
    whatsapp: "WhatsApp",
    italy: "Italia",
    instagram: "Instagram",
  },
} as const;

export default function ContactHero() {
  const { locale } = useLocale();
  const copy = contactCopy[locale];
  return (
    <section className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <Container className="flex min-h-screen items-center px-8 pb-20 pt-32 md:px-12 md:pb-24 md:pt-36 lg:px-16 lg:pt-40">
        <div className="grid w-full grid-cols-1 gap-20 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">

          {/* Heading */}
          <div>
            <Reveal>
              <h1
                className="
                  max-w-[820px]
                  text-[clamp(3.5rem,7vw,6.5rem)]
                  font-extralight
                  leading-[0.9]
                  tracking-[-0.055em]
                "
              >
                {copy.heading[0]}
                <br />
                {copy.heading[1]}
              </h1>
            </Reveal>

            <Reveal>
              <p className="mt-12 max-w-[560px] text-[15px] font-light leading-[1.9] text-neutral-600 md:text-[17px]">
                {copy.intro}
              </p>
            </Reveal>
          </div>

          {/* Contact Details */}
          <Reveal>
            <div className="border-t border-neutral-300">

              {/* Email */}
              <a
                href="mailto:Masonandarc@gmail.com"
                className="flex items-center justify-between gap-6 border-b border-neutral-300 py-7 transition-opacity duration-300 hover:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  {copy.email}
                </span>

                <span className="text-right text-[13px] font-light">
                  Masonandarc@gmail.com
                </span>
              </a>

              {/* Egypt */}
              <a
                href="tel:+201044007555"
                className="flex items-center justify-between gap-6 border-b border-neutral-300 py-7 transition-opacity duration-300 hover:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  {copy.egypt}
                </span>

                <span className="text-[13px] font-light">
                  +20 1044007555
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/201044007555"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-6 border-b border-neutral-300 py-7 transition-opacity duration-300 hover:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  {copy.whatsapp}
                </span>

                <span dir="ltr" className="text-[13px] font-light">
                  +20 10 440 07555 ↗
                </span>
              </a>

              {/* Italy */}
              <a
                href="tel:+393200534654"
                className="flex items-center justify-between gap-6 border-b border-neutral-300 py-7 transition-opacity duration-300 hover:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  {copy.italy}
                </span>

                <span className="text-[13px] font-light">
                  +39 320 053 4654
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/masonandarc/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-6 border-b border-neutral-300 py-7 transition-opacity duration-300 hover:opacity-50"
              >
                <span className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
                  {copy.instagram}
                </span>

                <span className="text-[13px] font-light">
                  @masonandarc ↗
                </span>
              </a>

            </div>
          </Reveal>

        </div>

      </Container>
    </section>
  );
}
