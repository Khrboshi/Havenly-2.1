// app/(protected)/layout.tsx
import type { ReactNode } from "react";

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

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {children}
    </div>
  );
}
