// lib/userPlan.ts

import { createServerSupabase } from "./supabase/server";
import { PLAN_CREDIT_ALLOWANCES, computeNextRenewalDate, PlanType } from "./creditRules";

export async function getUserPlan(userId: string) {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("user_plans")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    // Default to FREE if no plan exists yet
    return {
      planType: "FREE" as PlanType,
      credits: PLAN_CREDIT_ALLOWANCES.FREE,
      renewalDate: computeNextRenewalDate(),
    };
    }

  // Monthly reset logic
  const today = new Date();
  const renewal = data.renewal_date ? new Date(data.renewal_date) : today;

  let credits = data.credits;
  let renewalDate = renewal.toISOString();

  // If renewal date has passed → reset credits
  if (today > renewal) {
    const defaultCredits = PLAN_CREDIT_ALLOWANCES[data.plan_type as PlanType];
    credits = defaultCredits;
    renewalDate = computeNextRenewalDate();

    // Persist the reset
    await supabase
      .from("user_plans")
      .update({
        credits,
        renewal_date: renewalDate,
      })
      .eq("user_id", userId);
  }

  return {
    planType: data.plan_type as PlanType,
    credits,
    renewalDate,
  };
}

export async function deductCredit(userId: string, amount: number = 1) {
  const supabase = await createServerSupabase();

  // Fetch fresh plan
  const plan = await getUserPlan(userId);

  if (plan.credits < amount) {
    return { success: false, error: "INSUFFICIENT_CREDITS" };
  }

  const newCredits = plan.credits - amount;

  const { error } = await supabase
    .from("user_plans")
    .update({ credits: newCredits })
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: "DEDUCTION_FAILED" };
  }

  return { success: true, credits: newCredits, planType: plan.planType };
}

export async function ensurePlanRow(userId: string) {
  const supabase = await createServerSupabase();

  // Check if exists
  const { data } = await supabase
    .from("user_plans")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) return;

  await supabase.from("user_plans").insert({
    user_id: userId,
    plan_type: "FREE",
    credits: PLAN_CREDIT_ALLOWANCES.FREE,
    renewal_date: computeNextRenewalDate(),
  });
}
