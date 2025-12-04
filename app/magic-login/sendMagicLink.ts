"use server";

import { createServerSupabase } from "@/lib/supabase/server";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const redirectTo = "/dashboard"; // FORCE redirect

  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${redirectTo}`,
    },
  });

  if (error) {
    return { success: false, message: "Failed to send link." };
  }

  return {
    success: true,
    message: "Magic link sent. Please check your inbox.",
  };
}
