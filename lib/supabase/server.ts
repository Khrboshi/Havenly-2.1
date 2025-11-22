import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createServerSupabase() {
  const cookieStore = cookies();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables"
    );
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (err) {
          // ignore errors on server components
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch (err) {
          // ignore errors on server components
        }
      },
    },
  });
}
