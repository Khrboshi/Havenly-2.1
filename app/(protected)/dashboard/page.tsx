"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type JournalEntry = {
  id: string;
  created_at: string;
  mood: number | null;
  content: string | null;
  ai_response: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [lastEntry, setLastEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        router.replace("/login");
        return;
      }

      if (active) setUserId(session.user.id);

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("display_name")
        .eq("id", session.user.id)
        .maybeSingle();

      if (active) {
        setDisplayName(
          profile?.display_name || session.user.email?.split("@")[0] || "there"
        );
      }

      const { data: entries } = await supabaseClient
        .from("journal_entries")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (active) {
        setLastEntry(entries?.[0] ?? null);
        setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return <p className="text-slate-300 mt-6">Loading your space…</p>;
  }

  return (
    <div className="space-y-6 mt-2">
      <h1 className="text-2xl font-bold">Hey {displayName},</h1>

      <p className="text-sm text-slate-300">
        Take 3–5 minutes to check in with yourself.
      </p>

      <Link
        href="/journal/new"
        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-medium text-slate-950 hover:bg-emerald-300 transition"
      >
        Start today&apos;s reflection
        <span className="text-xs opacity-80">· 3–5 min</span>
      </Link>

      <p className="text-xs text-slate-400">
        Or{" "}
        <Link href="/journal" className="text-emerald-300 hover:underline font-medium">
          review your past entries
        </Link>
        .
      </p>

      {lastEntry && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          <p className="text-[11px] text-slate-400">
            {new Date(lastEntry.created_at).toLocaleString()}
          </p>

          <p className="text-sm text-slate-200 line-clamp-3">
            {lastEntry.content}
          </p>

          {lastEntry.ai_response && (
            <div className="pt-2 border-t border-slate-800">
              <p className="text-[11px] text-emerald-300">Havenly reflection</p>
              <p className="text-xs text-slate-200 line-clamp-4">
                {lastEntry.ai_response}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
