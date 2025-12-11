import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth error:", error);
      return NextResponse.redirect(`${requestUrl.origin}/magic-login?error=1`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
