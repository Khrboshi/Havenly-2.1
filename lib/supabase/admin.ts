/**
 * Server-only Supabase client using Service Role Key.
 * Use only in server routes or edge functions.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn("Missing SUPABASE_SERVICE_ROLE_KEY — admin client disabled.");
}

export const supabaseAdmin: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
