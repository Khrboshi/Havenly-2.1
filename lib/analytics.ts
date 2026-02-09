// lib/analytics.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";

type TrackEventParams = {
  supabase?: SupabaseClient;
  userId?: string | null;
  event: string;
  source?: string;
};

export async function trackEvent(params: TrackEventParams) {
  const { supabase: provided, userId, event, source } = params;

  const supabase = provided ?? createServerSupabase();

  try {
    await (supabase.from("analytics_events") as unknown as any).insert({
      user_id: userId ?? null,
      event,
      source: source ?? null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    // Analytics must never block product flows.
    console.warn("trackEvent failed:", err);
  }
}
