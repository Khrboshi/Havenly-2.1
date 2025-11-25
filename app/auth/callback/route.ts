import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = createServerSupabase();

  // If Supabase provided an auth code, exchange it for a session
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Retrieve updated session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Assign default role if missing
  if (session?.user && !session.user.user_metadata?.role) {
    await supabase.auth.admin.updateUserById(session.user.id, {
      user_metadata: { role: "free" },
    });
  }

  // Redirect to dashboard
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
