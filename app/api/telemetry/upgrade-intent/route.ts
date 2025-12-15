import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If not logged in, we silently ignore
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    const body = await req.json();
    const source =
      typeof body?.source === "string" ? body.source : "unknown";

    await supabase.from("plan_history").insert({
      user_id: user.id,
      old_plan_type: "FREE",
      new_plan_type: "FREE",
      reason: `upgrade_intent:${source}`,
      changed_by: "USER",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Telemetry must NEVER break UX
    return NextResponse.json({ ok: true });
  }
}
