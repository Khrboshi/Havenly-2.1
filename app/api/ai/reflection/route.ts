// app/api/ai/reflection/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";
import { generateReflectionFromEntry } from "@/lib/ai/generateReflection";

// Hard-disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

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
    m.includes("out of credits")
  );
}

async function consumeOneCredit(
  supabase: any,
  userId: string
): Promise<ConsumeResult> {
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

    console.error("[reflection] consume_reflection_credit rpc error:", rpcErr);
    return { ok: false, status: 500, error: "Failed to consume credits" };
  }

  const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
  const remaining =
    row && typeof row.remaining_credits === "number"
      ? (row.remaining_credits as number)
      : null;

  // If we can't read remaining, treat as out-of-credits to be safe
  if (remaining === null) {
    return { ok: false, status: 402, error: "Reflection limit reached" };
  }

  return { ok: true, remaining };
}

/**
 * Lightweight request fingerprint (debugging only).
 * Not cryptographic. Used to prove request/response integrity.
 */
function contentFingerprint(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
}

export async function POST(req: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: noStoreHeaders() }
    );
  }

  const userId = user.id;

  const body = await req.json().catch(() => ({}));

  const entryId = typeof body?.entryId === "string" ? body.entryId.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!entryId) {
    return NextResponse.json(
      { error: "Missing entryId" },
      { status: 400, headers: noStoreHeaders() }
    );
  }

  if (!content) {
    return NextResponse.json(
      { error: "Missing content" },
      { status: 400, headers: noStoreHeaders() }
    );
  }

  if (content.length > 20000) {
    return NextResponse.json(
      { error: "Entry too long. Please shorten it a bit." },
      { status: 413, headers: noStoreHeaders() }
    );
  }

  // Debug toggle: /api/ai/reflection?debug=1
  const url = new URL(req.url);
  const debugEnabled = url.searchParams.get("debug") === "1";
  const fp = debugEnabled ? contentFingerprint(content) : undefined;
  const snippet = debugEnabled ? content.slice(0, 120) : undefined;

  if (debugEnabled) {
    console.log("[reflection] entryId=", entryId, "fp=", fp, "snippet=", snippet);
  }

  // Ensure monthly credits row exists / is up to date
  await ensureCreditsFresh({ supabase, userId });

  const { data: creditsRow, error: creditsErr } = await supabase
    .from("user_credits")
    .select("plan_type")
    .eq("user_id", userId)
    .maybeSingle();

  if (creditsErr) {
    console.error("[reflection] failed to read user_credits:", creditsErr);
  }

  const planType = normalizePlan((creditsRow as any)?.plan_type);
  const isUnlimited = planType === "PREMIUM" || planType === "TRIAL";

  let remainingAfterConsume: number | null = null;

  // Consume 1 credit for FREE plan only
  if (!isUnlimited) {
    const consumed = await consumeOneCredit(supabase, userId);
    if (isConsumeFail(consumed)) {
      return NextResponse.json(
        { error: consumed.error },
        { status: consumed.status, headers: noStoreHeaders() }
      );
    }
    remainingAfterConsume = consumed.remaining;
  }

  try {
    const reflection = await generateReflectionFromEntry({
      content,
      title,
      plan: isUnlimited ? "PREMIUM" : "FREE",
    });

    // Persist reflection on the entry
    const { error: updErr } = await supabase
      .from("journal_entries")
      .update({ ai_response: JSON.stringify(reflection) })
      .eq("id", entryId)
      .eq("user_id", userId);

    if (updErr) {
      console.error("[reflection] journal_entries update failed:", updErr);
    }

    // Log reflection usage (ONLY on success)
    const { error: usageErr } = await supabase.from("reflection_usage").insert({
      user_id: userId,
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    });

    if (usageErr) {
      console.error("[reflection] reflection_usage insert failed:", usageErr);
    }

    const payload: any = {
      reflection,
      remainingCredits: isUnlimited ? null : remainingAfterConsume,
    };

    if (debugEnabled) {
      payload.debug = { entryId, fp, snippet };
    }

    return NextResponse.json(payload, { headers: noStoreHeaders() });
  } catch (err) {
    console.error("[reflection] generation failed:", err);

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
        console.error("[reflection] refund failed:", refundErr);
      }
    }

    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500, headers: noStoreHeaders() }
    );
  }
}
