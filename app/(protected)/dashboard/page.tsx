import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id;

  if (!userId) redirect("/magic-login?reason=not_authenticated");

  return <DashboardClient userId={userId} />;
}
