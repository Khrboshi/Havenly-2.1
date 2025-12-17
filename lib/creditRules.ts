import { SupabaseClient } from "@supabase/supabase-js";

const FREE_MONTHLY_CREDITS = 3;

function getNextRenewalDate(from: Date) {
  const d = new Date(from);
  d.setMonth(d.getMonth() + 1);
  return d;
}

async function ensureCreditRowExists({
  supabase,
  userId,
}: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { data } = await supabase
    .from("user_credits")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.user_id) return;

  const now = new Date();

  await supabase.from("user_credits").upsert(
    {
      user_id: userId,
      plan_type: "FREE",
      credits: FREE_MONTHLY_CREDITS,
      renewal_date: getNextRenewalDate(now).toISOString(),
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id" }
  );
}

export async function ensureCreditsFresh({
  supabase,
  userId,
}: {
  supabase: SupabaseClient;
  userId: string;
}) {
  await ensureCreditRowExists({ supabase, userId });

  const { data } = await supabase
    .from("user_credits")
    .select("credits, renewal_date, plan_type")
    .eq("user_id", userId)
    .single();

  if (!data) return;

  const now = new Date();
  const renewalDate = data.renewal_date
    ? new Date(data.renewal_date)
    : null;

  if (!renewalDate || now < renewalDate) return;

  await supabase
    .from("user_credits")
    .update({
      credits:
        data.plan_type === "PREMIUM"
          ? data.credits
          : FREE_MONTHLY_CREDITS,
      renewal_date: getNextRenewalDate(now).toISOString(),
    })
    .eq("user_id", userId);
}

/**
 * CHECK ONLY — does NOT mutate credits
 */
export async function canConsumeCredit({
  supabase,
  userId,
}: {
  supabase: SupabaseClient;
  userId: string;
}): Promise<{ ok: boolean; credits?: number }> {
  await ensureCreditsFresh({ supabase, userId });

  const { data } = await supabase
    .from("user_credits")
    .select("credits, plan_type")
    .eq("user_id", userId)
    .single();

  if (!data) return { ok: false };

  if (data.plan_type === "PREMIUM") {
    return { ok: true };
  }

  if (data.credits <= 0) {
    return { ok: false };
  }

  return { ok: true, credits: data.credits };
}

/**
 * MUTATE — called ONLY after success
 */
export async function consumeCredit({
  supabase,
  userId,
}: {
  supabase: SupabaseClient;
  userId: string;
}) {
  await supabase.rpc("decrement_user_credit", { uid: userId });
}
