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
    m.includes("exceeded") ||
    m.includes("payment required")
  );
}

async function consumeOneCredit(supabase: any, userId: string): Promise<ConsumeResult> {
  let rpcData: any = null;
  let rpcErr: any = null;

  // Attempt A: function expects p_user_id + p_amount
  const first = await supabase.rpc("consume_reflection_credit", {
    p_user_id: userId,
    p_amount: 1,
  });

  rpcData = first?.data;
  rpcErr = first?.error;

  // Attempt B: function expects only p_amount
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

    return { ok: false, status: 500, error: "Failed to consume credits" };
  }

  const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
  const remaining =
    row && typeof row.remaining_credits === "number" ? (row.remaining_credits as number) : null;

  if (remaining === null) {
    return { ok: false, status: 402, error: "Reflection limit reached" };
  }

  return { ok: true, remaining };
}

async function logReflectionUsageSafely(supabase: any, userId: string) {
  // Your table is append-only: (id, user_id, date text, created_at)
  const date = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.from("reflection_usage").insert({
    user_id: userId,
    date,
  });

  // NEVER crash the reflection endpoint because logging failed
  if (error) {
    console.warn("reflection_usage insert failed:", error.message || error);
  }
}

async function refundOneCreditBestEffort(supabase: any, userId: string) {
  // safest without a dedicated RPC: re-read then set +1
  const { data: row, error: readErr } = await supabase
    .from("user_credits")
    .select("remaining_credits")
    .eq("user_id", userId)
    .maybeSingle();

  if (readErr) return;

  const current = typeof row?.remaining_credits === "number" ? row.remaining_credits : null;
  if (current === null) return;

  await supabase
    .from("user_credits")
    .update({
      remaining_credits: current + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);
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

  if (!entryId) return NextResponse.json({ error: "Missing entryId" }, { status: 400 });
  if (!content) return NextResponse.json({ error: "Missing content" }, { status: 400 });

  if (content.length > 20000) {
    return NextResponse.json(
      { error: "Entry too long. Please shorten it a bit." },
      { status: 413 }
    );
  }

  await ensureCreditsFresh({ supabase, userId });

  const { data: creditsRow } = await supabase
    .from("user_credits")
    .select("plan_type")
    .eq("user_id", userId)
    .maybeSingle();

  const planType = normalizePlan(creditsRow?.plan_type);
  const isUnlimited = planType === "PREMIUM" || planType === "TRIAL";

  let remainingAfterConsume: number | null = null;

  if (!isUnlimited) {
    const consumed = await consumeOneCredit(supabase, userId);
    if (isConsumeFail(consumed)) {
      return NextResponse.json({ error: consumed.error }, { status: consumed.status });
    }
    remainingAfterConsume = consumed.remaining;
  }

  try {
    const reflection = await generateReflectionFromEntry({
      content,
      title,
      plan: isUnlimited ? "PREMIUM" : "FREE",
    });

    // Persist reflection on the entry (best effort; but should succeed)
    const { error: saveErr } = await supabase
      .from("journal_entries")
      .update({ ai_response: JSON.stringify(reflection) })
      .eq("id", entryId)
      .eq("user_id", userId);

    if (saveErr) {
      // If saving fails, treat as server failure (and refund if needed)
      throw new Error(`Failed to persist reflection: ${saveErr.message}`);
    }

    // Log usage WITHOUT risking a 500
    await logReflectionUsageSafely(supabase, userId);

    return NextResponse.json(
      { reflection, remainingCredits: isUnlimited ? null : remainingAfterConsume },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("Reflection generation failed:", err);

    if (!isUnlimited && remainingAfterConsume !== null) {
      try {
        await refundOneCreditBestEffort(supabase, userId);
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ error: "Failed to generate reflection" }, { status: 500 });
  }
}
