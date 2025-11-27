// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import ClientNavWrapper from "@/components/ClientNavWrapper";
import PwaInstaller from "@/app/pwa-installer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Havenly 2.1",
  description:
    "A calm space to understand your day through gentle AI reflections.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientNavWrapper>
          <SiteHeader />
        </ClientNavWrapper>

        <main>{children}</main>

        <Footer />

        {/* Mobile-only PWA installer */}
        <PwaInstaller />
      </body>
    </html>
  );
}
