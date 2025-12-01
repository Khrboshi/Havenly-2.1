import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type PlanType = "FREE" | "ESSENTIAL" | "PREMIUM";

function toClientPlan(planType: PlanType): {
  plan: string;
  premium: boolean;
  essential: boolean;
} {
  const premium = planType === "PREMIUM";
  const essential = planType === "ESSENTIAL";
  return {
    plan: planType.toLowerCase(), // keeps existing behaviour: "free"
    premium,
    essential,
  };
}

export async function GET() {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Not authenticated – keep a safe, non-breaking response
    if (userError || !user) {
      return NextResponse.json(
        {
          authenticated: false,
          plan: "free",
          planType: "FREE",
          premium: false,
          essential: false,
          credits: 0,
          renewalDate: null,
          stripeConnected: false,
          message: "Not signed in. You are currently on the free plan.",
        },
        { status: 200 }
      );
    }

    // Fetch or auto-create user_plans row
    const { data: existingPlan, error: planError } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    let planRow = existingPlan;

    if (planError) {
      console.error("Error fetching user_plans:", planError);
    }

    // If no row yet, create FREE by default
    if (!planRow) {
      const { data: inserted, error: insertError } = await supabase
        .from("user_plans")
        .insert({
          user_id: user.id,
          plan_type: "FREE",
          credits_balance: 0,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting default FREE plan:", insertError);
        // Fallback safe response
        return NextResponse.json(
          {
            authenticated: true,
            plan: "free",
            planType: "FREE",
            premium: false,
            essential: false,
            credits: 0,
            renewalDate: null,
            stripeConnected: false,
            message:
              "Unable to load full plan details. Defaulting to free plan.",
          },
          { status: 200 }
        );
      }

      planRow = inserted;
    }

    const planType = (planRow.plan_type || "FREE") as PlanType;
    const credits = planRow.credits_balance ?? 0;
    const renewalDate = planRow.renewal_date ?? null;

    const clientPlan = toClientPlan(planType);

    return NextResponse.json(
      {
        authenticated: true,
        plan: clientPlan.plan, // "free" | "essential" | "premium"
        planType, // "FREE" | "ESSENTIAL" | "PREMIUM"
        premium: clientPlan.premium,
        essential: clientPlan.essential,
        credits,
        renewalDate,
        stripeConnected: false, // placeholder for future Stripe integration
        message:
          planType === "FREE"
            ? "You are currently on the free plan."
            : `You are on the ${clientPlan.plan} plan.`,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error in GET /api/user/plan:", err);
    return NextResponse.json(
      {
        authenticated: false,
        plan: "free",
        planType: "FREE",
        premium: false,
        essential: false,
        credits: 0,
        renewalDate: null,
        stripeConnected: false,
        message: "An unexpected error occurred while loading your plan.",
      },
      { status: 500 }
    );
  }
}
