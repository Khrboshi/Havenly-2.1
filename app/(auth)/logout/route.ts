import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookies(),
    }
  );

  await supabase.auth.signOut();

  return NextResponse.redirect(
    new URL("/magic-login?logged_out=1", request.url),
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
