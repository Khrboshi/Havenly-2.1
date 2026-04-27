/**
 * app/(protected)/layout.tsx
 *
 * Shell layout for all authenticated routes.
 * Renders the Navbar, main content area, and Footer.
 * Auth enforcement is handled by middleware — this layout is visual only.
 */
import type { ReactNode } from "react";
import { getRequestTranslations } from "@/app/lib/i18n/server";

/**
 * Protected layout (visual shell only)
 *
 * - NO server-side auth check here.
 * - NO extra Supabase provider (root layout already wraps the app).
 * - This prevents accidental logouts on hard refresh (CTRL+F5),
 *   because the server no longer redirects before the client
 *   has a chance to recover the Supabase session.
 */
export const dynamic = "force-dynamic";

// Add metadata for protected routes
export const metadata = {
  robots: {
    index: false, // Prevent search engines from indexing protected pages
    follow: false,
  },
};

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getRequestTranslations();
  return (
    <div className="min-h-screen bg-qm-bg text-qm-primary">
      {/*
        Accessibility: Announce that this is a protected area
        This is a visual-only indicator for screen readers
      */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t.ui.protectedAreaSRLabel}
      </div>

      {children}
    </div>
  );
}
