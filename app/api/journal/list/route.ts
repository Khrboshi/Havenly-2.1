import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
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

    const { data, error } = await supabase
      .from("journal_entries")
      .select("id, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error listing journal entries:", error);
      return NextResponse.json(
        { error: "Failed to load reflections." },
        { status: 500 }
      );
    }

    const entries =
      data?.map((row) => ({
        id: row.id as string,
        content: row.content as string,
        createdAt: row.created_at as string,
      })) ?? [];

    return NextResponse.json({ entries });
  } catch (err: any) {
    console.error("Unexpected error in /api/journal/list:", err);
    return NextResponse.json(
      { error: "Unexpected error." },
      { status: 500 }
    );
  }
}
