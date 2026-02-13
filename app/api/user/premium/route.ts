import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

function normalizePlan(v: unknown): PlanType {
  const p = String(v ?? "FREE").toUpperCase();
  return p === "PREMIUM" || p === "TRIAL" ? (p as PlanType) : "FREE";
}

export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureCreditsFresh({ supabase, userId: user.id });

  const { data, error } = await supabase
    .from("user_credits")
    .select("plan_type, remaining_credits, renewal_date")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { planType: "FREE", credits: 0, renewalDate: null },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  return NextResponse.json(
    {
      planType: normalizePlan((data as any).plan_type),
      credits:
        typeof (data as any).remaining_credits === "number"
          ? (data as any).remaining_credits
          : 0,
      renewalDate:
        typeof (data as any).renewal_date === "string"
          ? (data as any).renewal_date
          : null,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
