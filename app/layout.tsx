import "./globals.css";
import type { Metadata } from "next";

import SmoothScroll from "../components/SmoothScroll";
import Cursor from "../components/Cursor";

export const metadata: Metadata = {
  title: "Studio",
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