// app/api/user/plan/update/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPlanRaw = (body.plan || "free") as string;

    // Normalize & constrain the plan
    const allowedPlans = ["FREE", "PREMIUM", "TRIAL"];
    let newPlan = newPlanRaw.toUpperCase();
    if (!allowedPlans.includes(newPlan)) {
      newPlan = "FREE";
    }

    const supabase = createServerSupabase();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Upsert user plan so new users are handled as well
    const { error: upsertError } = await supabase
      .from("user_plans")
      .upsert(
        {
          user_id: user.id,
          plan_type: newPlan,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) {
      console.error("Plan upsert error:", upsertError.message);
      return NextResponse.json(
        { error: upsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (e) {
    console.error("Plan update error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
