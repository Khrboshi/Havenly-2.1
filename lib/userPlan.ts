// lib/userPlan.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export type PlanType = "FREE" | "PREMIUM" | "TRIAL" | null;

export interface UserPlanRow {
  user_id: string;
  plan_type: PlanType;
  credits_balance: number | null;
}

/**
 * Server-side helper to get the current user's plan and credits.
 * Call this from API routes or server components that already have a Supabase client.
 */
export async function getUserPlan(
  supabase: SupabaseClient,
  userId: string
): Promise<UserPlanRow | null> {
  const { data, error } = await supabase
    .from("user_plans")
    .select("user_id, plan_type, credits_balance")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getUserPlan error:", error);
    return null;
  }

  if (!data) {
    return {
      user_id: userId,
      plan_type: "FREE",
      credits_balance: 0,
    };
  }

  return {
    user_id: data.user_id,
    plan_type: (data.plan_type as PlanType) ?? "FREE",
    credits_balance: data.credits_balance ?? 0,
  };
}
