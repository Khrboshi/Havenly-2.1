import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

/**
 * Server-side Dashboard page.
 *
 * - Reads the Supabase session on the server.
 * - Redirects to /magic-login if there is no authenticated user.
 * - Passes the userId to the client DashboardClient component.
 *
 * This avoids the "Loading your dashboard..." infinite state that
 * happened when we depended purely on the client context.
 */
export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user?.id;

  if (!userId) {
    // Safety redirect (ProtectedLayout should already enforce this,
    // but we keep it here as a guard so the page never hangs).
    redirect("/magic-login");
  }

  return <DashboardClient userId={userId} />;
}
