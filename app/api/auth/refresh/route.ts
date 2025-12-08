import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createServerSupabase();

  // This triggers Supabase to refresh the cookie
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return NextResponse.json({ ok: true, session });
}
