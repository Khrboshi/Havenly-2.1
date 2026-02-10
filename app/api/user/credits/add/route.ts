import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

/**
 * POST /api/user/credits/add
 * Adds reflection credits by updating public.user_credits.remaining_credits.
 *
 * Body:
 *  - amount: number (required, >0)
 *  - source: string (optional) e.g. "PURCHASE" | "ADJUSTMENT"
 *  - description: string (optional)
 */
export async function POST(request: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const amountRaw = body?.amount;
    const source = body?.source ? String(body.source) : "PURCHASE";
    const description = body?.description
      ? String(body.description)
      : "Credits added";

    const amount = Number(amountRaw);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400 }
      );
    }

    // Make sure the row exists and monthly reset logic is applied (FREE users)
    await ensureCreditsFresh({ supabase, userId: user.id });

    // Read current remaining_credits
    const { data: creditsRow, error: creditsErr } = await supabase
      .from("user_credits")
      .select("remaining_credits")
      .eq("user_id", user.id)
      .maybeSingle();

    if (creditsErr) {
      console.error("Error fetching user_credits in credits/add:", creditsErr);
      return NextResponse.json(
        { error: "Could not load current credits." },
        { status: 500 }
      );
    }

    const current = typeof creditsRow?.remaining_credits === "number"
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
      console.error("Error updating remaining_credits (add):", updateErr);
      return NextResponse.json(
        { error: "Failed to add credits." },
        { status: 500 }
      );
    }

    // Log transaction (best-effort)
    const { error: txError } = await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount,
      tx_type: source === "ADJUSTMENT" ? "ADJUSTMENT" : "PURCHASE",
      related_feature: "AI_REFLECTION",
      description,
    });

    if (txError) {
      console.error("Error inserting credit_transactions (ADD):", txError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json(
      {
        success: true,
        credits: updated.remaining_credits,
        message: "Credits added successfully.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error in POST /api/user/credits/add:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error while adding credits." },
      { status: 500 }
    );
  }
}
