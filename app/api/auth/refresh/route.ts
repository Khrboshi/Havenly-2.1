export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerSupabase();

  // Refresh supabase session silently
  await supabase.auth.getSession();

  return NextResponse.json({ refreshed: true });
}
