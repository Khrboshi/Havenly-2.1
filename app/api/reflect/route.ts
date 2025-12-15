import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const DAILY_FREE_LIMIT = 3;

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Missing journal content" },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);

    // Count today's reflections (stored in KV-style table via Supabase)
    const { count } = await supabase
      .from("reflection_usage")
      .select("id", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .eq("date", today);

    if ((count ?? 0) >= DAILY_FREE_LIMIT) {
      return NextResponse.json(
        { limitReached: true },
        { status: 403 }
      );
    }

    // 🔮 AI reflection (placeholder — swap model later)
    const reflection = `Here is a thoughtful reflection on your entry:\n\n"${content.slice(
      0,
      200
    )}..."`;

    // Log usage (NO journal linkage)
    await supabase.from("reflection_usage").insert({
      user_id: session.user.id,
      date: today,
    });

    return NextResponse.json({ reflection });
  } catch (err) {
    console.error("Reflection error:", err);
    return NextResponse.json(
      { error: "Reflection failed" },
      { status: 500 }
    );
  }
}
