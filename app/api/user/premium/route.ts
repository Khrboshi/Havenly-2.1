import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Returns the user's plan + remaining reflection credits.
 * Also bootstraps a row in public.user_plans on first use.
 */
export async function GET() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure row exists
  await supabase.from("user_plans").upsert(
    {
      user_id: user.id,
    },
    { onConflict: "user_id" }
  );

  const { data, error } = await supabase
    .from("user_plans")
    .select("plan_type, reflection_credits, renewal_date")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Failed to load plan" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    planType: data.plan_type,
    credits: data.reflection_credits,
    renewalDate: data.renewal_date,
  });
}
