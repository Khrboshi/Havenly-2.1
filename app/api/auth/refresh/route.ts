// app/api/auth/refresh/route.ts
import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerSupabase();

  // Trigger a session refresh silently
  await supabase.auth.getSession();
  
  return NextResponse.json({ refreshed: true });
}
