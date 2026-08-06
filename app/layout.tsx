import "./globals.css";
import type { Metadata } from "next";

import Cursor from "../components/ui/Cursor";
import SmoothScroll from "../components/ui/SmoothScroll";

export const metadata = {
  title: "MASON & ARC",
  description: "Architecture Studio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Cursor />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}