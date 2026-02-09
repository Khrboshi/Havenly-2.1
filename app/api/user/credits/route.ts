import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/credits
 * Canonical credit balance: user_credits.credits
 * renewalDate is null because your schema does not include renewal_date.
 */
export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { credits: 0, renewalDate: null },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  await ensureCreditsFresh({ supabase, userId: user.id });

  const { data } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", user.id)
    .maybeSingle();

  const credits = typeof data?.credits === "number" ? data.credits : 0;

  return NextResponse.json(
    { credits, renewalDate: null },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
