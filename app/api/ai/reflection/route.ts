import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { decrementCreditIfAllowed } from "@/lib/creditRules";
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
   * 🔒 STEP 1: Attempt credit consumption (single source of truth)
   * This handles:
   * - credit existence
   * - renewal
   * - plan type
   * - RLS safely
   */
  const creditResult = await decrementCreditIfAllowed({
    supabase,
    userId,
    feature: "ai_reflection",
  });

  if (!creditResult.ok) {
    return NextResponse.json(
      { error: "Reflection limit reached" },
      { status: 402 }
    );
  }

  /**
   * 🧠 STEP 2: Generate AI reflection
   */
  try {
    const reflection = await generateReflectionFromEntry({
      content: body.content,
      title: body.title,
    });

    return NextResponse.json({
      reflection,
      remainingCredits: creditResult.remaining,
    });
  } catch (err) {
    /**
     * ⚠️ IMPORTANT SAFETY NET
     * If AI generation fails, restore the consumed credit
     */
    await supabase
      .from("user_credits")
      .update({
        credits: (creditResult.remaining ?? 0) + 1,
      })
      .eq("user_id", userId);

    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
}
