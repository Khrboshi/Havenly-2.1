// app/api/user/credits/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
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

    // Read from user_plans (your existing table)
    const { data: planRow, error: planError } = await supabase
      .from("user_plans")
      .select("plan_type, credits_balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (planError) {
      console.error("Error fetching user_plans in GET /credits:", planError);
      return NextResponse.json(
        { error: "Could not load current credits." },
        { status: 500 }
      );
    }

    const planType = (planRow?.plan_type || "FREE") as string;
    const creditsBalance = planRow?.credits_balance ?? 0;

    const isPremium = planType === "PREMIUM";

    return NextResponse.json(
      {
        planType,
        isPremium,
        credits: isPremium ? "UNLIMITED" : creditsBalance,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error in GET /api/user/credits:", err);
    return NextResponse.json(
      { error: "Unexpected error while loading credits." },
      { status: 500 }
    );
  }
}
