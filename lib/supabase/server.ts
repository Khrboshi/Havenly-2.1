import { cookies } from "next/headers";
import { createServerClient, SupabaseClient } from "@supabase/ssr";

/**
 * Per-request Supabase client that works in RSC/SSR contexts.
 * Automatically manages token rotation through cookies.
 */
export const createServerSupabase = (): SupabaseClient => {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Safe no‑op for read‑only cookie contexts.
          }
        },
      },
    }
  );
};
