export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const FREE_REFLECTION_LIMIT = 3;

function asJsonString(v: unknown): string | null {
  if (!v) return null;
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v);
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const body = await req.json().catch(() => ({}));

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entryId = typeof body?.entryId === "string" ? body.entryId.trim() : "";
    const reflectionStr = asJsonString(body?.reflection);

    if (!entryId || !reflectionStr) {
      return NextResponse.json({ error: "Missing reflection data" }, { status: 400 });
    }

    // 1) Check user plan (keep your existing logic)
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    const isPremium = profile?.plan === "premium";

    // 2) Enforce weekly limit for free users (based on ai_response)
    if (!isPremium) {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("journal_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .not("ai_response", "is", null)
        .gte("updated_at", startOfWeek.toISOString());

      if ((count || 0) >= FREE_REFLECTION_LIMIT) {
        return NextResponse.json(
          {
            error: "limit_reached",
            message:
              "You’ve reached your weekly AI reflection limit. Upgrade to Premium for unlimited reflections.",
          },
          { status: 402 }
        );
      }
    }

    // 3) Save reflection to ai_response (standardized)
    const { error: updateError } = await supabase
      .from("journal_entries")
      .update({ ai_response: reflectionStr })
      .eq("id", entryId)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("AI reflection error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
