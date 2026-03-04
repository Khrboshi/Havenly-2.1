// app/(protected)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

// ── Fallback filter (same as insights API) ────────────────────────────────────
const FALLBACK_THEMES = new Set([
  "self-awareness", "processing", "presence",
  "consistency", "recovery", "self-respect", "motivation",
  "recognition", "boundaries", "self-worth",
  "connection", "visibility",
]);
const FALLBACK_EMOTIONS = new Set([
  "uncertainty", "restlessness", "quiet courage",
  "pride", "tiredness", "determination",
  "frustration", "hurt", "longing", "confusion",
]);

// All 4 domain template fallback corepatterns (prefix match, case-insensitive)
const FALLBACK_CP_PREFIXES = [
  "you're in the middle of something",
  "you're proud of progress, but still learning the line",
  "you're navigating a tension between your professional self-worth",
  "you're trying to protect your self-respect while staying connected",
];

function isFallback(set: Set<string>, k: string) {
  return set.has((k || "").toLowerCase().trim());
}

function isFallbackCorepattern(k: string): boolean {
  const lower = k.toLowerCase().trim();
  return FALLBACK_CP_PREFIXES.some((p) => lower.startsWith(p));
}

function parseAiResponse(raw: any) {
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch { return null; }
}

// Compute streak: consecutive days with at least one entry (ending today or yesterday)
function computeStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const days = new Set(
    dates.map((d) => new Date(d).toISOString().slice(0, 10))
  );
  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let cursor = new Date();
  // Allow streak to start from yesterday if nothing today yet
  if (!days.has(today)) cursor.setDate(cursor.getDate() - 1);
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export type DashboardData = {
  userId: string;
  entryCount: number;
  streak: number;
  // Last entry info
  lastEntryId: string | null;
  lastEntryTitle: string | null;
  lastEntryDate: string | null;
  lastEntryHasReflection: boolean;
  // Personalisation from most recent reflection
  lastTopEmotion: string | null;
  lastTopTheme: string | null;
  lastCorepattern: string | null;
  // Did they write today?
  wroteToday: boolean;
  // Did they reflect this week?
  reflectedThisWeek: boolean;
};

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect("/magic-login?reason=not_authenticated");

  const userId = session.user.id;

  // ── Fetch last 30 entries with ai_response for personalisation ────────────
  const { data: rows } = await supabase
    .from("journal_entries")
    .select("id, title, created_at, ai_response")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  const entries = (rows || []) as Array<{
    id: string;
    title: string | null;
    created_at: string;
    ai_response: any;
  }>;

  // ── Count total entries ───────────────────────────────────────────────────
  const { count: entryCount } = await supabase
    .from("journal_entries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  // ── Compute streak ────────────────────────────────────────────────────────
  const streak = computeStreak(entries.map((e) => e.created_at));

  // ── Last entry ────────────────────────────────────────────────────────────
  const last = entries[0] ?? null;
  const lastEntryId = last?.id ?? null;
  const lastEntryTitle = last?.title ?? null;
  const lastEntryDate = last?.created_at ?? null;
  const lastEntryHasReflection = !!last?.ai_response;

  // ── Today / this week flags ───────────────────────────────────────────────
  const todayKey = new Date().toISOString().slice(0, 10);
  const wroteToday = entries.some(
    (e) => new Date(e.created_at).toISOString().slice(0, 10) === todayKey
  );

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const reflectedThisWeek = entries.some(
    (e) => e.ai_response && new Date(e.created_at).getTime() >= oneWeekAgo
  );

  // ── Personalisation: find most recent reflection with real data ───────────
  let lastTopEmotion: string | null = null;
  let lastTopTheme: string | null = null;
  let lastCorepattern: string | null = null;

  for (const entry of entries) {
    if (!entry.ai_response) continue;
    const parsed = parseAiResponse(entry.ai_response);
    if (!parsed) continue;

    // Find first real (non-fallback) emotion
    if (!lastTopEmotion) {
      const emotions: string[] = Array.isArray(parsed.emotions) ? parsed.emotions : [];
      const realEmotion = emotions.find(
        (e) => typeof e === "string" && e.trim() && !isFallback(FALLBACK_EMOTIONS, e)
      );
      if (realEmotion) {
        lastTopEmotion = realEmotion.charAt(0).toUpperCase() + realEmotion.slice(1);
      }
    }

    // Find first real (non-fallback) theme
    if (!lastTopTheme) {
      const themes: string[] = Array.isArray(parsed.themes) ? parsed.themes : [];
      const realTheme = themes.find(
        (t) => typeof t === "string" && t.trim() && !isFallback(FALLBACK_THEMES, t)
      );
      if (realTheme) {
        lastTopTheme = realTheme.charAt(0).toUpperCase() + realTheme.slice(1);
      }
    }

    // Find most recent non-fallback corepattern
    if (!lastCorepattern) {
      const cp = typeof parsed.corepattern === "string" ? parsed.corepattern.trim() : "";
      if (cp.length >= 20 && !isFallbackCorepattern(cp)) {
        lastCorepattern = cp.charAt(0).toUpperCase() + cp.slice(1);
      }
    }

    if (lastTopEmotion && lastTopTheme && lastCorepattern) break;
  }

  const dashboardData: DashboardData = {
    userId,
    entryCount: entryCount ?? entries.length,
    streak,
    lastEntryId,
    lastEntryTitle,
    lastEntryDate,
    lastEntryHasReflection,
    lastTopEmotion,
    lastTopTheme,
    lastCorepattern,
    wroteToday,
    reflectedThisWeek,
  };

  return <DashboardClient data={dashboardData} />;
}
