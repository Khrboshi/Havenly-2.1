import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    // 1️⃣ Auth check
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { entryId, content, title } = body || {};

    if (!entryId || !content) {
      return NextResponse.json(
        { error: "Missing entry content" },
        { status: 400 }
      );
    }

    // 2️⃣ HARD CREDIT ENFORCEMENT (ATOMIC)
    const { data: creditData, error: creditErr } = await supabase.rpc(
      "consume_reflection_credit",
      { p_amount: 1 }
    );

    if (creditErr) {
      console.error("Credit RPC error:", creditErr);
      return NextResponse.json(
        { error: "Unable to verify credits" },
        { status: 500 }
      );
    }

    // ❌ No credits left → STOP HERE
    if (!creditData || creditData.length === 0) {
      return NextResponse.json(
        { error: "Reflection limit reached" },
        { status: 402 }
      );
    }

    // 3️⃣ Generate reflection (ONLY if credit consumed)
    const aiResponse = await fetch(process.env.AI_REFLECTION_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_SECRET}`,
      },
      body: JSON.stringify({
        title: title || "",
        content,
      }),
    });

    if (!aiResponse.ok) {
      console.error("AI generation failed");

      // OPTIONAL: refund credit on AI failure
      await supabase.rpc("consume_reflection_credit", { p_amount: -1 });

      return NextResponse.json(
        { error: "AI generation failed" },
        { status: 500 }
      );
    }

    const reflection = await aiResponse.json();

    // 4️⃣ Save reflection (optional but recommended)
    await supabase.from("journal_reflections").insert({
      entry_id: entryId,
      user_id: user.id,
      reflection,
    });

    return NextResponse.json({ reflection });
  } catch (err) {
    console.error("Reflection API error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
