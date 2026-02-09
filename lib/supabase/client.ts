"use client";

import { createBrowserClient, SupabaseClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client for public and authenticated actions.
 * Only uses the public anon key — safe for client execution.
 */
export const createClient = (): SupabaseClient => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const supabaseClient = createClient();
