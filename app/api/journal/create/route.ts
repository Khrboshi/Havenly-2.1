export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase();

    // 1. Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2. Parse and validate body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const content = String(body?.content || "").trim();
    const title = String(body?.title || "").trim();

    if (!content) {
      return NextResponse.json(
        { error: "Journal content is required" },
        { status: 400 }
      );
    }

    // 3. Insert journal entry
    const { data, error } = await supabase
      .from("journal")
      .insert({
        user_id: user.id,
        content,
        title: title || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Journal insert error:", error);
      return NextResponse.json(
        { error: "Failed to save journal entry" },
        { status: 400 }
      );
    }

    // 4. Success
    return NextResponse.json({ success: true, journal: data });
  } catch (err) {
    console.error("Journal create fatal error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
