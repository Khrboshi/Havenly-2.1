import { SupabaseClient } from "@supabase/supabase-js";

const FREE_MONTHLY_CREDITS = 5;

function getNextRenewalDate(from: Date) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d;
}

/**
 * Ensures credits are reset if renewal date has passed.
 * This is SAFE to call multiple times.
 */
export async function ensureCreditsFresh({
  supabase,
  userId,
}: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { data, error } = await supabase
    .from("user_credits")
    .select("credits, renewal_date, plan_type")
    .eq("user_id", userId)
    .single();

  if (error || !data) return;

  const now = new Date();
  const renewalDate = data.renewal_date
    ? new Date(data.renewal_date)
    : null;

  if (!renewalDate || now < renewalDate) return;

  const isPremium = data.plan_type === "PREMIUM";

  await supabase
    .from("user_credits")
    .update({
      credits: isPremium ? data.credits : FREE_MONTHLY_CREDITS,
      renewal_date: getNextRenewalDate(now).toISOString(),
    })
    .eq("user_id", userId);
}

/**
 * SINGLE SOURCE OF TRUTH
 * - Ensures credits are fresh
 * - Decrements exactly once
 */
export async function decrementCreditIfAllowed({
  supabase,
  userId,
  feature,
}: {
  supabase: SupabaseClient;
  userId: string;
  feature: string;
}): Promise<{ ok: boolean; remaining?: number; reason?: string }> {
  await ensureCreditsFresh({ supabase, userId });

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits, plan_type")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return { ok: false, reason: "credits_unavailable" };
  }

  if (data.plan_type === "PREMIUM") {
    return { ok: true };
  }

  if (data.credits <= 0) {
    return { ok: false, reason: "limit_reached" };
  }

  const remaining = data.credits - 1;

  await supabase
    .from("user_credits")
    .update({ credits: remaining })
    .eq("user_id", userId);

  return { ok: true, remaining };
}
