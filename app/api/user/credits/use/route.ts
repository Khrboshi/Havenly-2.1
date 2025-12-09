// app/api/user/credits/use/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { deductCredit, getUserPlan, ensurePlanRow } from "@/lib/userPlan";

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

    await ensurePlanRow(user.id);

    const plan = await getUserPlan(user.id);

    // Premium users effectively have unlimited (we give them 300 but they never run out)
    if (plan.planType === "PREMIUM" || plan.planType === "TRIAL") {
      const result = await deductCredit(user.id, 1);
      return NextResponse.json(result);
    }

    // FREE users must have remaining credits
    if (plan.credits <= 0) {
      return NextResponse.json({
        success: false,
        error: "INSUFFICIENT_CREDITS",
      });
    }

    // Deduct 1 credit
    const result = await deductCredit(user.id, 1);
    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/user/credits/use error:", err);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
