"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* =====================================================
          FIXED HEADER
      ===================================================== */}

      <header
        className="
          fixed
          inset-x-0
          top-0
          z-[999]
          pointer-events-none
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            px-6
            pt-6
            md:px-8
            md:pt-7
          "
        >
          {/* =================================================
              LOGO
          ================================================= */}

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
              className="
                block
                h-auto
                w-full
                object-contain
                object-left
              "
            />
          </Link>

          {/* =================================================
              MENU
          ================================================= */}

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
              h-[34px]
              w-[38px]
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
                ${
                  open
                    ? "rotate-45"
                    : "-translate-y-[5px]"
                }
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
                ${
                  open
                    ? "-rotate-45"
                    : "translate-y-[5px]"
                }
              `}
            />
          </button>
        </div>
      </header>

      {/* =====================================================
          FULLSCREEN MENU
      ===================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-[900]
          bg-black
          text-white
          transition-all
          duration-700
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      >
        <div
          className="
            flex
            h-full
            flex-col
            justify-center
            px-8
            md:px-16
            lg:px-20
          "
        >
          <nav className="flex flex-col">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="
                font-[var(--font-display)]
                text-[52px]
                uppercase
                leading-[0.8]
                tracking-[-0.02em]
                transition-transform
                duration-500
                hover:translate-x-3
                md:text-[100px]
                lg:text-[130px]
              "
            >
              Home
            </Link>

            <Link
              href="/projects"
              onClick={() => setOpen(false)}
              className="
                font-[var(--font-display)]
                text-[52px]
                uppercase
                leading-[0.8]
                tracking-[-0.02em]
                transition-transform
                duration-500
                hover:translate-x-3
                md:text-[100px]
                lg:text-[130px]
              "
            >
              Projects
            </Link>

            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="
                font-[var(--font-display)]
                text-[52px]
                uppercase
                leading-[0.8]
                tracking-[-0.02em]
                transition-transform
                duration-500
                hover:translate-x-3
                md:text-[100px]
                lg:text-[130px]
              "
            >
              Services
            </Link>

            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="
                font-[var(--font-display)]
                text-[52px]
                uppercase
                leading-[0.8]
                tracking-[-0.02em]
                transition-transform
                duration-500
                hover:translate-x-3
                md:text-[100px]
                lg:text-[130px]
              "
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="
                font-[var(--font-display)]
                text-[52px]
                uppercase
                leading-[0.8]
                tracking-[-0.02em]
                transition-transform
                duration-500
                hover:translate-x-3
                md:text-[100px]
                lg:text-[130px]
              "
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}