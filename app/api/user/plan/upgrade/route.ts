import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // ⚠️ TEMPORARY: Simulated successful upgrade
  // Replace with Stripe webhook confirmation later
  const { error } = await supabase
    .from("user_credits")
    .update({
      plan_type: "PREMIUM",
      reflections_remaining: null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    console.error("Upgrade failed:", error);
    return NextResponse.json(
      { error: "Failed to upgrade plan" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
