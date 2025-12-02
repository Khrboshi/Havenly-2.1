import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

import SiteHeader from "@/app/components/SiteHeader";
import ToastClient from "@/app/components/ToastClient";
import PwaInstallHint from "@/app/components/PwaInstallHint";
import { SupabaseSessionProvider } from "@/app/components/SupabaseSessionProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Havenly 2.1 – Gentle AI journaling",
  description:
    "Havenly is a calm micro-journal with gentle AI reflections—no streaks, no feed, and no pressure to be productive.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-hvn-bg text-hvn-text-primary`}>
        <div className="pointer-events-none fixed inset-0 -z-10 bg-hvn-page-gradient" />

        {/* 🔥 Global Supabase Session Provider */}
        <SupabaseSessionProvider>
          {/* Header */}
          <SiteHeader />

          {/* Install hint */}
          <PwaInstallHint />

          {/* Page content */}
          <main className="min-h-[calc(100vh-3.5rem)] pb-16 pt-4">
            {children}
          </main>

          <ToastClient />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
