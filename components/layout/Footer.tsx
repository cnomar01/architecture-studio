"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/components/i18n/LocaleProvider";
import SecondaryLogo from "@/components/shared/SecondaryLogo";

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
              aria-label="Mason & Arc"
              className="block h-10 w-10 transition-opacity hover:opacity-50"
            >
              <SecondaryLogo className="h-full w-full text-neutral-900" />
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

        {/* Bottom: primary wordmark and approved brand line */}
        <div className="mt-20 flex flex-col gap-5 border-t border-neutral-300 pt-6 text-neutral-400 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.22em]">
            <span aria-hidden="true">©</span>
            <Link
              href="/"
              aria-label="Mason & Arc home"
              className="inline-flex shrink-0 items-center opacity-70 transition-opacity hover:opacity-100"
            >
              <Image
                src="/images/logo-mason-arc.png"
                alt=""
                width={500}
                height={160}
                className="h-auto w-[94px] object-contain brightness-0 sm:w-[108px]"
              />
            </Link>
            <span>{copy.rights}</span>
          </div>

          <span dir="ltr" className="text-[11px] font-normal normal-case tracking-[0.01em] text-neutral-500">
            {copy.heroBuild} {copy.heroExperience}
          </span>
        </div>

      </div>
    </footer>
  );
}
