// app/api/user/credits/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ensureCreditsFresh } from "@/lib/creditRules";

export const dynamic = "force-dynamic";

/**
 * Returns remaining credits for the authenticated user.
 * Canonical source: user_credits. Safe to call from dashboard.
 */
export async function GET() {
  try {
    const supabase = createServerSupabase();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    await ensureCreditsFresh({ supabase, userId });

    const { data, error } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("GET /api/user/credits failed:", error);
      return NextResponse.json({ credits: 0 }, { status: 200 });
    }

    const credits =
      typeof (data as any)?.credits === "number" ? (data as any).credits : 0;

    return NextResponse.json(
      { credits },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("GET /api/user/credits failed:", err);
    return NextResponse.json({ credits: 0 }, { status: 200 });
  }
}
