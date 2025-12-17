import { SupabaseClient } from "@supabase/supabase-js";

interface TrackEventParams {
  supabase: SupabaseClient;
  userId?: string | null;
  event: string;
  source?: string;
}

export async function trackEvent({
  supabase,
  userId,
  event,
  source,
}: TrackEventParams) {
  try {
    await supabase.from("analytics_events").insert({
      user_id: userId ?? null,
      event,
      source: source ?? null,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Analytics must never break UX
  }
}
