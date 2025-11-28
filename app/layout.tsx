// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

import ClientNavWrapper from "./components/ClientNavWrapper";
import SiteHeader from "./components/SiteHeader";
import ToastClient from "./components/ToastClient";
import PwaInstallHint from "./components/PwaInstallHint";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Havenly 2.1 – Gentle AI journaling",
  description:
    "Havenly is a calm micro-journal with gentle AI reflections. Write a few honest lines, see what really mattered, and feel a little lighter.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased bg-hvn-bg text-hvn-text-primary`}
      >
        {/* Global background glow */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-hvn-page-gradient" />

        {/* Top navigation + logo */}
        <ClientNavWrapper>
          <SiteHeader />
        </ClientNavWrapper>

        {/* Mobile-only floating install hint */}
        <PwaInstallHint />

        {/* Page content */}
        <main className="min-h-[calc(100vh-3.5rem)] pb-16 pt-4">
          {children}
        </main>

        {/* Toasts / toasts from existing system */}
        <ToastClient />
      </body>
    </html>
  );
}
