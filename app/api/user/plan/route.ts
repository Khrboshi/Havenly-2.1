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
      renewalDate: data.renewalDate,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
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
      return safeJson({
        planType: "FREE",
        credits: 0,
        renewalDate: null,
      });
    }

    /**
     * ✅ Canonical source: user_credits
     * - provisions & refreshes monthly credits safely
     */
    await ensureCreditsFresh({ supabase, userId: user.id });

    const { data: creditsRow, error: creditsErr } = await supabase
      .from("user_credits")
      .select("plan_type, credits, renewal_date")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!creditsErr && creditsRow) {
      const planType = String(creditsRow.plan_type || "FREE").toUpperCase() as PlanType;

      return safeJson({
        planType: planType === "PREMIUM" || planType === "TRIAL" ? planType : "FREE",
        credits: typeof creditsRow.credits === "number" ? creditsRow.credits : 0,
        renewalDate: typeof creditsRow.renewal_date === "string" ? creditsRow.renewal_date : null,
      });
    }

    /**
     * Fallbacks preserved (do not break prior setups):
     * 1) user_plans
     * 2) profiles
     */
    try {
      const { data, error } = await supabase
        .from("user_plans")
        .select("plan_type, credits, renewal_date")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        const planType = String(data.plan_type || "FREE").toUpperCase() as PlanType;

        return safeJson({
          planType: planType === "PREMIUM" || planType === "TRIAL" ? planType : "FREE",
          credits: typeof data.credits === "number" ? data.credits : 0,
          renewalDate: typeof data.renewal_date === "string" ? data.renewal_date : null,
        });
      }
    } catch {
      // fall through
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("plan_type, credits, renewal_date")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        const planType = String(data.plan_type || "FREE").toUpperCase() as PlanType;

        return safeJson({
          planType: planType === "PREMIUM" || planType === "TRIAL" ? planType : "FREE",
          credits: typeof data.credits === "number" ? data.credits : 0,
          renewalDate: typeof data.renewal_date === "string" ? data.renewal_date : null,
        });
      }
    } catch {
      // fall through
    }

    return safeJson({
      planType: "FREE",
      credits: 0,
      renewalDate: null,
    });
  } catch (err) {
    console.error("GET /api/user/plan failed:", err);

    return safeJson({
      planType: "FREE",
      credits: 0,
      renewalDate: null,
    });
  }
}
