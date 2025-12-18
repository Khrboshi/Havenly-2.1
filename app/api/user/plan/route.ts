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

async function readCreditsFlexible({
  supabase,
  userId,
}: {
  supabase: any;
  userId: string;
}): Promise<{
  ok: boolean;
  planType?: PlanType;
  credits?: number;
  renewalDate?: string | null;
}> {
  // Try schema A: plan_type
  const a = await supabase
    .from("user_credits")
    .select("plan_type, credits, renewal_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (!a.error && a.data) {
    const planType = String(a.data.plan_type || "FREE").toUpperCase() as PlanType;
    return {
      ok: true,
      planType: planType === "PREMIUM" || planType === "TRIAL" ? planType : "FREE",
      credits: typeof a.data.credits === "number" ? a.data.credits : 0,
      renewalDate: typeof a.data.renewal_date === "string" ? a.data.renewal_date : null,
    };
  }

  const msg = String((a.error as any)?.message || "");
  if (!msg.toLowerCase().includes("plan_type")) {
    return { ok: false };
  }

  // Try schema B: plan
  const b = await supabase
    .from("user_credits")
    .select("plan, credits, renewal_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (!b.error && b.data) {
    const planType = String(b.data.plan || "FREE").toUpperCase() as PlanType;
    return {
      ok: true,
      planType: planType === "PREMIUM" || planType === "TRIAL" ? planType : "FREE",
      credits: typeof b.data.credits === "number" ? b.data.credits : 0,
      renewalDate: typeof b.data.renewal_date === "string" ? b.data.renewal_date : null,
    };
  }

  return { ok: false };
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

    // Canonical source: user_credits (also provisions new users + refreshes monthly)
    await ensureCreditsFresh({ supabase, userId: user.id });

    const creditsRead = await readCreditsFlexible({ supabase, userId: user.id });
    if (creditsRead.ok) {
      return safeJson({
        planType: creditsRead.planType!,
        credits: creditsRead.credits!,
        renewalDate: creditsRead.renewalDate ?? null,
      });
    }

    // Fallbacks preserved (do not break prior setups):
    // 1) user_plans
    // 2) profiles
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
