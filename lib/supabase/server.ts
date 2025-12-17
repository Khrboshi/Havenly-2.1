import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createServerSupabase() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * Supabase SSR expects getAll/setAll so it can refresh/rotate auth cookies
         * during server requests (route handlers, server components, etc.).
         */
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            /**
             * In some server-rendered contexts (e.g., certain Server Components),
             * Next.js cookie store may be read-only. Middleware already refreshes
             * cookies broadly, so we safely no-op here to avoid runtime crashes.
             */
          }
        },
      },
    }
  );
}
