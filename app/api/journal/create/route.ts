export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type CreateJournalBody = {
  title?: string | null;
  content?: string | null;
};

export async function POST(req: Request) {
  try {
    // IMPORTANT: In many setups createServerSupabase() is async.
    // Awaiting it avoids “missing session / cookies” edge cases.
    const supabase = await createServerSupabase();

    let body: CreateJournalBody | null = null;
    try {
      body = (await req.json()) as CreateJournalBody;
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const titleRaw = typeof body?.title === "string" ? body.title : "";
    const contentRaw = typeof body?.content === "string" ? body.content : "";

    const title = titleRaw.trim().slice(0, 120) || null;
    const content = contentRaw.trim();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const { data, error } = await supabase
      .from("journal")
      .insert({
        user_id: user.id,
        title,
        content,
      })
      // return only what the UI needs
      .select("id, title, content, created_at")
      .single();

    if (error) {
      // Common causes: RLS policy missing, column mismatch, table name mismatch
      return NextResponse.json(
        {
          error: error.message,
          hint:
            "If this persists, verify Supabase RLS insert policy on `journal` for authenticated users and that columns are: user_id, title, content.",
        },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(data, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error.", detail: String(e?.message || e) },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
