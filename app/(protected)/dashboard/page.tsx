import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  // ✅ getSession reads from cookie locally — no network call
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect("/magic-login?reason=not_authenticated");

  return <DashboardClient userId={session.user.id} />;
}
