// app/api/user/plan/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type PlanType = "FREE" | "ESSENTIAL" | "PREMIUM";

function toClientPlan(planType: PlanType) {
  const premium = planType === "PREMIUM";
  const essential = planType === "ESSENTIAL";
  return {
    plan: planType.toLowerCase() as "free" | "essential" | "premium",
    premium,
    essential,
  };
}

/**
 * GET /api/user/plan
 * Returns a normalized shape for useUserPlan:
 * {
 *   authenticated,
 *   planType,
 *   plan,
 *   premium,
 *   essential,
 *   credits,
 *   renewalDate
 * }
 */
export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    // Not authenticated → treat as free, no credits
    return NextResponse.json({
      authenticated: false,
      planType: "FREE",
      plan: "free",
      premium: false,
      essential: false,
      credits: 0,
      renewalDate: null,
    });
  }

  try {
    const { data: planRow, error: planError } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Default values if no row yet
    let planType: PlanType = "FREE";
    let credits = 0;
    let renewalDate: string | null = null;

    if (!planError && planRow) {
      planType = (planRow.plan_type as PlanType) || "FREE";
      credits = planRow.credits_balance ?? 0;
      renewalDate = planRow.renewal_date ?? null;
    }

    const clientPlan = toClientPlan(planType);

    return NextResponse.json({
      authenticated: true,
      planType,
      ...clientPlan,
      credits,
      renewalDate,
    });
  } catch (err) {
    console.error("Error in GET /api/user/plan:", err);
    return NextResponse.json(
      {
        authenticated: true,
        planType: "FREE",
        plan: "free",
        premium: false,
        essential: false,
        credits: 0,
        renewalDate: null,
        error: "Unable to load plan information.",
      },
      { status: 500 }
    );
  }
}
