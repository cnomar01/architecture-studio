"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
              mix-blend-difference
            "
          >
            <Image
              src="/images/logo-mason-arc.png"
              alt="Mason & Arc"
              width={500}
              height={160}
              priority
              className="block h-auto w-full object-contain object-left"
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
              mix-blend-difference
            "
          >
            <span
              className={`
                absolute
                block
                h-[2px]
                w-full
                bg-white
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
                bg-white
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
        <div className="flex min-h-full flex-col justify-center px-6 pb-10 pt-28 sm:px-8 md:px-16 lg:px-20">
          <nav className="flex flex-col">
            {[
              ["Home", "/"],
              ["Projects", "/projects"],
              ["Services", "/services"],
              ["About", "/about"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="
                  font-[var(--font-display)]
                  text-[clamp(42px,14vw,100px)]
                  uppercase
                  leading-[0.8]
                  tracking-[-0.02em]
                  transition-transform
                  duration-500
                  hover:translate-x-3
                  lg:text-[130px]
                "
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link href="/app/login" onClick={() => setOpen(false)} className="mt-8 flex min-h-14 max-w-sm items-center justify-between gap-4 rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm text-white">
            <span><span className="block text-[9px] uppercase tracking-[0.2em] text-white/50">Workspace login</span><span className="mt-1 block font-medium">Mason & Arc Studio</span></span><span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </>
  );
}
