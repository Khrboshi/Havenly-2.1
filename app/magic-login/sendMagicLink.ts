"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard");

  if (!email) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${redirectTo}`,
    },
  });

  if (error) {
    return { error: "Could not send magic link. Please try again later." };
  }

  return { success: true };
}
