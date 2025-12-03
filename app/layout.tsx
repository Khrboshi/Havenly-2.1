// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "./components/Navbar";
import ToastClient from "./components/ToastClient";
import { SupabaseSessionProvider } from "./components/SupabaseSessionProvider";
import PwaInstaller from "./pwa-installer";

export const metadata: Metadata = {
  title: "Havenly 2.1",
  description:
    "A calm, private journaling companion with gentle AI reflections—no streaks, no feeds, no pressure.",
};

/**
 * Root layout
 * - Public for all routes
 * - Provides Supabase session context for client components
 * - Renders shared navigation + PWA helpers
 * NOTE: Authentication protection lives in:
 *   - app/(protected)/layout.tsx
 *   - middleware.ts (session sync)
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        <SupabaseSessionProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
          <ToastClient />
          <PwaInstaller />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
