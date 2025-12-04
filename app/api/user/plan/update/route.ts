// app/api/user/plan/update/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newPlan = body.plan || "free";

    const supabase = await createServerSupabase(); // IMPORTANT: await

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

    // Update user plan
    const { error: updateError } = await supabase
      .from("user_plans")
      .update({
        plan_type: newPlan.toUpperCase(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (e) {
    console.error("Plan update error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
