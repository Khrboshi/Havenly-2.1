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
 * - Fetches current Supabase session SERVER-SIDE.
 * - Hydrates SupabaseSessionProvider with initialSession for instant sync.
 * - Ensures pixel-perfect dark theme across mobile + desktop.
 * - Prevents duplicate navbar spacing (previous issue).
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
          {/* NAVBAR — sticky with no extra container (fixes white bar issue) */}
          <div className="sticky top-0 z-40">
            <Navbar />
          </div>

          {/* MAIN CONTENT — correct padding & container alignment */}
          <main className="min-h-[calc(100vh-80px)] px-4">
            <div className="mx-auto w-full max-w-7xl pt-10 pb-12">
              {children}
            </div>
          </main>

          <Footer />
          <ToastClient />

          {/* PWA Registration */}
          <ServiceWorkerRegister />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
