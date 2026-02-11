// app/(protected)/insights/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import InsightsClient from "./InsightsClient";

export const dynamic = "force-dynamic";

type PlanType = "FREE" | "TRIAL" | "PREMIUM";

/**
 * Adjust this function ONLY if your plan is stored in a different table/column.
 * Common patterns:
 * - profiles.plan_type
 * - profiles.plan
 * - subscriptions.plan_type
 */
async function getUserPlanType(
  supabase: ReturnType<typeof createServerSupabase>,
  userId: string
): Promise<PlanType> {
  // Try profiles first
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("plan_type, plan, tier")
    .eq("id", userId)
    .maybeSingle();

  if (!profileErr && profile) {
    const raw = (profile.plan_type || profile.plan || profile.tier || "").toString().toUpperCase();
    if (raw === "PREMIUM") return "PREMIUM";
    if (raw === "TRIAL") return "TRIAL";
    return "FREE";
  }

  // Fallback to FREE if not found (safe default)
  return "FREE";
}

export default async function InsightsPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) redirect("/magic-login");

  const planType = await getUserPlanType(supabase, session.user.id);

  // ✅ Premium-only gate
  if (planType !== "PREMIUM") {
    redirect("/insights/preview");
  }

  return (
    <div className="space-y-8">
      <InsightsClient />
    </div>
  );
}
