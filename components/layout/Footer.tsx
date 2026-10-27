"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function Footer() {
  const { copy } = useLocale();
  const isContactPage = usePathname() === "/contact";
  return (
    <footer className="bg-[#f8f7f4] text-neutral-900">
      <div className="px-8 py-16 md:px-12 md:py-20 lg:px-16">

        {/* Top */}
        <div className={`grid grid-cols-1 gap-16 border-t border-neutral-300 pt-10 md:grid-cols-2 ${isContactPage ? "lg:grid-cols-[1.5fr_1fr]" : "lg:grid-cols-[1.5fr_1fr_1fr]"}`}>

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-[24px] font-light tracking-[0.25em]"
            >
              MASON & ARC
            </Link>

            <p className="mt-6 max-w-[340px] text-[14px] font-light leading-[1.8] text-neutral-500">
              {copy.footerTagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-6 text-[10px] uppercase tracking-[0.35em] text-neutral-400">
              {copy.navigate}
            </p>

            <div className="flex flex-col gap-4 text-[13px] font-light">
              <Link href="/" className="transition-opacity hover:opacity-50">
                {copy.home}
              </Link>

              <Link
                href="/projects"
                className="transition-opacity hover:opacity-50"
              >
                {copy.projects}
              </Link>

              <Link
                href="/about"
                className="transition-opacity hover:opacity-50"
              >
                {copy.about}
              </Link>

              <Link
                href="/services"
                className="transition-opacity hover:opacity-50"
              >
                {copy.services}
              </Link>

              <Link
                href="/contact"
                className="transition-opacity hover:opacity-50"
              >
                {copy.contact}
              </Link>
            </div>
          </div>

          {/* Contact details already appear in the hero on the contact page. */}
          <div hidden={isContactPage}>
            <p className="mb-6 text-[10px] uppercase tracking-[0.35em] text-neutral-400">
              {copy.contact}
            </p>

            <div className="flex flex-col gap-4 text-[13px] font-light">

              <a
                href="mailto:Masonandarc@gmail.com"
                className="transition-opacity hover:opacity-50"
              >
                Masonandarc@gmail.com
              </a>

              <a
                href="tel:+201044007555"
                className="transition-opacity hover:opacity-50"
              >
                +20 10 440 07555
              </a>

              <a
                href="tel:+393200534654"
                className="transition-opacity hover:opacity-50"
              >
                +39 320 053 4654
              </a>

              <a href="https://wa.me/201044007555" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-50">
                WhatsApp ↗
              </a>

              <a
                href="https://www.instagram.com/masonandarc/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-50"
              >
                Instagram ↗
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-20 flex flex-col gap-4 border-t border-neutral-300 pt-6 text-[10px] uppercase tracking-[0.3em] text-neutral-400 md:flex-row md:items-center md:justify-between">
          <span>© MASON & ARC. {copy.rights}</span>

          <span>{copy.disciplines}</span>
        </div>

      </div>
    </footer>
  );
}
