import { createServerSupabase } from "./supabase/server";

export type PlanType = "FREE" | "TRIAL" | "PREMIUM";

export async function getUserPlan(userId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("user_credits")
    .select("plan_type, credits, renewal_date")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return {
      planType: "FREE" as PlanType,
      credits: 0,
      renewalDate: null,
    };
  }

  return {
    planType: (data.plan_type as PlanType) ?? "FREE",
    credits: data.credits ?? 0,
    renewalDate: data.renewal_date ?? null,
  };
}
