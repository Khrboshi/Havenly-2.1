// app/api/ai/reflection/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { decrementCreditIfAllowed } from "@/lib/creditRules";
import { generateReflectionFromEntry } from "@/lib/ai/generateReflection";

export const dynamic = "force-dynamic";

type PlanType = "FREE" | "PREMIUM" | "TRIAL";

function normalizePlan(v: unknown): PlanType {
  const p = String(v ?? "FREE").toUpperCase();
  if (p === "PREMIUM" || p === "TRIAL") return p as PlanType;
  return "FREE";
}

export async function POST(req: Request) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();

  /**
   * 🔒 CREDIT ENFORCEMENT — SINGLE SOURCE OF TRUTH
   */
  const creditResult = await decrementCreditIfAllowed({
    supabase,
    userId,
    feature: "ai_reflection",
  });

  if (!creditResult.ok) {
    if (creditResult.reason === "limit_reached") {
      return NextResponse.json({ error: "Reflection limit reached" }, { status: 402 });
    }

    return NextResponse.json(
      { error: creditResult.reason || "Unable to verify credits" },
      { status: 500 }
    );
  }

  /**
   * 🧠 READ PLAN (for prompt depth). Canonical: user_credits.plan_type
   * Fallback: FREE
   */
  let plan: "FREE" | "PREMIUM" = "FREE";

  try {
    const { data } = await supabase
      .from("user_credits")
      .select("plan_type")
      .eq("user_id", userId)
      .maybeSingle();

    const planType = normalizePlan((data as any)?.plan_type);
    plan = planType === "PREMIUM" ? "PREMIUM" : "FREE";
  } catch {
    // silent fallback
  }

  /**
   * 🧠 AI GENERATION (only reached if credit allowed)
   */
  try {
    const reflection = await generateReflectionFromEntry({
      content: body.content,
      title: body.title,
      plan,
    });

    return NextResponse.json({
      reflection,
      remainingCredits: creditResult.remaining,
    });
  } catch (err) {
    console.error("Reflection generation failed:", err);
    return NextResponse.json({ error: "Failed to generate reflection" }, { status: 500 });
  }
}
