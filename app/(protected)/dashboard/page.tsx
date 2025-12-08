export const dynamic = "force-dynamic";

import { createServerSupabase } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Middleware should catch this, but this is a final guarantee
    return null;
  }

  return <DashboardClient userId={user.id} />;
}
