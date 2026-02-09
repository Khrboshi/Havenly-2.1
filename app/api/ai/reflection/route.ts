import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { decrementCreditIfAllowed } from "@/lib/supabase/creditRules";
import { generateReflectionFromEntry } from "@/lib/ai/generateReflection";

export const dynamic = "force-dynamic";

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
      return NextResponse.json(
        { error: "Reflection limit reached" },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: creditResult.reason || "Unable to verify credits" },
      { status: 500 }
    );
  }

  /**
   * 🧠 DETERMINE USER PLAN (FREE vs PREMIUM)
   */
  let plan: "FREE" | "PREMIUM" = "FREE";

  try {
    const { data } = await supabase
      .from("user_credits")
      .select("plan_type")
      .eq("user_id", userId)
      .maybeSingle();

    if (data?.plan_type === "PREMIUM") {
      plan = "PREMIUM";
    }
  } catch {
    // Silent fallback to FREE (never block reflection)
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

    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
}
