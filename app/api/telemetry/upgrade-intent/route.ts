import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Records user intent to upgrade (NO payments).
 * Used to validate real demand before enabling Stripe.
 */
export async function POST(req: Request) {
  const supabase = await createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ ok: true }); // anonymous intent ignored
  }

  const body = await req.json().catch(() => ({}));
  const source = body?.source ?? "unknown";

  await supabase.from("upgrade_intents").insert({
    user_id: session.user.id,
    source,
  });

  return NextResponse.json({ ok: true });
}
