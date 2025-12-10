"use server";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Magic link sender — PKCE-safe, production-correct
 */
export async function sendMagicLink(formData: FormData) {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw.trim() : "";

  if (!email) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  /**
   * IMPORTANT:
   * Your confirmed production domain must be used here.
   */
  const siteUrl = "https://havenly-2-1.vercel.app";

  // Final page after user logs in
  const redirectTo = "/dashboard";

  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
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
