export const dynamic = "force-dynamic";

import "./globals.css";
import Navbar from "./components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Havenly",
  description: "A calm space to reflect",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <Navbar />
        <main className="pt-10">{children}</main>
      </body>
    </html>
  );
}
