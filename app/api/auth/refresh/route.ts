// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Session heartbeat endpoint.
 * - Called periodically from the browser (SessionHeartbeat)
 * - Touches Supabase auth so that session cookies stay fresh
 * - IMPORTANT: Never redirects, never throws → always returns 200
 */

async function doRefresh() {
  const supabase = createServerSupabase();

  try {
    // This "touches" the session so Supabase can refresh cookies if needed.
    await supabase.auth.getUser();
  } catch (err) {
    console.error("Session refresh error:", err);
    // We still return ok: false but DO NOT redirect.
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET() {
  return doRefresh();
}

export async function POST() {
  return doRefresh();
}
