"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function sendMagicLink(email: string) {
  try {
    const supabase = await createServerSupabase();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error("Magic link error:", error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("Magic link exception:", err);
    return { success: false };
  }
}
