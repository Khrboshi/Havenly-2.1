// app/api/user/credits/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/userPlan";

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

    const planRow = await getUserPlan(supabase, user.id);

    if (!planRow) {
      return NextResponse.json(
        {
          planType: "FREE",
          credits: 0,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        planType: planRow.plan_type ?? "FREE",
        credits: planRow.credits_balance ?? 0,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/user/credits error:", err);
    return NextResponse.json(
      { error: "Failed to load credits." },
      { status: 500 }
    );
  }
}
