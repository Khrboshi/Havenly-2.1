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

  // Simulated upgrade until real payments are wired.
  await setUserPlan({ supabase, userId: session.user.id, planType: "PREMIUM" });

  return NextResponse.json({ ok: true });
}
