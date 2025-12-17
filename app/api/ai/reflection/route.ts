import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { decrementCreditIfAllowed } from "@/lib/creditRules";
import { generateReflectionFromEntry } from "@/lib/ai/generateReflection";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();

    const { entryId, content, title } = body;

    if (!entryId || !content) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    /**
     * 🔒 CREDIT ENFORCEMENT — SINGLE SOURCE OF TRUTH
     */
    const creditResult = await decrementCreditIfAllowed({
      supabase,
      userId,
      feature: "ai_reflection",
    });

    if (!creditResult.allowed) {
      return NextResponse.json(
        { error: "Reflection limit reached" },
        { status: 402 }
      );
    }

    /**
     * 🤖 AI GENERATION
     */
    const reflection = await generateReflectionFromEntry({
      title,
      content,
    });

    return NextResponse.json({
      reflection,
    });
  } catch (err) {
    console.error("AI reflection error:", err);

    // IMPORTANT: never leak 500 to client for credit issues
    return NextResponse.json(
      { error: "Unable to generate reflection" },
      { status: 500 }
    );
  }
}
