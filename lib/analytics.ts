import { createServerSupabase } from "./supabase/server";

/**
 * Minimal server-side analytics tracker.
 * Writes into `analytics_events` if it exists; never throws.
 */
export async function trackEvent(
  userId: string | null,
  event: string,
  context?: Record<string, any>
) {
  try {
    const supabase = createServerSupabase();

    await (supabase.from("analytics_events") as any).insert({
      user_id: userId,
      event,
      context: context ?? null,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Never block app on analytics
  }
}
