import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/userPlan";
import { PLAN_CREDIT_ALLOWANCES } from "@/lib/creditRules";

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "NOT_AUTHENTICATED" },
        { status: 401 }
      );
    }

    const planRow = await getUserPlan(user.id);

    if (!planRow) {
      return NextResponse.json(
        { success: false, error: "NO_PLAN_FOUND" },
        { status: 404 }
      );
    }

    // FIX: plan tier is planRow.planType
    const monthlyLimit = PLAN_CREDIT_ALLOWANCES[planRow.planType];

    return NextResponse.json({
      success: true,
      plan: planRow.planType,
      monthly_limit: monthlyLimit,
      used: planRow.credits,          // FIXED
      renewal_date: planRow.renewalDate,  // FIXED
    });
  } catch (err) {
    console.error("Credits GET error:", err);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "NOT_AUTHENTICATED" },
        { status: 401 }
      );
    }

    const planRow = await getUserPlan(user.id);

    if (!planRow) {
      return NextResponse.json(
        { success: false, error: "NO_PLAN_FOUND" },
        { status: 404 }
      );
    }

    const monthlyLimit = PLAN_CREDIT_ALLOWANCES[planRow.planType];

    // planRow.credits = used_reflections
    if (planRow.credits >= monthlyLimit) {
      return NextResponse.json(
        { success: false, error: "INSUFFICIENT_CREDITS" },
        { status: 403 }
      );
    }

    // increment used reflections
    const { error } = await supabase
      .from("user_plans")
      .update({
        credits: planRow.credits + 1,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Credit deduction error:", error);
      return NextResponse.json(
        { success: false, error: "UPDATE_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Credits POST error:", err);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
