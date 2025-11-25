import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = createServerSupabase();

  // Exchange auth code for a session
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Get the authenticated session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Assign default role using SERVICE ROLE CLIENT
  if (session?.user && !session.user.user_metadata?.role) {
    const serviceRoleClient = createClient(
      process.env.SUPABASE_URL!,               // IMPORTANT: not NEXT_PUBLIC
      process.env.SUPABASE_SERVICE_ROLE_KEY!,  // secure admin key
      { auth: { persistSession: false } }
    );

    await serviceRoleClient.auth.admin.updateUserById(session.user.id, {
      user_metadata: { role: "free" },
    });
  }

  // Redirect after successful handling
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
