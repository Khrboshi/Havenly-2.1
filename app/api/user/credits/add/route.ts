import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

function unauthorized() {
  // Don't leak whether env var exists or which part failed
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function POST(request: Request) {
  try {
    // 1) Admin key gate (server-side only)
    const adminKey = process.env.CREDITS_ADMIN_KEY || "";
    const headerKey = request.headers.get("x-credits-admin-key") || "";

    if (!adminKey || headerKey !== adminKey) {
      return unauthorized();
    }

    const supabase = createServerSupabase();

    // Optional: still require a signed-in user (keeps behavior consistent)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const amount = Number(body?.amount);

    const source = body?.source ? String(body.source) : "ADJUSTMENT";
    const description = body?.description
      ? String(body.description)
      : "Credits added";

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400 }
      );
    }

    // Ensure row exists + apply FREE monthly reset logic
    await ensureCreditsFresh({ supabase, userId: user.id });

    // Read current remaining_credits
    const { data: creditsRow, error: creditsErr } = await supabase
      .from("user_credits")
      .select("remaining_credits")
      .eq("user_id", user.id)
      .maybeSingle();

    if (creditsErr) {
      console.error("credits/add read user_credits error:", creditsErr);
      return NextResponse.json(
        { error: "Could not load current credits." },
        { status: 500 }
      );
    }

    const current =
      typeof creditsRow?.remaining_credits === "number"
        ? creditsRow.remaining_credits
        : 0;

    const newBalance = current + amount;

    // Update remaining_credits
    const { data: updated, error: updateErr } = await supabase
      .from("user_credits")
      .update({
        remaining_credits: newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .select("remaining_credits")
      .single();

    if (updateErr || !updated) {
      console.error("credits/add update error:", updateErr);
      return NextResponse.json(
        { error: "Failed to add credits." },
        { status: 500 }
      );
    }

    // Best-effort log
    const { error: txError } = await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount,
      tx_type: source === "PURCHASE" ? "PURCHASE" : "ADJUSTMENT",
      related_feature: "AI_REFLECTION",
      description,
    });

    if (txError) console.error("credits/add tx log error:", txError);

    return NextResponse.json(
      { success: true, credits: updated.remaining_credits },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error in POST /api/user/credits/add:", err);
    return NextResponse.json(
      { error: "Unexpected error while adding credits." },
      { status: 500 }
    );
  }
}
