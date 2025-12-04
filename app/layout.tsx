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
 * - Navbar + Footer on all public pages
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
        <SupabaseSessionProvider>
          <Navbar />

          {/* Page content */}
          <main className="pt-16 flex-1">{children}</main>

          {/* Global footer (public only) */}
          <Footer />

          {/* Global utilities */}
          <ToastClient />
          <PwaInstaller />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
