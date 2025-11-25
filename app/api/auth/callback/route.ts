import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { setUserRole } from "../role/setRole";

export async function GET(request: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    const userId = session.user.id;
    const role = session.user.user_metadata?.role;

    if (!role) {
      await setUserRole(userId, "free");
    }
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
