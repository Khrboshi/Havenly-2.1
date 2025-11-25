export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/login?logged_out=1", request.url), {
    headers: { "Cache-Control": "no-store" },
  });
}
