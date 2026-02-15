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

async function consumeOneCredit(
  supabase: any,
  userId: string
): Promise<ConsumeResult> {
  let rpcData: any = null;
  let rpcErr: any = null;

  const first = await supabase.rpc("consume_reflection_credit", {
    p_user_id: userId,
    p_amount: 1,
  });

  rpcData = first?.data;
  rpcErr = first?.error;

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
    row && typeof row.remaining_credits === "number"
      ? (row.remaining_credits as number)
      : null;

  if (remaining === null) {
    return { ok: false, status: 402, error: "Reflection limit reached" };
  }

  return { ok: true, remaining };
}

export async function POST(req: Request) {
  const supabase = await createServerSupabase();

  // Auth
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  // Body
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

  // Ensure the entry belongs to this user (RLS-safe check)
  const { data: entryRow, error: entryErr } = await supabase
    .from("journal_entries")
    .select("id")
    .eq("id", entryId)
    .eq("user_id", userId)
    .maybeSingle();

  if (entryErr || !entryRow) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }

  // Ensure monthly reset / row provisioning
  await ensureCreditsFresh({ supabase, userId });

  // Plan
  const { data: creditsRow } = await supabase
    .from("user_credits")
    .select("plan_type")
    .eq("user_id", userId)
    .maybeSingle();

  const planType = normalizePlan((creditsRow as any)?.plan_type);
  const isUnlimited = planType === "PREMIUM" || planType === "TRIAL";

  // Consume ONLY for FREE
  let remainingAfterConsume: number | null = null;

  if (!isUnlimited) {
    const consumed = await consumeOneCredit(supabase, userId);

    if (isConsumeFail(consumed)) {
      return NextResponse.json(
        { error: consumed.error },
        { status: consumed.status }
      );
    }

    remainingAfterConsume = consumed.remaining;
  }

  // Generate + SAVE into journal_entries.ai_response
  try {
    const reflection = await generateReflectionFromEntry({
      content,
      title,
      plan: planType === "PREMIUM" || planType === "TRIAL" ? "PREMIUM" : "FREE",
    });

    const { error: saveErr } = await supabase
      .from("journal_entries")
      .update({
        ai_response: JSON.stringify(reflection),
      } as any)
      .eq("id", entryId)
      .eq("user_id", userId);

    if (saveErr) {
      return NextResponse.json(
        { error: "Generated reflection but failed to save." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        reflection,
        remainingCredits: isUnlimited ? null : remainingAfterConsume,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("Reflection generation failed:", err);

    // Best-effort refund if consumed one
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
