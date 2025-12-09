import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const body = await req.json();

    const { journalId, reflection } = body;

    if (!journalId || !reflection) {
      return NextResponse.json(
        { success: false, error: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("journal_entries")
      .update({ reflection })
      .eq("id", journalId);

    if (error) {
      console.error("Update reflection error:", error);
      return NextResponse.json(
        { success: false, error: "UPDATE_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update reflection API error:", err);
    return NextResponse.json(
      { success: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
