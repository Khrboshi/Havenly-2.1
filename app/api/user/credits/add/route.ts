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
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }

    // Ensure row exists / monthly logic applied before we add
    await ensureCreditsFresh({ supabase, userId: user.id });

    // Read current remaining_credits
    const { data: creditRow, error: creditErr } = await supabase
      .from("user_credits")
      .select("remaining_credits")
      .eq("user_id", user.id)
      .maybeSingle();

    if (creditErr || !creditRow) {
      console.error("Error fetching user_credits in credits/add:", creditErr);
      return NextResponse.json({ error: "Could not load current credits." }, { status: 500 });
    }

    const current = typeof (creditRow as any).remaining_credits === "number" ? (creditRow as any).remaining_credits : 0;
    const newBalance = current + amount;

    // Update
    const { data: updated, error: updateError } = await supabase
      .from("user_credits")
      .update({ remaining_credits: newBalance })
      .eq("user_id", user.id)
      .select("remaining_credits")
      .single();

    if (updateError || !updated) {
      console.error("Error updating remaining_credits (add):", updateError);
      return NextResponse.json({ error: "Failed to add credits." }, { status: 500 });
    }

    // Log transaction (optional, but good)
    const { error: txError } = await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount,
      tx_type: source === "ADJUSTMENT" ? "ADJUSTMENT" : "PURCHASE",
      related_feature: null,
      description,
    });

    if (txError) console.error("Error inserting credit_transactions (ADD):", txError);

    return NextResponse.json(
      {
        success: true,
        credits: (updated as any).remaining_credits ?? newBalance,
        message: "Credits added successfully.",
      },
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
