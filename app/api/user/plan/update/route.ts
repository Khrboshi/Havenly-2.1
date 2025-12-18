import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const targetPlan = body?.plan;

  if (!["FREE", "TRIAL", "PREMIUM"].includes(targetPlan)) {
    return NextResponse.json(
      { error: "Invalid plan type" },
      { status: 400 }
    );
  }

  /**
   * 🔒 SINGLE SOURCE OF TRUTH — user_credits
   */
  const { error } = await supabase
    .from("user_credits")
    .upsert(
      {
        user_id: userId,
        plan_type: targetPlan,
        // Optional but recommended reset logic
        credits_remaining:
          targetPlan === "PREMIUM"
            ? 9999
            : targetPlan === "TRIAL"
            ? 10
            : 3,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) {
    console.error("Plan update failed:", error);
    return NextResponse.json(
      { error: "Failed to update plan" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
