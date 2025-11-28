import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import PwaInstallHint from "./components/PwaInstallHint";

export const metadata: Metadata = {
  title: "Havenly 2.1",
  description: "A calmer, kinder journaling experience.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[var(--brand-bg)] text-[var(--brand-text)] antialiased">
        <SiteHeader />

        {/* Floating mobile install prompt */}
        <PwaInstallHint />

        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
