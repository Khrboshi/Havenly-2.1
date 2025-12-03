import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createServerSupabase();

    // Force refresh session
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error("Silent refresh error:", error);
      return NextResponse.json({ refreshed: false });
    }

    return NextResponse.json({ refreshed: true, user: data?.user ?? null });
  } catch (err) {
    console.error("Silent refresh crash:", err);
    return NextResponse.json({ refreshed: false });
  }
}
