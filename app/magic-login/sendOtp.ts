"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function sendOtp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  if (!email) return { success: false, message: "Email is required." };

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options, path: "/" });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options, path: "/" });
        },
      },
    }
  );

  // Supabase will email an OTP code (and may also include a link depending on template).
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error("OTP send error:", error.message);
    return { success: false, message: error.message };
  }

  return { success: true };
}
