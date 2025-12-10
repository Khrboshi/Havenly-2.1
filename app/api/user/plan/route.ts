export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { PLAN_CREDIT_ALLOWANCES } from "@/lib/creditRules";

export async function GET() {
  try {
    const supabase = await createServerSupabase();

    // Always attempt to read the session cookie
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If no session → treat user as FREE (but do not error)
    if (!session?.user) {
      return NextResponse.json({
        planType: "FREE",
        credits: PLAN_CREDIT_ALLOWANCES["FREE"],
        renewalDate: null,
      });
    }

    const userId = session.user.id;

    // Fetch user's plan
    const { data: row, error } = await supabase
      .from("user_plans")
      .select("plan_tier, credits, renewal_date")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("user_plans fetch error:", error);
      return NextResponse.json({
        planType: "FREE",
        credits: PLAN_CREDIT_ALLOWANCES["FREE"],
        renewalDate: null,
      });
    }

    const planType = row?.plan_tier ?? "FREE";
    const credits = row?.credits ?? PLAN_CREDIT_ALLOWANCES["FREE"];

    return NextResponse.json({
      planType,
      credits,
      renewalDate: row?.renewal_date ?? null,
    });
  } catch (err) {
    console.error("GET /api/user/plan failed:", err);
    return NextResponse.json(
      {
        planType: "FREE",
        credits: PLAN_CREDIT_ALLOWANCES["FREE"],
        renewalDate: null,
      },
      { status: 200 }
    );
  }
}
