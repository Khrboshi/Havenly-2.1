import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { setUserPlan } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

function isSimulatedUpgradeAllowed() {
  const v = String(process.env.HAVENLY_ALLOW_SIMULATED_UPGRADE ?? "").toLowerCase().trim();
  return v === "1" || v === "true" || v === "yes";
}

export async function POST() {
  // IMPORTANT:
  // This route was previously a "simulated upgrade" and allowed any logged-in user
  // to become PREMIUM without Stripe. That is not production-safe.
  //
  // To temporarily enable for testing, set:
  // HAVENLY_ALLOW_SIMULATED_UPGRADE=true  (in Vercel env vars)
  if (!isSimulatedUpgradeAllowed()) {
    return NextResponse.json(
      { error: "Simulated upgrade is disabled" },
      { status: 403 }
    );
  }

  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only for testing when explicitly enabled.
  await setUserPlan({ supabase, userId: session.user.id, planType: "PREMIUM" });

  return NextResponse.json({ ok: true });
}
