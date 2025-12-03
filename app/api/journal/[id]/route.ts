import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

interface RouteContext {
  params: { id: string };
}

export async function GET(_req: Request, ctx: RouteContext) {
  const { id } = ctx.params;

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
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Error loading journal entry:", error);
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({
      entry: {
        id: data.id,
        content: data.content,
        createdAt: data.created_at,
      },
    });
  } catch (err: any) {
    console.error("Unexpected error in /api/journal/[id]:", err);
    return NextResponse.json(
      { error: "Unexpected error." },
      { status: 500 }
    );
  }
}
