import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { setUserPlan } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // NOTE: This is still a simulated upgrade until you wire real payment confirmation.
  // But it now updates the canonical plan + credits correctly.
  await setUserPlan({ supabase, userId, planType: "PREMIUM" });

  return NextResponse.json({ ok: true });
}
