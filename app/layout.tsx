import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastClient from "./components/ToastClient";
import { SupabaseSessionProvider } from "./components/SupabaseSessionProvider";
import AddToHomeScreenPrompt from "./components/AddToHomeScreenPrompt";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import PwaPrompt from "./components/PwaPrompt";
import PwaInstallHint from "./components/PwaInstallHint";

export const metadata: Metadata = {
  title: "Havenly 2.1",
  description:
    "Havenly is a calm, private journaling companion with gentle AI reflections.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-950">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {/* Provider ensures all client components get correct session on first paint */}
        <SupabaseSessionProvider>
          {/* Sticky navbar */}
          <div className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
            <Navbar />
          </div>

          {/* Page content */}
          <main className="min-h-[calc(100vh-80px)]">
            <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-12">
              {children}
            </div>
          </main>

          <Footer />
          <ToastClient />
          <AddToHomeScreenPrompt />
          <ServiceWorkerRegister />
          <PwaPrompt />
          <PwaInstallHint />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
