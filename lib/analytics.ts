import { createServerSupabase } from "./server";

/**
 * Record analytics and engagement events in Supabase.
 * Works in API routes or Server Components.
 */
export async function trackEvent(
  userId: string,
  event: string,
  context: Record<string, any> = {}
) {
  try {
    const supabase = createServerSupabase();
    const { error } = await supabase
      .from("analytics_events")
      .insert([{ user_id: userId, event, context }]);
    if (error) console.error("Analytics trackEvent error:", error);
  } catch (err) {
    console.error("Analytics insert failed:", err);
  }
}

export async function getUserEvents(userId: string, limit = 100) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("analytics_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
