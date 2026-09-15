import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";

import "./globals.css";

import RouteChrome from "@/components/layout/RouteChrome";

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
    images: [{ url: "/images/hero.png", width: 1600, height: 900, alt: "Mason & Arc" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mason & Arc — Architecture · Design · Execution",
    description: "Architecture, design, and execution by Mason & Arc.",
    images: ["/images/hero.png"],
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
        className={`${inter.variable} ${bebas.variable} antialiased`}
      >
        <RouteChrome>{children}</RouteChrome>
      </body>
    </html>
  );
}