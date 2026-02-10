import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

function normalizePlan(v: unknown): PlanType {
  const p = String(v ?? "FREE").toUpperCase();
  return p === "PREMIUM" || p === "TRIAL" ? (p as PlanType) : "FREE";
}

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
      renewalDate: data.renewalDate,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
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

    await ensureCreditsFresh({ supabase, userId: user.id });

    const { data, error } = await supabase
      .from("user_credits")
      .select("plan_type, remaining_credits, renewal_date")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) {
      return safeJson({ planType: "FREE", credits: 0, renewalDate: null });
    }

    return safeJson({
      planType: normalizePlan((data as any).plan_type),
      credits:
        typeof (data as any).remaining_credits === "number"
          ? (data as any).remaining_credits
          : 0,
      renewalDate:
        typeof (data as any).renewal_date === "string"
          ? (data as any).renewal_date
          : null,
    });
  } catch (err) {
    console.error("GET /api/user/plan failed:", err);
    return safeJson({ planType: "FREE", credits: 0, renewalDate: null });
  }
}
