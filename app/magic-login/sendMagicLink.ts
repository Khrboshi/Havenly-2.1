"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export default async function sendMagicLink(email: string) {
  try {
    const supabase = await createServerSupabase();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Directly set redirect URL for Supabase magic link
        emailRedirectTo: "https://havenly-2-1.vercel.app/auth/callback",
      },
    });

    if (error) {
      console.error("Magic link error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Magic link exception:", err);
    return { success: false, error: "Unexpected server error" };
  }
}
