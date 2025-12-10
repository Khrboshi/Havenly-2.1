// app/(protected)/layout.tsx

import type { ReactNode } from "react";

/**
 * Protected layout shell
 *
 * - Visual shell only (background + content width).
 * - Auth is handled by SupabaseSessionProvider + page-level guards.
 * - Avoids server-side redirects that can misfire on hard refresh.
 */
export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Main content wrapper (navbar comes from the root layout) */}
      <main className="mx-auto w-full max-w-7xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
