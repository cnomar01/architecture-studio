import type { Metadata } from "next";
import { Inter, Bebas_Neue, Noto_Sans_Arabic } from "next/font/google";

import "./globals.css";

import RouteChrome from "@/components/layout/RouteChrome";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.masonandarc.com"),
  title: { default: "Mason & Arc — Architectural Design Studio", template: "%s | Mason & Arc" },
  description: "Mason & Arc is a design-led architectural studio, with execution available as an optional service.",
  applicationName: "Mason & Arc",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Mason & Arc",
    title: "Mason & Arc — Architectural Design Studio",
    description: "Architectural and interior design, with optional execution support when requested.",
    images: [{ url: "/images/hero-florence-sunset.png", width: 1672, height: 941, alt: "Mason & Arc — Architectural Design Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mason & Arc — Architectural Design Studio",
    description: "Architectural and interior design, with optional execution support when requested.",
    images: ["/images/hero-florence-sunset.png"],
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  verification: {
    google: "QzUt6qN9m0LhOjmUVnxItudzs6V1hJMrs1psWxLLJaU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bebas.variable} ${notoArabic.variable} antialiased`}
      >
        <LocaleProvider><RouteChrome>{children}</RouteChrome></LocaleProvider>
      </body>
    </html>
  );
}
