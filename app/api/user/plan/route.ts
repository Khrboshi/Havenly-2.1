export const dynamic = "force-dynamic";  
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { PLAN_CREDIT_ALLOWANCES } from "@/lib/creditRules";

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ plan: null, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch user plan row
    const { data: row, error } = await supabase
      .from("user_plans")
      .select("plan_tier, credits, renewal_date")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("user_plans fetch error:", error);
      return NextResponse.json({ plan: null }, { status: 500 });
    }

    // Default plan for new users
    let planType = row?.plan_tier ?? "FREE";
    let credits = row?.credits ?? PLAN_CREDIT_ALLOWANCES["FREE"];

    return NextResponse.json({
      plan: {
        planType,
        credits,
      },
    });
  } catch (err) {
    console.error("GET /api/user/plan failed:", err);
    return NextResponse.json(
      { plan: null, error: "Internal error" },
      { status: 500 }
    );
  }
}
