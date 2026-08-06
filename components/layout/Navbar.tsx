"use client";

import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/studio", label: "Studio" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-12 py-8 md:px-16">

        {/* Logo */}
        <Link
          href="/"
          className="text-sm uppercase tracking-[12px] text-white font-light transition-opacity duration-300 hover:opacity-70"
        >
          MASON & ARC
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[5px] text-white transition-opacity duration-300 hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

      </div>
    </header>
  );
}