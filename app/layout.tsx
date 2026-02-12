// app/layout.tsx
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
  title: "Havenly",
  description: "A calm, private journaling companion with gentle AI reflections.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }]
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabase();
  const {
    data: { session }
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
