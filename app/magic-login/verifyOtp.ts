"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function verifyOtp(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const token = String(formData.get("token") || "").trim();

  if (!email) return { success: false, message: "Email is required." };
  if (!token) return { success: false, message: "Code is required." };

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

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
