// app/logout/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = createServerSupabase();

  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Logout error:", err);
  }

  // After logout → redirect to landing page
  return NextResponse.redirect(new URL("/", request.url));
}
