export const dynamic = "force-dynamic";

import { createServerSupabase } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Middleware should normally redirect, but this is a final safety net.
    return null;
  }

  return <DashboardClient userId={user.id} />;
}
