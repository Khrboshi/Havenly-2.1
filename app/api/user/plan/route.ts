export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { PLAN_CREDIT_ALLOWANCES } from "@/lib/creditRules";

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    // Always refresh session cookie boundary
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    // If session not ready yet → return temporary default instead of 401
    if (!session?.user) {
      return NextResponse.json({
        plan: {
          planType: "FREE",
          credits: PLAN_CREDIT_ALLOWANCES["FREE"],
        },
        sessionPending: true,
      });
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
      return NextResponse.json({ 
        plan: {
          planType: "FREE",
          credits: PLAN_CREDIT_ALLOWANCES["FREE"]
        }
      });
    }

    const planType = row?.plan_tier ?? "FREE";
    const credits = row?.credits ?? PLAN_CREDIT_ALLOWANCES["FREE"];

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
