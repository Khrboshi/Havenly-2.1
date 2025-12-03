import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const content = String(body.content || "").trim();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        content,
      })
      .select("id, content, created_at")
      .single();

    if (error || !data) {
      console.error("Error creating journal entry:", error);
      return NextResponse.json(
        { error: "Failed to save reflection." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      entry: {
        id: data.id,
        content: data.content,
        createdAt: data.created_at,
      },
    });
  } catch (err: any) {
    console.error("Unexpected error in /api/journal/create:", err);
    return NextResponse.json(
      { error: "Unexpected error." },
      { status: 500 }
    );
  }
}
