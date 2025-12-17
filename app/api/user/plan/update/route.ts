// app/api/user/plan/update/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPlanRaw = (body.plan || "free") as string;

    const allowedPlans = ["FREE", "PREMIUM", "TRIAL"];
    let newPlan = newPlanRaw.toUpperCase();
    if (!allowedPlans.includes(newPlan)) {
      newPlan = "FREE";
    }

    const supabase = createServerSupabase();

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

    // Preserve existing behavior
    const { error: upsertPlanError } = await supabase
      .from("user_plans")
      .upsert(
        {
          user_id: user.id,
          plan_type: newPlan,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertPlanError) {
      console.error("Plan upsert error:", upsertPlanError.message);
      return NextResponse.json(
        { error: upsertPlanError.message },
        { status: 500 }
      );
    }

    // Keep canonical table aligned as well (best-effort, non-breaking)
    try {
      await supabase
        .from("user_credits")
        .upsert(
          {
            user_id: user.id,
            plan_type: newPlan,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
    } catch {
      // Do not fail the request if user_credits is not available in this environment.
    }

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (e) {
    console.error("Plan update error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
