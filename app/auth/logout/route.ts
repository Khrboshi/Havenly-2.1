import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createServerSupabase();
  await supabase.auth.signOut();

  const url = new URL(request.url);
  url.pathname = "/login";
  url.searchParams.set("logged_out", "1");

  return NextResponse.redirect(url.toString());
}
