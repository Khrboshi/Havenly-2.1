export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const FREE_REFLECTION_LIMIT = 3;

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();
    const body = await req.json();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { entryId, reflection } = body;

    if (!entryId || !reflection) {
      return NextResponse.json(
        { error: "Missing reflection data" },
        { status: 400 }
      );
    }

    /** 1️⃣ Check user plan */
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("plan")
      .eq("user_id", user.id)
      .single();

    const isPremium = profile?.plan === "premium";

    /** 2️⃣ Enforce limit for free users */
    if (!isPremium) {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("journal_entries")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .not("ai_reflection", "is", null)
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

    /** 3️⃣ Save reflection */
    const { error: updateError } = await supabase
      .from("journal_entries")
      .update({ ai_reflection: reflection })
      .eq("id", entryId)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("AI reflection error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
