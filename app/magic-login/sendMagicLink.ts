// app/magic-login/sendMagicLink.ts
"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!email) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Supabase will use the Site URL you configured in the dashboard.
      // If later you want to always send users to a specific path (like /dashboard),
      // you can uncomment this and configure NEXT_PUBLIC_SITE_URL:
      //
      // emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${redirectTo}`,
    },
  });

  if (error) {
    console.error("Magic link error:", error);
    return {
      error: "We couldn't send the magic link right now. Please try again.",
    };
  }

  return { success: true };
}
