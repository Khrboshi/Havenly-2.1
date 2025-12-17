import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";
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
   * 🔒 STEP 1: Ensure credits are fresh
   */
  await ensureCreditsFresh({ supabase, userId });

  /**
   * 🔍 STEP 2: Read credits WITHOUT mutating
   */
  const { data: creditsRow, error } = await supabase
    .from("user_credits")
    .select("credits, plan_type")
    .eq("user_id", userId)
    .single();

  if (error || !creditsRow) {
    return NextResponse.json(
      { error: "Unable to verify credits" },
      { status: 500 }
    );
  }

  const isPremium = creditsRow.plan_type === "PREMIUM";

  if (!isPremium && creditsRow.credits <= 0) {
    return NextResponse.json(
      { error: "Reflection limit reached" },
      { status: 402 }
    );
  }

  /**
   * 🧠 STEP 3: Generate AI reflection
   */
  let reflection;
  try {
    reflection = await generateReflectionFromEntry({
      content: body.content,
      title: body.title,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }

  /**
   * ➖ STEP 4: Decrement credits ONLY after success (Free users)
   */
  if (!isPremium) {
    const remaining = Math.max(creditsRow.credits - 1, 0);

    await supabase
      .from("user_credits")
      .update({ credits: remaining })
      .eq("user_id", userId);
  }

  /**
   * ✅ STEP 5: Respond
   */
  return NextResponse.json({
    reflection,
  });
}
