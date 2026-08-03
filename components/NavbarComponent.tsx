"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { name: "Projects", href: "/projects" },
  { name: "Studio", href: "/studio" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 100) {
        setShow(false);
      } else {
        setShow(true);
      }

      lastScroll = current;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between px-12 py-8">

        <Link
          href="/"
          className="text-white text-2xl tracking-[10px] font-light"
        >
          STUDIO
        </Link>

        <nav className="flex gap-10 uppercase text-xs tracking-[4px] text-white">
          {links.map((item) => (
            <Link key={item.name} href={item.href}>
              {item.name}
            </Link>
          ))}
        </nav>

      </div>
    </header>
  );
}