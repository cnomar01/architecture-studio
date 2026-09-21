"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function RouteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { direction, locale } = useLocale();

  if (pathname.startsWith("/app")) {
    return <>{children}</>;
  }

  return (
    <div dir={direction} lang={locale} className={locale === "ar" ? "font-[var(--font-arabic)]" : ""}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
