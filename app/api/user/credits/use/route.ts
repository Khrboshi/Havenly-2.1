import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/user/credits/use
 * Consumes credits atomically via DB function:
 *   public.consume_reflection_credit(p_amount int) -> returns table(remaining_credits int)
 *
 * Body:
 *  - amount?: number (default 1)
 */
export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const amountRaw = body?.amount ?? 1;
    const amount = Number(amountRaw);

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("consume_reflection_credit", {
      p_amount: amount,
    });

    if (error) {
      const msg = String(error.message || "").toLowerCase();
      if (msg.includes("not_authenticated")) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      if (msg.includes("invalid_amount")) {
        return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
      }
      console.error("consume_reflection_credit error:", error);
      return NextResponse.json({ error: "Failed to consume credits" }, { status: 500 });
    }

    // Supabase RPC might return:
    // - [] when no row returned (not enough credits)
    // - [{ remaining_credits: n }] when success
    const row = Array.isArray(data) ? data[0] : data;

    const remaining =
      row && typeof (row as any).remaining_credits === "number"
        ? (row as any).remaining_credits
        : null;

    if (remaining === null) {
      return NextResponse.json({ error: "Reflection limit reached" }, { status: 402 });
    }

    return NextResponse.json({ ok: true, credits: remaining });
  } catch (err) {
    console.error("credits/use route error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
