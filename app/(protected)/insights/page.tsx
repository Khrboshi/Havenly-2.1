import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { type PlanType } from "@/lib/planUtils";
import InsightsClient from "./InsightsClient";

export const dynamic = "force-dynamic";

// Local type — replace with generated Supabase types when available
type UserPlanRow = { plan_type: string | null };

function normalizePlan(v: unknown): PlanType {
  const p = String(v ?? "FREE").toUpperCase();
  return p === "PREMIUM" || p === "TRIAL" ? (p as PlanType) : "FREE";
}

export default async function InsightsPage() {
  const supabase = await createServerSupabase();

  // ✅ Use getUser() once — middleware already validated session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/magic-login");

  // ✅ Single query, no ensureCreditsFresh — saves 2 round trips
  const { data } = await supabase
    .from("user_credits")
    .select("plan_type")
    .eq("user_id", user.id)
    .maybeSingle();

  const planType = normalizePlan((data as UserPlanRow | null)?.plan_type);

  if (planType !== "PREMIUM" && planType !== "TRIAL") {
    redirect("/insights/preview");
  }

  return (
    <div className="space-y-8">
      <InsightsClient />
    </div>
  );
}
