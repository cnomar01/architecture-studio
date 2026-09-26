"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, copy } = useLocale();
  // Keep the logo and menu visible on light pages and on the black menu overlay.
  const whiteChrome = pathname === "/" || open;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className="
          absolute
          inset-x-0
          top-0
          z-[999]
          pointer-events-none
        "
      >
        <div className="flex items-start justify-between px-6 pt-6 md:px-8 md:pt-7">
          <Link
            href="/"
            aria-label="Mason & Arc"
            className="
              pointer-events-auto
              relative
              z-[1000]
              block
              w-[118px]
              md:w-[128px]
            "
          >
            <Image
              src="/images/logo-mason-arc.png"
              alt="Mason & Arc"
              width={500}
              height={160}
              priority
              className={`block h-auto w-full object-contain object-left ${whiteChrome ? "brightness-0 invert" : "brightness-0"}`}
            />
          </Link>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="
              pointer-events-auto
              relative
              z-[1000]
              flex
              h-11
              w-11
              items-center
              justify-center
            "
          >
            <span
              className={`
                absolute
                block
                h-[2px]
                w-full
                ${whiteChrome ? "bg-white" : "bg-black"}
                transition-transform
                duration-500
                ease-out
                ${open ? "rotate-45" : "-translate-y-[5px]"}
              `}
            />
            <span
              className={`
                absolute
                block
                h-[2px]
                w-full
                ${whiteChrome ? "bg-white" : "bg-black"}
                transition-transform
                duration-500
                ease-out
                ${open ? "-rotate-45" : "translate-y-[5px]"}
              `}
            />
          </button>
        </div>
      </header>

      <div
        className={`
          fixed
          inset-0
          overflow-y-auto
          z-[900]
          bg-black
          text-white
          transition-all
          duration-700
          ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}
        `}
      >
        <div className="flex min-h-full flex-col px-6 pb-8 pt-24 sm:px-8 md:px-16 md:pb-10 md:pt-28 lg:px-20">
          <nav className={`flex flex-1 flex-col justify-center ${locale === "ar" ? "items-start" : ""}`}>
            {[
              [copy.home, "/"],
              [copy.projects, "/projects"],
              [copy.services, "/services"],
              [copy.about, "/about"],
              [copy.contact, "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`
                  ${locale === "ar" ? "font-[var(--font-arabic)] text-[48px] font-light leading-[1.08] tracking-[-0.035em] sm:text-[62px] md:text-[clamp(64px,9vh,78px)]" : "font-[var(--font-display)] text-[54px] uppercase leading-[0.8] tracking-[-0.02em] sm:text-[68px] md:text-[clamp(72px,10vh,110px)]"}
                  transition-transform
                  duration-500
                  hover:translate-x-3
                `}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-5 border-t border-white/20 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-[9px] uppercase tracking-[0.24em] text-white/45">{copy.language}</p>
              <div className="flex items-center gap-2" dir="ltr" aria-label="Choose language">
                {([['en','EN'],['ar','عربي'],['it','IT']] as const).map(([code,label]) => <button key={code} type="button" onClick={() => setLocale(code)} aria-pressed={locale === code} className={`min-h-10 rounded-full border px-4 text-xs transition ${locale === code ? "border-white bg-white text-black" : "border-white/25 text-white hover:border-white/70"}`}>{label}</button>)}
              </div>
            </div>
            <Link href="/app/login" onClick={() => setOpen(false)} className="flex min-h-14 w-full max-w-sm items-center justify-between gap-4 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm text-white sm:w-auto sm:min-w-72">
              <span><span className="block text-[9px] uppercase tracking-[0.2em] text-white/50">{copy.workspace}</span><span className="mt-1 block font-medium">{copy.studio}</span></span><span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
