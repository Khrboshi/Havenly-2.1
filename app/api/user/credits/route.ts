import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { decrementCreditIfAllowed } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Ensure credits are fresh WITHOUT consuming
  await decrementCreditIfAllowed({
    supabase,
    userId,
    feature: "__noop__",
  });

  const { data, error } = await supabase
    .from("user_credits")
    .select("plan_type, credits_remaining, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Failed to load credits" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    planType: data?.plan_type ?? "FREE",
    credits: data?.credits_remaining ?? 0,
    renewalDate: data?.updated_at ?? null,
  });
}
