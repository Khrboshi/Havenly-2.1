import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function JournalPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data: entries } = await supabase
    .from("journal_entries")
    .select("id, created_at, title, content")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-slate-100">Your Journal</h1>
        <Link
          href="/journal/new"
          className="rounded-full bg-emerald-500 px-4 py-2 font-medium text-slate-900 hover:bg-emerald-400"
        >
          New Entry
        </Link>
      </div>

      {entries?.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400 text-sm">
          You haven’t written any reflections yet. Start with your first one.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entries?.map((entry) => (
          <Link
            key={entry.id}
            href={`/journal/${entry.id}`}
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 hover:border-slate-700 hover:bg-slate-900 transition"
          >
            <p className="text-xs text-slate-500 mb-2">
              {formatDate(entry.created_at)}
            </p>

            <p className="text-sm leading-relaxed text-slate-200 line-clamp-4">
              {entry.content}
            </p>

            <p className="mt-3 text-emerald-400 text-sm hover:underline">
              Read more →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
