"use client";

import Link from "next/link";
import Logo from "@/components/shared/Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/studio", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">

        <Logo light />

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                text-[11px]
                uppercase
                tracking-[0.28em]
                text-white
                transition-opacity
                duration-300
                hover:opacity-60
              "
            >
              {link.label}
            </Link>
          ))}
        </nav>

      </div>
    </header>
  );
}