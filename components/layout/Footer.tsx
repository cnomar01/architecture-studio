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
      <div className="px-6 py-12 sm:px-8 md:px-10 md:py-16 lg:px-16">

        {/* Top */}
        <div className={`grid grid-cols-1 gap-x-12 gap-y-12 border-t border-neutral-300 pt-9 md:grid-cols-2 md:gap-y-16 lg:gap-x-16 ${isContactPage ? "lg:grid-cols-[1.5fr_1fr]" : "lg:grid-cols-[1.25fr_0.75fr_1fr]"}`}>

          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Mason & Arc"
              className="block h-12 w-12 transition-opacity hover:opacity-60"
            >
              <SecondaryLogo className="h-full w-full text-neutral-900" />
            </Link>

            <p className="mt-5 max-w-[375px] text-[14px] font-normal leading-[1.7] text-neutral-600">
              {copy.footerTagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              {copy.navigate}
            </p>

            <div className="flex flex-col gap-3 text-[14px] font-normal text-neutral-700">
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
        <div className="mt-16 flex flex-col gap-4 border-t border-neutral-300 pt-5 text-neutral-500 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-medium uppercase tracking-[0.12em]">
            <span aria-hidden="true">©</span>
            <Link
              href="/"
              aria-label="Mason & Arc home"
              className="inline-flex shrink-0 items-center transition-opacity hover:opacity-65"
            >
              <Image
                src="/images/logo-mason-arc.png"
                alt=""
                width={500}
                height={160}
                className="h-auto w-[86px] object-contain brightness-0 sm:w-[96px]"
              />
            </Link>
            <span>{copy.rights}</span>
          </div>

          <span dir="ltr" className="text-[12px] font-normal normal-case tracking-[-0.01em] text-neutral-600">
            {copy.heroBuild} {copy.heroExperience}
          </span>
        </div>

      </div>
    </footer>
  );
}
