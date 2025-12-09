export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL("/", request.url), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
