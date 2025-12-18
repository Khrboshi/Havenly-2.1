import { SupabaseClient } from "@supabase/supabase-js";

const FREE_MONTHLY_CREDITS = 3;

export type PlanType = "FREE" | "TRIAL" | "PREMIUM";

/* ---------------------------------------------
   READ PLAN TYPE (single source of truth)
---------------------------------------------- */
async function getPlanTypeForUser(params: {
  supabase: SupabaseClient;
  userId: string;
}): Promise<PlanType> {
  const { supabase, userId } = params;

  const { data } = await supabase
    .from("user_credits")
    .select("plan_type")
    .eq("user_id", userId)
    .maybeSingle();

  if (data?.plan_type === "PREMIUM" || data?.plan_type === "TRIAL") {
    return data.plan_type;
  }

  return "FREE";
}

/* ---------------------------------------------
   ENSURE CREDIT ROW EXISTS
---------------------------------------------- */
async function ensureCreditRowExists(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  const { data } = await supabase
    .from("user_credits")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) {
    await supabase.from("user_credits").insert({
      user_id: userId,
      plan_type: "FREE",
      credits: FREE_MONTHLY_CREDITS,
      updated_at: new Date().toISOString(),
    });
  }
}

/* ---------------------------------------------
   ✅ EXPORT: ENSURE CREDITS FRESH (FREE ONLY)
---------------------------------------------- */
export async function ensureCreditsFresh(params: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = params;

  await ensureCreditRowExists({ supabase, userId });

  const planType = await getPlanTypeForUser({ supabase, userId });
  if (planType !== "FREE") return;

  const { data } = await supabase
    .from("user_credits")
    .select("credits, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  const now = new Date();

  if (
    !data?.updated_at ||
    new Date(data.updated_at).getUTCMonth() !== now.getUTCMonth() ||
    new Date(data.updated_at).getUTCFullYear() !== now.getUTCFullYear()
  ) {
    await supabase
      .from("user_credits")
      .update({
        credits: FREE_MONTHLY_CREDITS,
        updated_at: now.toISOString(),
      })
      .eq("user_id", userId);
  }
}

/* ---------------------------------------------
   CREDIT DECREMENT (USED BY AI ROUTES)
---------------------------------------------- */
export async function decrementCreditIfAllowed(params: {
  supabase: SupabaseClient;
  userId: string;
  feature: string;
}): Promise<{ ok: boolean; remaining?: number; reason?: string }> {
  const { supabase, userId } = params;

  await ensureCreditsFresh({ supabase, userId });

  const planType = await getPlanTypeForUser({ supabase, userId });
  if (planType !== "FREE") {
    return { ok: true };
  }

  const { data } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data || data.credits <= 0) {
    return { ok: false, reason: "limit_reached" };
  }

  const remaining = data.credits - 1;

  await supabase
    .from("user_credits")
    .update({
      credits: remaining,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return { ok: true, remaining };
}
