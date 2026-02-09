import { createServerSupabase } from "./server";
import { CreditRules } from "./creditRules";

export async function getUserPlan(userId: string) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("users")
    .select("plan, credits_remaining")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function canAccessFeature(
  userId: string,
  feature: keyof typeof CreditRules["free"]
) {
  const user = await getUserPlan(userId);
  const rules = CreditRules[user.plan as "free" | "premium"];
  if (rules[feature] === Infinity) return true;
  return user.credits_remaining > 0;
}
