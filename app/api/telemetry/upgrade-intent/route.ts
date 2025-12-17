import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Telemetry endpoint for upgrade intent
 * - Records modal views & clicks
 * - Never blocks UX
 * - Used ONLY for decision-making (Stripe later)
 */
export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const body = await req.json();

    const {
      event,
      source = "unknown",
      path = "",
      ts = new Date().toISOString(),
    } = body ?? {};

    // Try to associate with user if logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("upgrade_intents").insert({
      user_id: user?.id ?? null,
      event,
      source,
      path,
      created_at: ts,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("upgrade-intent telemetry error", err);
    return NextResponse.json({ ok: true });
  }
}
