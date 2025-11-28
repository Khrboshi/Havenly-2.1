import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import PwaInstallHint from "./components/PwaInstallHint";

export const metadata: Metadata = {
  title: "Havenly",
  description: "Gentle journaling and mindful reflection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text)] antialiased">

        <SiteHeader />

        {/* Mobile Install Prompt */}
        <PwaInstallHint />

        <main className="pt-6 pb-20">{children}</main>
      </body>
    </html>
  );
}
