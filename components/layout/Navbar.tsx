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
    <header className="fixed top-0 left-0 z-50 w-full">
      <div
        className="flex w-full items-start justify-between"
        style={{
          paddingLeft: "50px",
          paddingRight: "120px",
          paddingTop: "40px",
        }}
      >
        {/* Logo */}
        <Logo light />

        {/* Navigation */}
        <nav className="hidden lg:flex items-center pt-[8px] mr-[170px]">
          <ul className="flex items-center gap-[52px]">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="
                    !text-white
                    whitespace-nowrap
                    text-[12px]
                    font-light
                    uppercase
                    tracking-[0.36em]
                    transition-opacity
                    duration-300
                    hover:opacity-60
                  "
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}