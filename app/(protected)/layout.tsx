// app/(protected)/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import SessionHeartbeat from "@/app/components/auth/SessionHeartbeat";

export const dynamic = "force-dynamic";

/**
 * Protected layout
 * - Runs on the server
 * - Ensures there is an active Supabase session
 * - If not authenticated → redirects to /magic-login
 * - Keeps the session alive in the background via SessionHeartbeat
 *
 * This layout applies only to the (protected) group:
 *   /dashboard, /journal, /settings, /tools, /insights, etc.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/magic-login");
  }

  return (
    <>
      {/* Keep Supabase session alive while user is on protected pages */}
      <SessionHeartbeat />
      {children}
    </>
  );
}
