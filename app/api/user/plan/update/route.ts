import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type PlanType = "FREE" | "ESSENTIAL" | "PREMIUM";

const VALID_PLANS: PlanType[] = ["FREE", "ESSENTIAL", "PREMIUM"];

function toClientPlan(planType: PlanType) {
  const premium = planType === "PREMIUM";
  const essential = planType === "ESSENTIAL";
  return {
    plan: planType.toLowerCase(),
    premium,
    essential,
  };
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const requestedPlan = String(body.planType || "").toUpperCase() as PlanType;
    const reason = body.reason ? String(body.reason) : null;

    if (!VALID_PLANS.includes(requestedPlan)) {
      return NextResponse.json(
        { error: "Invalid planType. Use FREE, ESSENTIAL, or PREMIUM." },
        { status: 400 }
      );
    }

    // Fetch existing plan row
    const { data: existing, error: fetchError } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching user_plans in update:", fetchError);
      return NextResponse.json(
        { error: "Could not fetch existing plan." },
        { status: 500 }
      );
    }

    const oldPlanType = (existing?.plan_type || "FREE") as PlanType;

    // Calculate renewal date (simple 30 days logic for non-FREE)
    const renewalDate =
      requestedPlan === "FREE"
        ? null
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Update or insert plan
    const { data: updated, error: updateError } = await supabase
      .from("user_plans")
      .upsert(
        {
          user_id: user.id,
          plan_type: requestedPlan,
          renewal_date: renewalDate,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (updateError || !updated) {
      console.error("Error updating user_plans:", updateError);
      return NextResponse.json(
        { error: "Failed to update plan." },
        { status: 500 }
      );
    }

    // Log plan change in plan_history
    const { error: historyError } = await supabase
      .from("plan_history")
      .insert({
        user_id: user.id,
        old_plan_type: oldPlanType,
        new_plan_type: requestedPlan,
        reason: reason || `User changed plan to ${requestedPlan}`,
        changed_by: "USER",
      });

    if (historyError) {
      console.error("Error inserting into plan_history:", historyError);
    }

    const clientPlan = toClientPlan(requestedPlan);

    return NextResponse.json(
      {
        success: true,
        plan: clientPlan.plan,
        planType: requestedPlan,
        premium: clientPlan.premium,
        essential: clientPlan.essential,
        credits: updated.credits_balance ?? 0,
        renewalDate: updated.renewal_date,
        message: `Your plan has been updated to ${clientPlan.plan}.`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error in POST /api/user/plan/update:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while updating your plan.",
      },
      { status: 500 }
    );
  }
}
