"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import { useSupabase } from "@/components/SupabaseSessionProvider";

type JournalEntry = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  reflection: string | null;
  created_at: string;
  updated_at?: string | null;
};

function safeString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function safeNullableString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function normalizeEntry(row: any): JournalEntry | null {
  // Hard guard
  if (!row || typeof row !== "object") return null;

  const id = safeString(row.id);
  const user_id = safeString(row.user_id);
  const content = safeString(row.content);
  const created_at = safeString(row.created_at);

  if (!id || !user_id || !content || !created_at) return null;

  return {
    id,
    user_id,
    title: safeNullableString(row.title),
    content,
    reflection: safeNullableString(row.reflection),
    created_at,
    updated_at: safeNullableString(row.updated_at),
  };
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function JournalEntryPage() {
  const router = useRouter();
  const params = useParams();
  const { session } = useSupabase();

  const id = useMemo(() => {
    const raw = (params as any)?.id;
    if (Array.isArray(raw)) return String(raw[0] || "");
    return typeof raw === "string" ? raw : "";
  }, [params]);

  const [loading, setLoading] = useState(true);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      setEntry(null);

      // If user is not logged in, send them to login (client-side only)
      if (!session?.user) {
        setLoading(false);
        router.replace("/magic-login");
        return;
      }

      // Missing/invalid id -> show not found
      if (!id) {
        setLoading(false);
        setEntry(null);
        return;
      }

      try {
        // Query the same table directly from Supabase for maximum reliability
        const { data, error: supaError } = await supabaseClient
          .from("journal_entries")
          .select("id,user_id,title,content,reflection,created_at,updated_at")
          .eq("id", id)
          .maybeSingle();

        if (cancelled) return;

        if (supaError) {
          console.error("Journal entry fetch error:", supaError);
          setError("We couldn’t load this entry right now. Please try again.");
          setLoading(false);
          return;
        }

        const normalized = normalizeEntry(data);

        // If not found (or row shape invalid), show not found message
        if (!normalized) {
          setEntry(null);
          setLoading(false);
          return;
        }

        // Extra safety: ensure user owns the entry (RLS should do this, but keep it safe)
        if (normalized.user_id !== session.user.id) {
          setEntry(null);
          setLoading(false);
          return;
        }

        setEntry(normalized);
        setLoading(false);
      } catch (e) {
        console.error("Journal entry unexpected error:", e);
        if (cancelled) return;
        setError("We couldn’t load this entry right now. Please try again.");
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id, router, session?.user?.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              Journal Entry
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {entry?.created_at ? formatDate(entry.created_at) : ""}
            </p>
          </div>

          <Link
            href="/journal"
            className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900/70"
          >
            ← Back to journal
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-800" />
            <div className="mt-4 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-slate-800" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-slate-800" />
              <div className="h-4 w-10/12 animate-pulse rounded bg-slate-800" />
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-900/60 bg-red-950/30 p-6">
            <p className="text-sm text-red-200">{error}</p>
            <div className="mt-4">
              <button
                onClick={() => router.refresh()}
                className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white"
              >
                Retry
              </button>
            </div>
          </div>
        ) : !entry ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <p className="text-sm text-red-300">This entry could not be found.</p>
            <div className="mt-3">
              <Link
                href="/journal"
                className="text-sm text-emerald-300 hover:underline"
              >
                ← Back to journal
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            {entry.title ? (
              <h2 className="text-xl font-semibold">{entry.title}</h2>
            ) : (
              <h2 className="text-xl font-semibold text-slate-200">
                Untitled entry
              </h2>
            )}

            <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-100">
              {entry.content}
            </div>

            {entry.reflection ? (
              <>
                <hr className="my-6 border-slate-800" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Reflection
                </h3>
                <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-100">
                  {entry.reflection}
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
