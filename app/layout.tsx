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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-950">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <SupabaseSessionProvider>
          {/* Global navigation with live auth + plan state */}
          <Navbar />

          {/* Main content wrapper */}
          <main className="min-h-[calc(100vh-80px)]">
            <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-10">
              {children}
            </div>
          </main>

          {/* Global footer and utilities */}
          <Footer />
          <ToastClient />
          <PwaInstaller />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
