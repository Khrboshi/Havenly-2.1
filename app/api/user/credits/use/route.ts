import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const amountRaw = body.amount;
    const feature = body.feature ? String(body.feature) : null;
    const description = body.description
      ? String(body.description)
      : "Credits used";

    const amount = Number(amountRaw);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "amount must be a positive number" },
        { status: 400 }
      );
    }

    // Get current plan row
    const { data: planRow, error: planError } = await supabase
      .from("user_plans")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (planError || !planRow) {
      console.error("Error fetching user_plans in credits/use:", planError);
      return NextResponse.json(
        { error: "Could not load current credits." },
        { status: 500 }
      );
    }

    const currentCredits = planRow.credits_balance ?? 0;

    if (currentCredits < amount) {
      return NextResponse.json(
        {
          error: "INSUFFICIENT_CREDITS",
          message: "You do not have enough credits for this action.",
          credits: currentCredits,
        },
        { status: 400 }
      );
    }

    const newBalance = currentCredits - amount;

    // Update balance
    const { data: updatedPlan, error: updateError } = await supabase
      .from("user_plans")
      .update({ credits_balance: newBalance })
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError || !updatedPlan) {
      console.error("Error updating credits_balance:", updateError);
      return NextResponse.json(
        { error: "Failed to update credits." },
        { status: 500 }
      );
    }

    // Log transaction
    const { error: txError } = await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: -amount,
      tx_type: "USAGE",
      related_feature: feature,
      description,
    });

    if (txError) {
      console.error("Error inserting credit_transactions (USAGE):", txError);
    }

    return NextResponse.json(
      {
        success: true,
        credits: updatedPlan.credits_balance ?? newBalance,
        message: "Credits deducted successfully.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error in POST /api/user/credits/use:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while using credits.",
      },
      { status: 500 }
    );
  }
}
