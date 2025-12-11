"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "").trim();

  if (!email) return { success: false, message: "Email is required." };

  const supabase = createServerSupabase();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirect_to=/dashboard`,
    },
  });

  if (error) {
    console.error("Magic link error:", error);
    return { success: false, message: "Failed to send magic link." };
  }

  return { success: true };
}
