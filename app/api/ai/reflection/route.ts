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

type ConsumeOk = { ok: true; remaining: number };
type ConsumeFail = { ok: false; status: number; error: string };
type ConsumeResult = ConsumeOk | ConsumeFail;

function isConsumeFail(r: ConsumeResult): r is ConsumeFail {
  return r.ok === false;
}

function isParamMismatchError(msg: string) {
  const m = msg.toLowerCase();
  return (
    m.includes("could not find the function") ||
    (m.includes("function") && m.includes("does not exist")) ||
    m.includes("unknown parameter") ||
    m.includes("invalid input syntax") ||
    m.includes("no function matches")
  );
}

function isNoCreditsError(msg: string) {
  const m = msg.toLowerCase();
  return (
    m.includes("no credits") ||
    m.includes("insufficient") ||
    m.includes("limit") ||
    m.includes("quota") ||
    m.includes("exceeded")
  );
}

async function consumeOneCredit(supabase: any, userId: string): Promise<ConsumeResult> {
  let rpcData: any = null;
  let rpcErr: any = null;

  // Attempt 1: RPC expects p_user_id + p_amount
  const first = await supabase.rpc("consume_reflection_credit", {
    p_user_id: userId,
    p_amount: 1,
  });

  rpcData = first?.data;
  rpcErr = first?.error;

  // Attempt 2: RPC expects only p_amount (user inferred in DB via auth.uid())
  if (rpcErr && isParamMismatchError(String(rpcErr.message || ""))) {
    const second = await supabase.rpc("consume_reflection_credit", {
      p_amount: 1,
    });
    rpcData = second?.data;
    rpcErr = second?.error;
  }

  if (rpcErr) {
    const msg = String(rpcErr.message || "");

    if (msg.toLowerCase().includes("not_authenticated")) {
      return { ok: false, status: 401, error: "Unauthorized" };
    }

    if (isNoCreditsError(msg)) {
      return { ok: false, status: 402, error: "Reflection limit reached" };
    }

    // Log in server to debug (shows in Vercel logs)
    console.error("consume_reflection_credit rpc error:", rpcErr);

    return { ok: false, status: 500, error: "Failed to consume credits" };
  }

  const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
  const remaining =
    row && typeof row.remaining_credits === "number" ? (row.remaining_credits as number) : null;

  // If we can't read remaining, treat as out-of-credits to be safe
  if (remaining === null) {
    return { ok: false, status: 402, error: "Reflection limit reached" };
  }

  return { ok: true, remaining };
}

export async function POST(req: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  const body = await req.json().catch(() => ({}));

  const entryId = typeof body?.entryId === "string" ? body.entryId.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!entryId) {
    return NextResponse.json({ error: "Missing entryId" }, { status: 400 });
  }

  if (!content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  if (content.length > 20000) {
    return NextResponse.json(
      { error: "Entry too long. Please shorten it a bit." },
      { status: 413 }
    );
  }

  // Ensure monthly credits row exists / is up to date
  await ensureCreditsFresh({ supabase, userId });

  const { data: creditsRow } = await supabase
    .from("user_credits")
    .select("plan_type")
    .eq("user_id", userId)
    .maybeSingle();

  const planType = normalizePlan((creditsRow as any)?.plan_type);
  const isUnlimited = planType === "PREMIUM" || planType === "TRIAL";

  let remainingAfterConsume: number | null = null;

  // Consume 1 credit for FREE plan only
  if (!isUnlimited) {
    const consumed = await consumeOneCredit(supabase, userId);
    if (isConsumeFail(consumed)) {
      return NextResponse.json({ error: consumed.error }, { status: consumed.status });
    }
    remainingAfterConsume = consumed.remaining;
  }

  try {
    // Generate reflection (AI)
    const reflection = await generateReflectionFromEntry({
      content,
      title,
      plan: isUnlimited ? "PREMIUM" : "FREE",
    });

    // Persist reflection on the entry
    await supabase
      .from("journal_entries")
      .update({ ai_response: JSON.stringify(reflection) })
      .eq("id", entryId)
      .eq("user_id", userId);

    // Log reflection usage (ONLY on success)
    // NOTE: your reflection_usage table has columns: id, user_id, date (text), created_at
    await supabase.from("reflection_usage").insert({
      user_id: userId,
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    });

    return NextResponse.json(
      { reflection, remainingCredits: isUnlimited ? null : remainingAfterConsume },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("Reflection generation failed:", err);

    // Best-effort refund if we consumed a credit
    if (!isUnlimited && remainingAfterConsume !== null) {
      try {
        await supabase
          .from("user_credits")
          .update({
            remaining_credits: remainingAfterConsume + 1,
            updated_at: new Date().toISOString(),
          } as any)
          .eq("user_id", userId);
      } catch (refundErr) {
        console.error("Refund failed:", refundErr);
      }
    }

    return NextResponse.json({ error: "Failed to generate reflection" }, { status: 500 });
  }
}
