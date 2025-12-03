import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function doRefresh() {
  const supabase = createServerSupabase();

  try {
    await supabase.auth.getUser(); // touch the session
  } catch (err) {
    console.error("Session refresh error:", err);
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
