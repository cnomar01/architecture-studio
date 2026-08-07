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
      <div className="mx-auto flex max-w-[1700px] items-start justify-between px-8 pt-8 md:px-12 lg:px-16">

        <Logo light />

        <nav className="hidden md:flex items-center gap-14 pt-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                text-[12px]
                uppercase
                tracking-[0.35em]
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