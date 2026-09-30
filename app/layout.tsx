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
  title: { default: "Mason & Arc — Architecture · Design · Execution", template: "%s | Mason & Arc" },
  description: "Mason & Arc is an architecture, design, and execution studio developing spaces through design, material, and delivery.",
  applicationName: "Mason & Arc",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Mason & Arc",
    title: "Mason & Arc — Architecture · Design · Execution",
    description: "Architecture, design, and execution by Mason & Arc.",
    images: [{ url: "/api/public/website-home-hero/image?v=20260930", width: 1536, height: 1024, alt: "Mason & Arc — Architecture · Design · Execution" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mason & Arc — Architecture · Design · Execution",
    description: "Architecture, design, and execution by Mason & Arc.",
    images: ["/api/public/website-home-hero/image?v=20260930"],
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
