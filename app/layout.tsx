import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastClient from "./components/ToastClient";
import { SupabaseSessionProvider } from "./components/SupabaseSessionProvider";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Havenly",
  description: "A calm, private journaling companion with gentle AI reflections.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/pwa/icon-192.png" }],
    apple: [{ url: "/pwa/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className="h-full bg-slate-950">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <SupabaseSessionProvider initialSession={session}>
          <div className="sticky top-0 z-40">
            <Navbar />
          </div>

          <main className="min-h-[calc(100vh-80px)] px-4">
            <div className="mx-auto w-full max-w-7xl pt-10 pb-12">{children}</div>
          </main>

          <Footer />
          <ToastClient />
          <ServiceWorkerRegister />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
