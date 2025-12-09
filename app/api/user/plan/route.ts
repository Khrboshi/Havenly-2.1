// app/api/user/plan/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

/**
 * Normalizes planType into the format expected by useUserPlan.
 */
function normalizePlan(plan: any): PlanType {
  const up = typeof plan === "string" ? plan.toUpperCase() : "FREE";
  if (up === "PREMIUM") return "PREMIUM";
  if (up === "TRIAL") return "TRIAL";
  return "FREE";
}

/**
 * GET /api/user/plan
 * → Source of truth for all Free / Trial / Premium logic.
 */
export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Not authenticated → treat as Free user
  if (userError || !user) {
    return NextResponse.json({
      authenticated: false,
      planType: "FREE",
      plan: "FREE",
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

    // Defaults for new users
    let planType: PlanType = "FREE";
    let credits = 0;
    let renewalDate: string | null = null;

    if (!planError && planRow) {
      planType = normalizePlan(planRow.plan_type);
      credits = typeof planRow.credits_balance === "number" ? planRow.credits_balance : 0;
      renewalDate = planRow.renewal_date ?? null;
    }

    return NextResponse.json({
      authenticated: true,
      planType,
      plan: planType, // backward compatibility for UI
      credits,
      renewalDate,
    });
  } catch (err) {
    console.error("GET /api/user/plan error:", err);

    return NextResponse.json(
      {
        authenticated: true,
        planType: "FREE",
        plan: "FREE",
        credits: 0,
        renewalDate: null,
        error: "Unable to load plan information.",
      },
      { status: 500 }
    );
  }
}
