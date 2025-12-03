// lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createServerSupabase() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, {
              ...options,
              path: "/",            // IMPORTANT
              secure: true,         // IMPORTANT
              sameSite: "lax",      // IMPORTANT
            });
          } catch (err) {
            console.error("Cookie set error:", err);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", {
              ...options,
              path: "/", 
              secure: true,
              sameSite: "lax",
            });
          } catch (err) {
            console.error("Cookie remove error:", err);
          }
        },
      },
    }
  );
}
