"use server";

import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Server Action for the magic-link form.
 * Called directly from the form in app/magic-login/page.tsx.
 */
export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

  if (!email) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const supabase = await createServerSupabase();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Make sure NEXT_PUBLIC_SITE_URL is set on Vercel
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${redirectTo}`,
      },
    });

    if (error) {
      console.error("Magic link error:", error.message);
      return {
        error: "We couldn’t send the magic link. Please try again in a moment.",
      };
    }

    // The page doesn’t read this yet, but it keeps the API future-proof.
    return { success: true };
  } catch (err) {
    console.error("Magic link server error:", err);
    return {
      error: "Unexpected error while sending the magic link. Please try again.",
    };
  }
}
