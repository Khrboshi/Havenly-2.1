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

    // Not logged in → FREE
    if (userErr || !user) {
      return safeJson({
        planType: "FREE",
        credits: 0,
        renewalDate: null,
      });
    }

    /**
     * 1️⃣ Try user_plans table
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
          planType:
            planType === "PREMIUM" || planType === "TRIAL" ? planType : "FREE",
          credits: typeof data.credits === "number" ? data.credits : 0,
          renewalDate:
            typeof data.renewal_date === "string" ? data.renewal_date : null,
        });
      }
    } catch {
      // silently fall through
    }

    /**
     * 2️⃣ Try profiles table
     */
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("plan_type, credits, renewal_date")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        const planType = String(data.plan_type || "FREE").toUpperCase() as PlanType;

        return safeJson({
          planType:
            planType === "PREMIUM" || planType === "TRIAL" ? planType : "FREE",
          credits: typeof data.credits === "number" ? data.credits : 0,
          renewalDate:
            typeof data.renewal_date === "string" ? data.renewal_date : null,
        });
      }
    } catch {
      // silently fall through
    }

    /**
     * 3️⃣ Absolute fallback
     */
    return safeJson({
      planType: "FREE",
      credits: 0,
      renewalDate: null,
    });
  } catch (err) {
    console.error("GET /api/user/plan failed:", err);

    // Never break UX
    return safeJson({
      planType: "FREE",
      credits: 0,
      renewalDate: null,
    });
  }
}
