import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

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
    const amountRaw = body.amount;
    const source = body.source ? String(body.source) : "PURCHASE";
    const description = body.description ? String(body.description) : "Credits added";

    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400 }
      );
    }

    // Ensure user_credits row exists and is current
    await ensureCreditsFresh({ supabase, userId: user.id });

    // Fetch current remaining_credits
    const { data: row, error: rowErr } = await supabase
      .from("user_credits")
      .select("remaining_credits")
      .eq("user_id", user.id)
      .maybeSingle();

    if (rowErr || !row) {
      console.error("Error fetching user_credits in credits/add:", rowErr);
      return NextResponse.json({ error: "Could not load current credits." }, { status: 500 });
    }

    const current = typeof (row as any).remaining_credits === "number" ? (row as any).remaining_credits : 0;
    const newBalance = current + amount;

    const { data: updated, error: updateErr } = await supabase
      .from("user_credits")
      .update({ remaining_credits: newBalance })
      .eq("user_id", user.id)
      .select("remaining_credits")
      .single();

    if (updateErr || !updated) {
      console.error("Error updating remaining_credits (add):", updateErr);
      return NextResponse.json({ error: "Failed to add credits." }, { status: 500 });
    }

    // Log transaction (optional)
    const { error: txError } = await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount,
      tx_type: source === "ADJUSTMENT" ? "ADJUSTMENT" : "PURCHASE",
      related_feature: null,
      description,
    });

    if (txError) console.error("Error inserting credit_transactions (ADD):", txError);

    return NextResponse.json(
      { success: true, credits: (updated as any).remaining_credits ?? newBalance, message: "Credits added successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error in POST /api/user/credits/add:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while adding credits." },
      { status: 500 }
    );
  }
}
