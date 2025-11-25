import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = createServerSupabase();

  // Exchange code for session if present
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Retrieve updated session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Assign default role using service role
  if (session?.user && !session.user.user_metadata?.role) {
    const serviceRoleClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,   // must exist in Vercel env
      { auth: { persistSession: false } }
    );

    await serviceRoleClient.auth.admin.updateUserById(session.user.id, {
      user_metadata: { role: "free" },
    });
  }

  // Redirect to dashboard
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
