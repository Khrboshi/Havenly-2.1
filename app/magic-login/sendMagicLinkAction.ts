"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const redirectTo = String(formData.get("redirectTo") || "/dashboard");

  if (!email) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = createServerSupabase();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    console.error("Magic link error:", error.message);
    return { error: "Something went wrong. Please try again." };
  }

  // Tell page to update UI after submission
  revalidatePath("/magic-login");

  return { success: true };
}
