// app/api/user/plan/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

function safeJson(data: {
  planType: PlanType;
  credits: number;
  renewalDate: string | null;
}) {
  return NextResponse.json(
    {
      planType: data.planType,
      plan: data.planType, // backwards compatibility
      credits: data.credits,
      renewalDate: data.renewalDate,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

/**
 * /api/user/plan
 *
 * Goal:
 * - Never return 500 to the client.
 * - If DB tables/columns differ, fall back to FREE safely.
 * - Normalize output for useUserPlan + Premium gating.
 *
 * Optional DB support:
 * - If you have a table like `user_plans` with:
 *   user_id, plan_type, credits, renewal_date
 * - Or a `profiles` table with:
 *   id, plan_type, credits, renewal_date
 *
 * If neither exists, this still works (FREE fallback).
 */
export async function GET() {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userErr,
    покаж }} = await supabase.auth.getUser();

    if (userErr || !user) {
      // Not logged in -> FREE
      return safeJson({ planType: "FREE", credits: 0, renewalDate: null });
    }

    // 1) Try user_plans
    try {
      const { data, error } = await supabase
        .from("user_plans")
        .select("plan_type, credits, renewal_date")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        const planType = String(data.plan_type || "FREE").toUpperCase() as PlanType;
        const credits = typeof data.credits === "number" ? data.credits : 0;
        const renewalDate =
          typeof data.renewal_date === "string" ? data.renewal_date : null;

        return safeJson({
          planType: planType === "PREMIUM" || planType === "TRIAL" ? planType : "FREE",
          credits,
          renewalDate,
        });
      }
    } catch {
      // ignore and fall through
    }

    // 2) Try profiles
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("plan_type, credits, renewal_date")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        const planType = String(data.plan_type || "FREE").toUpperCase() as PlanType;
        const credits = typeof data.credits === "number" ? data.credits : 0;
        const renewalDate =
          typeof data.renewal_date === "string" ? data.renewal_date : null;

        return safeJson({
          planType: planType === "PREMIUM" || planType === "TRIAL" ? planType : "FREE",
          credits,
          renewalDate,
        });
      }
    } catch {
      // ignore and fall through
    }

    // 3) Fallback if no plan table exists yet
    return safeJson({ planType: "FREE", credits: 0, renewalDate: null });
  } catch (err) {
    console.error("GET /api/user/plan failed:", err);
    // Never 500 to client — keep UX stable
    return safeJson({ planType: "FREE", credits: 0, renewalDate: null });
  }
}
