"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim() : "";

  if (!email) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  // Where we ultimately want the user to land *after* auth is complete
  const redirectTo = "/dashboard";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // IMPORTANT:
      // 1) Hit the auth callback route so Supabase can exchange the code for a session
      // 2) Pass the final destination so the callback can redirect on
      emailRedirectTo: `${siteUrl}/auth/callback?redirect_to=${encodeURIComponent(
        redirectTo
      )}`,
    },
  });

  if (error) {
    console.error("sendMagicLink error:", error);
    return {
      success: false,
      message: "Failed to send link. Please try again.",
    };
  }

  return {
    success: true,
    message:
      "A secure magic link has been sent to your email. Please check your inbox.",
  };
}
