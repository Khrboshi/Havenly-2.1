import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

/**
 * POST /api/user/credits/add
 * SECURITY: locked behind x-credits-admin-key header.
 *
 * Adds credits by updating public.user_credits.remaining_credits.
 *
 * Body:
 *  - amount: number (required, >0)
 *  - source?: "PURCHASE" | "ADJUSTMENT"
 *  - description?: string
 */
export async function POST(request: Request) {
  try {
    const adminKey = process.env.CREDITS_ADMIN_KEY || "";
    const reqKey = request.headers.get("x-credits-admin-key") || "";

    if (!adminKey || reqKey !== adminKey) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const amount = Number(body?.amount);
    const source = body?.source ? String(body.source) : "PURCHASE";
    const description = body?.description ? String(body.description) : "Credits added";

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }

    // Ensure row exists + monthly reset (FREE)
    await ensureCreditsFresh({ supabase, userId: user.id });

    // Fetch current
    const { data: row, error: getErr } = await supabase
      .from("user_credits")
      .select("remaining_credits")
      .eq("user_id", user.id)
      .maybeSingle();

    if (getErr) {
      console.error("credits/add fetch error:", getErr);
      return NextResponse.json({ error: "Could not load current credits" }, { status: 500 });
    }

    const current = typeof row?.remaining_credits === "number" ? row.remaining_credits : 0;
    const newBalance = current + amount;

    // Update
    const { data: updated, error: updateErr } = await supabase
      .from("user_credits")
      .update({ remaining_credits: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .select("remaining_credits")
      .single();

    if (updateErr || !updated) {
      console.error("credits/add update error:", updateErr);
      return NextResponse.json({ error: "Failed to add credits" }, { status: 500 });
    }

    // Best-effort log
    const { error: txErr } = await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount,
      tx_type: source === "ADJUSTMENT" ? "ADJUSTMENT" : "PURCHASE",
      related_feature: "AI_REFLECTION",
      description,
    });

    if (txErr) console.error("credits/add tx log error:", txErr);

    return NextResponse.json(
      { success: true, credits: updated.remaining_credits, message: "Credits added successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error in POST /api/user/credits/add:", err);
    return NextResponse.json({ success: false, error: "Unexpected error while adding credits." }, { status: 500 });
  }
}
