// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Syncs Supabase session cookies on client → server boundaries.
 * Called by SupabaseSessionProvider on login, refresh, etc.
 */
export async function POST() {
  const supabase = createServerSupabase();

  // Simply call getSession() — this forces Supabase to refresh cookie state
  await supabase.auth.getSession();

  return NextResponse.json({ ok: true });
}
