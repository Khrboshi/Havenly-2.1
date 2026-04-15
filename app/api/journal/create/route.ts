export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

const MAX_CONTENT_LENGTH = 20000;

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const body = await req.json();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!body?.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Match the same cap enforced by the reflection API.
    // Rejects at write time rather than failing silently on reflection.
    if (body.content.trim().length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: "Entry too long. Please shorten it a bit." },
        { status: 413 }
      );
    }

    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        title: body.title?.trim() || null,
        content: body.content.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Journal insert error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, entry: data });
  } catch (err) {
    console.error("Unexpected journal error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
