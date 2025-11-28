import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import ClientNavWrapper from "./components/ClientNavWrapper";
import SiteHeader from "./components/SiteHeader";
import PwaInstallHint from "./components/PwaInstallHint";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Havenly Journal",
  description: "A gentle journaling experience designed to help you breathe deeper and feel lighter.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* NAVIGATION WRAPPER + HEADER */}
        <ClientNavWrapper>
          <SiteHeader />
        </ClientNavWrapper>

        {/* MOBILE-ONLY INSTALL BANNER */}
        <PwaInstallHint />

        {/* MAIN CONTENT */}
        {children}
      </body>
    </html>
  );
}
