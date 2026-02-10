import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/user/credits/use
 * Consumes reflection credits via RPC:
 *   consume_reflection_credit(p_amount int)
 *
 * Expected RPC return:
 *  - remaining_credits (preferred)
 *  - credits (legacy fallback)
 *
 * Response:
 *  - 200: { ok: true, credits: number }
 *  - 402: { error: "No credits remaining" }
 *  - 401/400/500 as appropriate
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

    // Atomic DB function
    const { data, error } = await supabase.rpc("consume_reflection_credit", {
      p_amount: amount,
    });

    if (error) {
      const msg = String(error.message || "");
      if (msg.toLowerCase().includes("not_authenticated")) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
      console.error("consume_reflection_credit error:", error);
      return NextResponse.json({ error: "Failed to consume credits" }, { status: 500 });
    }

    const row = Array.isArray(data) ? data[0] : data;

    const remaining =
      row && typeof (row as any).remaining_credits === "number"
        ? (row as any).remaining_credits
        : row && typeof (row as any).credits === "number"
        ? (row as any).credits
        : null;

    if (remaining === null) {
      return NextResponse.json({ error: "No credits remaining" }, { status: 402 });
    }

    return NextResponse.json({ ok: true, credits: remaining });
  } catch (err) {
    console.error("credits/use route error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
