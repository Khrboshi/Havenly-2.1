import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ToastClient from "./components/ToastClient";
import { SupabaseSessionProvider } from "./components/SupabaseSessionProvider";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import { createServerSupabase } from "@/lib/supabase/server";

const SITE_URL = "https://havenly-2-1.vercel.app";
const DESCRIPTION =
  "Havenly is a calm, private journaling companion with gentle AI reflections.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Havenly",
    template: "%s · Havenly",
  },

  description: DESCRIPTION,

  // ✅ This is the ONLY thing fixing your logo + favicon
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },

  manifest: "/manifest.json",

  openGraph: {
    title: "Havenly",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Havenly",
    type: "website",
    images: ["/icon.svg"],
  },

  twitter: {
    card: "summary",
    title: "Havenly",
    description: DESCRIPTION,
    images: ["/icon.svg"],
  },
};

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
          <div className="sticky top-0 z-40">
            <Navbar />
          </div>

          <main className="min-h-[calc(100vh-80px)] px-4">
            <div className="mx-auto w-full max-w-7xl pt-10 pb-12">
              {children}
            </div>
          </main>

          <Footer />
          <ToastClient />
          <ServiceWorkerRegister />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
