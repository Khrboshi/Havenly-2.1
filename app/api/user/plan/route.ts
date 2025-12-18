import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

/* -----------------------------------------
   GET → READ PLAN + CREDITS (USED BY UI)
------------------------------------------ */
export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { planType: "FREE", plan: "FREE", credits: 0, renewalDate: null },
      { status: 200 }
    );
  }

  // Ensure FREE users get monthly credits
  await ensureCreditsFresh({ supabase, userId: user.id });

  const { data } = await supabase
    .from("user_credits")
    .select("plan_type, credits")
    .eq("user_id", user.id)
    .maybeSingle();

  const planType: PlanType =
    data?.plan_type === "PREMIUM" || data?.plan_type === "TRIAL"
      ? data.plan_type
      : "FREE";

  return NextResponse.json({
    planType,
    plan: planType, // backward compatibility
    credits: typeof data?.credits === "number" ? data.credits : 0,
    renewalDate: null,
  });
}

/* -----------------------------------------
   POST → UPDATE PLAN (BILLING PAGE)
------------------------------------------ */
export async function POST(req: Request) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const targetPlan = body?.plan as PlanType;

  if (!["FREE", "TRIAL", "PREMIUM"].includes(targetPlan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const credits =
    targetPlan === "PREMIUM" ? 9999 : targetPlan === "TRIAL" ? 10 : 3;

  const { error } = await supabase.from("user_credits").upsert(
    {
      user_id: session.user.id,
      plan_type: targetPlan,
      credits,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("Plan update failed:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
