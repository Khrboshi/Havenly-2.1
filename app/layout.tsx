// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastClient from "./components/ToastClient";
import { SupabaseSessionProvider } from "./components/SupabaseSessionProvider";
import PwaInstaller from "./pwa-installer";

export const metadata: Metadata = {
  title: "Havenly 2.1",
  description:
    "A calm, private journaling companion with gentle AI reflections.",
  manifest: "/manifest.json",
  themeColor: "#4CA7A3",
};

/**
 * PUBLIC ROOT LAYOUT
 * - No redirects
 * - No auth checks
 * - Global Supabase session context
 * - PWA meta tags for Android + iOS
 * - Navbar + Footer included globally
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Standard PWA configuration */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4CA7A3" />

        {/* iOS PWA requirements */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/pwa/icon-192.png" />

        {/* Fallback icons */}
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
        <SupabaseSessionProvider>
          <Navbar />

          {/* Page content */}
          <main className="pt-16 flex-1">{children}</main>

          {/* Global footer */}
          <Footer />

          {/* Global utilities */}
          <ToastClient />
          <PwaInstaller />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
