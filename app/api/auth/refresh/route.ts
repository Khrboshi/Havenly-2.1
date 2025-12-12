import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabase();

  // This forces Supabase to refresh the session cookies
  await supabase.auth.getUser();

  return NextResponse.json({ ok: true });
}
