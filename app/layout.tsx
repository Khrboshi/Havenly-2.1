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
 * Root layout:
 * - Fetches the current Supabase session on the SERVER.
 * - Passes that session into SupabaseSessionProvider so the client
 *   starts fully in-sync with the server/auth state.
 * - Renders the public Navbar + footer + PWA helpers.
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
          {/* Sticky navbar */}
          <div className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
            <Navbar />
          </div>

          {/* Main content */}
          <main className="min-h-[calc(100vh-80px)]">
            <div className="mx-auto w-full max-w-7xl px-4 pt-10 pb-12">
              {children}
            </div>
          </main>

          <Footer />
          <ToastClient />

          {/* PWA Registration ONLY — safe to keep */}
          <ServiceWorkerRegister />

          {/* Removed intrusive PWA install banners:
              - AddToHomeScreenPrompt
              - PwaPrompt
              - PwaInstallHint
              These were causing UI overlap and hurting conversions. */}
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
