export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();

    // Fully clear Supabase auth session
    await supabase.auth.signOut();

    const redirectUrl = new URL("/", request.url);

    return NextResponse.redirect(redirectUrl, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Logout error:", err);
    const fallback = new URL("/", request.url);
    return NextResponse.redirect(fallback);
  }
}
