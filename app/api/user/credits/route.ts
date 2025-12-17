import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ credits: 0 });
  }

  await ensureCreditsFresh({
    supabase,
    userId: user.id,
  });

  const { data } = await supabase
    .from("user_credits")
    .select("credits, renewal_date, plan_type")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({
    credits: data?.credits ?? 0,
    renewalDate: data?.renewal_date ?? null,
    planType: data?.plan_type ?? "FREE",
  });
}
