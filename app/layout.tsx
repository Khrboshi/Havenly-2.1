import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastClient from "./components/ToastClient";
import { SupabaseSessionProvider } from "./components/SupabaseSessionProvider";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Havenly 2.1",
  description:
    "Havenly is a calm, private journaling companion with gentle AI reflections.",
};

/**
 * Corrected Root Layout:
 * - Preserves ALL existing features (footer, PWA, toasts, SSR session)
 * - Fixes Navbar white bar issue
 * - Ensures pixel-perfect desktop/mobile alignment
 * - Fixes Dashboard “loading forever”
 * - Removes double headers and layout shifts
 */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className="h-full bg-slate-950">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <SupabaseSessionProvider initialSession={session}>

          {/* TRUE global navbar — no extra wrapper that breaks layout */}
          <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
            <div className="mx-auto w-full max-w-7xl px-4 py-3">
              <Navbar />
            </div>
          </header>

          {/* Main content — FIXED padding and spacing */}
          <main className="min-h-[calc(100vh-80px)] mx-auto w-full max-w-7xl px-4 py-10">
            {children}
          </main>

          <Footer />
          <ToastClient />
          <ServiceWorkerRegister />

        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
