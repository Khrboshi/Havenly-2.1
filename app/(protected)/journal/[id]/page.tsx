"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type JournalEntryRow = {
  id: string;
  user_id?: string;
  title: string | null;
  content: string;
  created_at?: string;
  updated_at?: string;
};

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "loaded"; entry: JournalEntryRow }
  | { status: "not_found" }
  | { status: "error"; message: string };

function toSingleParam(value: string | string[] | undefined): string | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function isUuidLike(value: string): boolean {
  // Good enough for client-side validation; DB remains source of truth.
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export default function JournalEntryPage() {
  const params = useParams();

  const id = useMemo(() => {
    // In App Router, params values can be string | string[]
    // depending on how Next resolves segments.
    const raw = toSingleParam((params as any)?.id);
    return raw?.trim() || null;
  }, [params]);

  const [state, setState] = useState<LoadState>({ status: "idle" });

  const load = useCallback(async () => {
    if (!id || !isUuidLike(id)) {
      setState({ status: "not_found" });
      return;
    }

    setState({ status: "loading" });

    try {
      const supabase = supabaseClient;

      // IMPORTANT: Do NOT select columns that may not exist in your table.
      // The console screenshot shows `reflection` does not exist and causes 400.
      const { data, error } = await supabase
        .from("journal_entries")
        .select("id, user_id, title, content, created_at, updated_at")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        // Give a useful message but keep it safe for users.
        const msg =
          error.message ||
          "We couldn't load this entry right now. Please try again.";
        setState({ status: "error", message: msg });
        return;
      }

      if (!data) {
        setState({ status: "not_found" });
        return;
      }

      // Force a stable shape for TypeScript + UI rendering
      const entry: JournalEntryRow = {
        id: String((data as any).id),
        user_id: (data as any).user_id ?? undefined,
        title: (data as any).title ?? null,
        content: String((data as any).content ?? ""),
        created_at: (data as any).created_at ?? undefined,
        updated_at: (data as any).updated_at ?? undefined,
      };

      setState({ status: "loaded", entry });
    } catch (e: any) {
      setState({
        status: "error",
        message:
          e?.message || "We couldn't load this entry right now. Please try again.",
      });
    }
  }, [id]);

  useEffect(() => {
    // Load on first mount and when id changes
    load();
  }, [load]);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Journal Entry</h1>
        <Link
          href="/journal"
          className="rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm text-slate-200 hover:bg-slate-900"
        >
          ← Back to journal
        </Link>
      </div>

      {(state.status === "idle" || state.status === "loading") && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-800/60" />
          <div className="mt-4 h-4 w-64 animate-pulse rounded bg-slate-800/40" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-slate-800/40" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-slate-800/40" />
            <div className="h-4 w-10/12 animate-pulse rounded bg-slate-800/40" />
          </div>
        </div>
      )}

      {state.status === "not_found" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
          <p className="text-red-300">This entry could not be found.</p>
          <div className="mt-4">
            <Link href="/journal" className="text-emerald-300 hover:underline">
              ← Back to journal
            </Link>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div className="rounded-2xl border border-red-900/60 bg-red-950/20 p-6">
          <p className="text-red-200">
            We couldn&apos;t load this entry right now. Please try again.
          </p>
          <p className="mt-2 text-xs text-red-200/70">
            {state.message}
          </p>
          <button
            onClick={load}
            className="mt-4 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white"
          >
            Retry
          </button>
        </div>
      )}

      {state.status === "loaded" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
          <div className="flex flex-col gap-1">
            <div className="text-xs text-slate-400">
              {state.entry.created_at
                ? new Date(state.entry.created_at).toLocaleString()
                : "—"}
            </div>
            <h2 className="text-lg font-semibold text-slate-100">
              {state.entry.title?.trim() ? state.entry.title : "Untitled entry"}
            </h2>
          </div>

          <div className="mt-5 whitespace-pre-wrap text-slate-200 leading-relaxed">
            {state.entry.content}
          </div>
        </div>
      )}
    </div>
  );
}
