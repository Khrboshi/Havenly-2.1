import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

/**
 * GET /api/user/credits
 * Canonical credit balance lives in: public.user_credits.remaining_credits
 * API response keeps "credits" for backward compatibility with the UI.
 */
export async function GET() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in
  if (!user) {
    return NextResponse.json(
      { credits: 0, renewalDate: null },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  // Make sure the row exists / renewal logic is applied (your app logic)
  await ensureCreditsFresh({ supabase, userId: user.id });

  // Fetch the canonical data from the updated schema
  const { data, error } = await supabase
    .from("user_credits")
    .select("remaining_credits, renewal_date")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    // Fail safe: do not break the dashboard if DB read fails
    return NextResponse.json(
      { credits: 0, renewalDate: null },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const credits =
    typeof data?.remaining_credits === "number" ? data.remaining_credits : 0;

  const renewalDate = data?.renewal_date ?? null;

  return NextResponse.json(
    { credits, renewalDate },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
