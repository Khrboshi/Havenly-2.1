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
    "A gentle journaling companion that helps you understand your day without pressure, streaks, or productivity hacks.",
};

/**
 * Root layout
 * - Applies global styles
 * - Provides Supabase session context for client components (Navbar, dashboard, etc.)
 * - Renders shared UI (navbar, toasts, PWA helpers)
 * NOTE: No auth checks here – authentication is handled in:
 *   - middleware.ts (for protected routes)
 *   - app/(protected)/layout.tsx (server-side redirect if no session)
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-950 text-white antialiased">
        <SupabaseSessionProvider>
          {/* Global navigation with live Supabase session */}
          <Navbar />

          {/* Main content area – padded for navbar height */}
          <main className="pt-16">{children}</main>

          {/* Global helpers */}
          <ToastClient />
          <PwaInstaller />
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
