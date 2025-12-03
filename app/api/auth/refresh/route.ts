// app/api/auth/refresh/route.ts

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic"; // ensures it always runs on server

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabase();

    // Attempt to refresh session
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Session refresh error:", error);
      return NextResponse.json({ refreshed: false, error: error.message });
    }

    return NextResponse.json({ refreshed: true, session });
  } catch (err: any) {
    console.error("Unexpected refresh API error:", err);
    return NextResponse.json({ refreshed: false });
  }
}
