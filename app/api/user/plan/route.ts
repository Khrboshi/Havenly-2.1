// app/api/user/plan/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

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
      plan: data.planType, // backward compatibility
      credits: data.credits,
      renewalDate: data.renewalDate, // will be null (schema has no renewal_date)
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

async function readPlanType(params: { supabase: any; userId: string }): Promise<PlanType> {
  const { supabase, userId } = params;

  // 1) user_plans
  try {
    const { data, error } = await supabase
      .from("user_plans")
      .select("plan_type")
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && data?.plan_type) {
      const p = String(data.plan_type).toUpperCase();
      return (p === "PREMIUM" || p === "TRIAL") ? (p as PlanType) : "FREE";
    }
  } catch {}

  // 2) profiles fallback
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("plan_type")
      .eq("id", userId)
      .maybeSingle();

    if (!error && data?.plan_type) {
      const p = String(data.plan_type).toUpperCase();
      return (p === "PREMIUM" || p === "TRIAL") ? (p as PlanType) : "FREE";
    }
  } catch {}

  return "FREE";
}

async function readCredits(params: { supabase: any; userId: string }): Promise<number> {
  const { supabase, userId } = params;

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return 0;
  return typeof data.credits === "number" ? data.credits : 0;
}

export async function GET() {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return safeJson({ planType: "FREE", credits: 0, renewalDate: null });
    }

    // Provisions missing user_credits row + monthly reset (FREE only)
    await ensureCreditsFresh({ supabase, userId: user.id });

    const planType = await readPlanType({ supabase, userId: user.id });
    const credits = await readCredits({ supabase, userId: user.id });

    return safeJson({
      planType,
      credits,
      renewalDate: null, // your schema does not include a renewal_date column
    });
  } catch (err) {
    console.error("GET /api/user/plan failed:", err);
    return safeJson({ planType: "FREE", credits: 0, renewalDate: null });
  }
}
