import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh, PlanType } from "@/lib/creditRules";
import InsightsClient from "./InsightsClient";

export const dynamic = "force-dynamic";

function normalizePlan(v: unknown): PlanType {
  const p = String(v ?? "FREE").toUpperCase();
  return p === "PREMIUM" || p === "TRIAL" ? (p as PlanType) : "FREE";
}

export default async function InsightsPage() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) redirect("/magic-login");

  await ensureCreditsFresh({ supabase, userId: session.user.id });

  const { data } = await supabase
    .from("user_credits")
    .select("plan_type")
    .eq("user_id", session.user.id)
    .maybeSingle();

  const planType = normalizePlan((data as any)?.plan_type);

  // Premium-only gate → send everyone else to preview
  if (planType !== "PREMIUM") {
    redirect("/insights/preview");
  }

  return (
    <div className="space-y-8">
      <InsightsClient />
    </div>
  );
}
