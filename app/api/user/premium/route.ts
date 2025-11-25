import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json(
      {
        authenticated: false,
        premium: false,
        role: null,
      },
      { status: 200 }
    );
  }

  const meta = (session.user.user_metadata ?? {}) as { role?: string };
  const role = meta.role ?? "free";
  const premium = role === "premium";

  return NextResponse.json({
    authenticated: true,
    premium,
    role,
  });
}
