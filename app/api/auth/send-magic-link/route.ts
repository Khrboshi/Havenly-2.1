// app/api/auth/send-magic-link/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, redirectedFrom } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const redirectTo = redirectedFrom || "/dashboard";

    const supabase = createServerSupabase();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirectTo=${encodeURIComponent(
            redirectTo
          )}`,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error." },
      { status: 500 }
    );
  }
}
