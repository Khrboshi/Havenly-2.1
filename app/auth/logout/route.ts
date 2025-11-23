import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();

  await supabase.auth.signOut();

  // This triggers client components to get new session immediately
  const res = NextResponse.redirect("/login?logged_out=1");

  // VERY IMPORTANT — clear auth cookies
  res.cookies.set("sb-access-token", "", { maxAge: 0, path: "/" });
  res.cookies.set("sb-refresh-token", "", { maxAge: 0, path: "/" });

  return res;
}
