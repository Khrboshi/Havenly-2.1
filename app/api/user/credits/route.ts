import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/userPlan";
import { getMonthlyLimit } from "@/lib/creditRules";

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

    // FIX: getUserPlan only accepts userId
    const planRow = await getUserPlan(user.id);

    if (!planRow) {
      return NextResponse.json(
        { success: false, error: "NO_PLAN_FOUND" },
        { status: 404 }
      );
    }

    const limit = getMonthlyLimit(planRow.plan_tier);

    return NextResponse.json({
      success: true,
      plan: planRow.plan_tier,
      monthly_limit: limit,
      used: planRow.used_reflections,
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

    const limit = getMonthlyLimit(planRow.plan_tier);

    if (planRow.used_reflections >= limit) {
      return NextResponse.json(
        { success: false, error: "INSUFFICIENT_CREDITS" },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("user_plans")
      .update({ used_reflections: planRow.used_reflections + 1 })
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
