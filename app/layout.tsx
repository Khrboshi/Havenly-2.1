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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col bg-slate-950 text-white antialiased">
        <SupabaseSessionProvider>
          <Navbar />

          {/* Page content wrapper */}
          <main className="flex-1 w-full">
            <div className="mx-auto w-full max-w-7xl px-4 pt-10">
              {children}
            </div>
          </main>

          <Footer />

          <ToastClient />
          <PwaInstaller />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
