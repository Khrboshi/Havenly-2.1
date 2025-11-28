"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export default async function sendMagicLink(email: string) {
  try {
    if (!email || !email.includes("@")) {
      return { error: "Please enter a valid email address." };
    }

    const supabase = await createServerSupabase();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { error: "Unexpected error sending magic link." };
  }
}
