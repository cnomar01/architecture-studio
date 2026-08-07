"use client";

import Link from "next/link";
import Logo from "../shared/Logo";
import Reveal from "../animations/Reveal";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/studio", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const social = [
  {
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    href: "mailto:masonandarc@gmail.com",
    label: "masonandarc@gmail.com",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#f8f7f4] border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">

        <Reveal>
          <Logo />
        </Reveal>

        <div className="mt-20 grid gap-16 md:grid-cols-2">

          <Reveal>
            <div>

              <h3 className="mb-6 text-xs uppercase tracking-[0.35em] text-neutral-400">
                Navigation
              </h3>

              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg text-neutral-800 transition-opacity duration-300 hover:opacity-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

            </div>
          </Reveal>

          <Reveal>
            <div>

              <h3 className="mb-6 text-xs uppercase tracking-[0.35em] text-neutral-400">
                Social
              </h3>

              <div className="flex flex-col gap-4">

                {social.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={
                      item.href.startsWith("http")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-lg text-neutral-800 transition-opacity duration-300 hover:opacity-50"
                  >
                    {item.label}
                  </a>
                ))}

              </div>

            </div>
          </Reveal>

        </div>

        <Reveal>
          <div className="mt-24 border-t border-neutral-200 pt-8">

            <p className="text-sm text-neutral-500">
              © MASON & ARC. All rights reserved.
            </p>

          </div>
        </Reveal>

      </div>
    </footer>
  );
}