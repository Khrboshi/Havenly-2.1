import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const supabase = createServerSupabase();

  // Load session → identify user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return (
      <div className="p-10 text-red-500">
        Error: You must be logged in.
      </div>
    );
  }

  const userId = session.user.id;

  // Fetch user's journal entries
  const { data: entries, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Insights fetch error:", error);
    return (
      <div className="p-10 text-red-500">
        Failed to load insights.
      </div>
    );
  }

  const totalEntries = entries?.length ?? 0;

  // Calculate stats
  const totalWords = entries?.reduce((sum, e) => {
    const words = String(e.content || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return sum + words;
  }, 0);

  const avgWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

  const firstEntryDate =
    entries && entries.length > 0
      ? new Date(entries[0].created_at).toLocaleDateString()
      : "—";

  const lastEntryDate =
    entries && entries.length > 0
      ? new Date(entries[entries.length - 1].created_at).toLocaleDateString()
      : "—";

  // Compute most active day
  const dayCounts: Record<string, number> = {};
  entries?.forEach((e) => {
    const day = new Date(e.created_at).toLocaleDateString();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  const mostActiveDay =
    Object.keys(dayCounts).length > 0
      ? Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0]
      : "—";

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-slate-200">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">
        Your Insights
      </h1>

      <p className="text-slate-400 mb-12">
        A gentle overview of your journaling activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <InsightCard title="Total entries" value={totalEntries} />
        <InsightCard title="Total words written" value={totalWords} />
        <InsightCard title="Average words per entry" value={avgWords} />
        <InsightCard title="Most active day" value={mostActiveDay} />
        <InsightCard title="First entry" value={firstEntryDate} />
        <InsightCard title="Latest entry" value={lastEntryDate} />
      </div>

      <div className="mt-12">
        <Link
          href="/journal"
          className="inline-block rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-300 transition"
        >
          View your journal →
        </Link>
      </div>
    </div>
  );
}

function InsightCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-slate-400 mb-2">{title}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
