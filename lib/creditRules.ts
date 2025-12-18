import { SupabaseClient } from "@supabase/supabase-js";

const FREE_MONTHLY_CREDITS = 3;

function getNextRenewalDate(from: Date) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d;
}

type CreditsRow = {
  credits: number;
  renewal_date: string | null;
  plan: string | null; // normalized field (could come from plan_type or plan)
};

async function selectCreditsRowFlexible(params: {
  supabase: SupabaseClient;
  userId: string;
}): Promise<{ row: CreditsRow | null; err: any | null }> {
  const { supabase, userId } = params;

  // Try schema A: plan_type
  const attemptA = await supabase
    .from("user_credits")
    .select("credits, renewal_date, plan_type")
    .eq("user_id", userId)
    .maybeSingle();

  if (!attemptA.error) {
    const r: any = attemptA.data;
    if (!r) return { row: null, err: null };
    return {
      row: {
        credits: typeof r.credits === "number" ? r.credits : 0,
        renewal_date: typeof r.renewal_date === "string" ? r.renewal_date : null,
        plan: typeof r.plan_type === "string" ? r.plan_type : null,
      },
      err: null,
    };
  }

  // If the error is likely "column plan_type does not exist", try schema B: plan
  const msg = String((attemptA.error as any)?.message || "");
  if (!msg.toLowerCase().includes("plan_type")) {
    return { row: null, err: attemptA.error };
  }

  const attemptB = await supabase
    .from("user_credits")
    .select("credits, renewal_date, plan")
    .eq("user_id", userId)
    .maybeSingle();

  if (attemptB.error) return { row: null, err: attemptB.error };

  const r: any = attemptB.data;
  if (!r) return { row: null, err: null };

  return {
    row: {
      credits: typeof r.credits === "number" ? r.credits : 0,
      renewal_date: typeof r.renewal_date === "string" ? r.renewal_date : null,
      plan: typeof r.plan === "string" ? r.plan : null,
    },
    err: null,
  };
}

async function upsertCreditRowFlexible(params: {
  supabase: SupabaseClient;
  userId: string;
  plan: "FREE" | "TRIAL" | "PREMIUM";
  credits: number;
  renewalDateIso: string;
}) {
  const { supabase, userId, plan, credits, renewalDateIso } = params;

  // Try schema A: plan_type
  const a = await supabase.from("user_credits").upsert(
    {
      user_id: userId,
      plan_type: plan,
      credits,
      renewal_date: renewalDateIso,
      updated_at: new Date().toISOString(),
    } as any,
    { onConflict: "user_id" }
  );

  if (!a.error) return;

  const msg = String((a.error as any)?.message || "");
  if (!msg.toLowerCase().includes("plan_type")) {
    // Some other real error
    throw a.error;
  }

  // Fallback schema B: plan
  const b = await supabase.from("user_credits").upsert(
    {
      user_id: userId,
      plan,
      credits,
      renewal_date: renewalDateIso,
      updated_at: new Date().toISOString(),
    } as any,
    { onConflict: "user_id" }
  );

  if (b.error) throw b.error;
}

async function updateCreditsFlexible(params: {
  supabase: SupabaseClient;
  userId: string;
  credits?: number;
  renewalDateIso?: string;
}) {
  const { supabase, userId, credits, renewalDateIso } = params;

  const payload: any = {};
  if (typeof credits === "number") payload.credits = credits;
  if (typeof renewalDateIso === "string") payload.renewal_date = renewalDateIso;
  payload.updated_at = new Date().toISOString();

  await supabase.from("user_credits").update(payload).eq("user_id", userId);
}

async function ensureCreditRowExists(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  const { row, err } = await selectCreditsRowFlexible({ supabase, userId });
  if (err) return; // do not block, caller will handle
  if (row) return;

  const now = new Date();
  await upsertCreditRowFlexible({
    supabase,
    userId,
    plan: "FREE",
    credits: FREE_MONTHLY_CREDITS,
    renewalDateIso: getNextRenewalDate(now).toISOString(),
  });
}

/**
 * Ensures credits are reset if renewal date has passed.
 * SAFE to call multiple times.
 * Also provisions a user_credits row if missing.
 */
export async function ensureCreditsFresh(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  await ensureCreditRowExists({ supabase, userId });

  const { row, err } = await selectCreditsRowFlexible({ supabase, userId });
  if (err || !row) return;

  const now = new Date();
  const renewalDate = row.renewal_date ? new Date(row.renewal_date) : null;

  if (!renewalDate || now < renewalDate) return;

  const plan = String(row.plan || "FREE").toUpperCase();
  const isPremium = plan === "PREMIUM";

  await updateCreditsFlexible({
    supabase,
    userId,
    credits: isPremium ? row.credits : FREE_MONTHLY_CREDITS,
    renewalDateIso: getNextRenewalDate(now).toISOString(),
  });
}

/**
 * SINGLE SOURCE OF TRUTH
 * - Ensures credits are fresh
 * - Decrements exactly once
 */
export async function decrementCreditIfAllowed(params: {
  supabase: SupabaseClient;
  userId: string;
  feature: string;
}): Promise<{ ok: boolean; remaining?: number; reason?: string }> {
  const { supabase, userId } = params;

  await ensureCreditsFresh({ supabase, userId });

  const { row, err } = await selectCreditsRowFlexible({ supabase, userId });
  if (err || !row) {
    return { ok: false, reason: "credits_unavailable" };
  }

  const plan = String(row.plan || "FREE").toUpperCase();

  if (plan === "PREMIUM") {
    return { ok: true };
  }

  if (row.credits <= 0) {
    return { ok: false, reason: "limit_reached" };
  }

  const remaining = row.credits - 1;

  await updateCreditsFlexible({
    supabase,
    userId,
    credits: remaining,
  });

  return { ok: true, remaining };
}
