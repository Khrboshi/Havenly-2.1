// app/api/ai/reflection/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";
import { generateReflectionFromEntry } from "@/lib/ai/generateReflection";

export const dynamic = "force-dynamic";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

function normalizePlan(v: unknown): PlanType {
  const p = String(v ?? "FREE").toUpperCase();
  return p === "PREMIUM" || p === "TRIAL" ? (p as PlanType) : "FREE";
}

export async function POST(req: Request) {
  const supabase = createServerSupabase();

  // ✅ Auth: use getUser() (server-validated) instead of getSession()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  // Parse body safely
  const body = await req.json().catch(() => ({}));
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  // Optional guardrail: avoid huge payloads
  if (content.length > 20000) {
    return NextResponse.json(
      { error: "Entry too long. Please shorten it a bit." },
      { status: 413 }
    );
  }

  // ✅ Ensure monthly reset / row provisioning for FREE users
  await ensureCreditsFresh({ supabase, userId });

  // Get plan + credits
  const { data: creditsRow } = await supabase
    .from("user_credits")
    .select("plan_type, remaining_credits")
    .eq("user_id", userId)
    .maybeSingle();

  const planType = normalizePlan((creditsRow as any)?.plan_type);
  const isUnlimited = planType === "PREMIUM" || planType === "TRIAL";

  // We’ll consume credits atomically ONLY for FREE users
  // and refund (best-effort) if generation fails.
  let remainingAfterConsume: number | null = null;

  if (!isUnlimited) {
    const { data: rpcData, error: rpcErr } = await supabase.rpc(
      "consume_reflection_credit",
      { p_amount: 1 }
    );

    if (rpcErr) {
      // If your function throws not_authenticated
      const msg = String(rpcErr.message || "").toLowerCase();
      if (msg.includes("not_authenticated")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // If no credits: treat as 402 (Upgrade modal)
      // Many implementations return empty result or custom error message
      if (msg.includes("no credits") || msg.includes("insufficient")) {
        return NextResponse.json(
          { error: "Reflection limit reached" },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { error: "Failed to consume credits" },
        { status: 500 }
      );
    }

    const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;

    const remaining =
      row && typeof (row as any).remaining_credits === "number"
        ? (row as any).remaining_credits
        : null;

    if (remaining === null) {
      return NextResponse.json(
        { error: "Reflection limit reached" },
        { status: 402 }
      );
    }

    remainingAfterConsume = remaining;
  }

  // 🧠 AI generation
  try {
    const reflection = await generateReflectionFromEntry({
      content,
      title,
      plan: planType === "PREMIUM" ? "PREMIUM" : "FREE",
    });

    return NextResponse.json(
      {
        reflection,
        // Keep the response stable: client can ignore this,
        // but it helps debugging and future UI.
        remainingCredits: isUnlimited ? null : remainingAfterConsume,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("Reflection generation failed:", err);

    // 🔁 Best-effort refund ONLY if we consumed one
    if (!isUnlimited && remainingAfterConsume !== null) {
      try {
        await supabase
          .from("user_credits")
          .update({
            remaining_credits: remainingAfterConsume + 1,
            updated_at: new Date().toISOString(),
          } as any)
          .eq("user_id", userId);
      } catch {
        // ignore refund failure
      }
    }

    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
}
