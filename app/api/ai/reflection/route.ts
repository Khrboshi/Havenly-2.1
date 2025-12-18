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
   * 🔒 CREDIT ENFORCEMENT — SINGLE SOURCE OF TRUTH
   */
  const creditResult = await decrementCreditIfAllowed({
    supabase,
    userId,
    feature: "ai_reflection",
  });

  if (!creditResult.ok) {
    // Only trigger upgrade flow if we are sure it is the limit.
    if (creditResult.reason === "limit_reached") {
      return NextResponse.json(
        { error: "Reflection limit reached" },
        { status: 402 }
      );
    }

    // Otherwise, do not mislead the UI into showing "limit reached".
    return NextResponse.json(
      { error: creditResult.reason || "Unable to verify credits" },
      { status: 500 }
    );
  }

  /**
   * 🧠 AI GENERATION (only reached if credit allowed)
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
    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
}
