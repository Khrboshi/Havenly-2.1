"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

type JournalEntry = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
};

type State =
  | { status: "loading" }
  | { status: "not_found" }
  | { status: "error"; message: string }
  | { status: "loaded"; entry: JournalEntry };

export default function JournalEntryPage() {
  const params = useParams();
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : null;

  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!id) {
      setState({ status: "not_found" });
      return;
    }

    async function load() {
      try {
        const { data, error } = await supabaseClient
          .from("journal_entries")
          // ⚠️ ONLY columns that EXIST
          .select("id, title, content, created_at")
          .eq("id", id)
          .maybeSingle();

        if (error) {
          setState({ status: "error", message: error.message });
          return;
        }

        if (!data) {
          setState({ status: "not_found" });
          return;
        }

        setState({
          status: "loaded",
          entry: {
            id: data.id,
            title: data.title ?? null,
            content: data.content,
            created_at: data.created_at,
          },
        });
      } catch (err: any) {
        setState({
          status: "error",
          message: err?.message ?? "Unexpected error",
        });
      }
    }

    load();
  }, [id]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Journal Entry</h1>
        <Link
          href="/journal"
          className="rounded-lg border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900"
        >
          ← Back to journal
        </Link>
      </div>

      {state.status === "loading" && (
        <div className="rounded-xl border border-slate-800 p-6">
          Loading entry…
        </div>
      )}

      {state.status === "not_found" && (
        <div className="rounded-xl border border-slate-800 p-6 text-red-300">
          This entry could not be found.
        </div>
      )}

      {state.status === "error" && (
        <div className="rounded-xl border border-red-900 bg-red-950/30 p-6">
          <p className="text-red-200">
            We couldn’t load this entry right now.
          </p>
          <p className="mt-2 text-xs opacity-70">{state.message}</p>
        </div>
      )}

      {state.status === "loaded" && (
        <div className="rounded-xl border border-slate-800 p-6">
          <div className="mb-2 text-xs text-slate-400">
            {new Date(state.entry.created_at).toLocaleString()}
          </div>
          <h2 className="mb-4 text-lg font-semibold">
            {state.entry.title || "Untitled"}
          </h2>
          <div className="whitespace-pre-wrap leading-relaxed">
            {state.entry.content}
          </div>
        </div>
      )}
    </div>
  );
}
