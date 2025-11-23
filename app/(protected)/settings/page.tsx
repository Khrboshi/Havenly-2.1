"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [focus, setFocus] = useState("Stress relief");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data } = await supabaseClient
        .from("profiles")
        .select("display_name, main_focus")
        .eq("id", user.id)
        .maybeSingle();

      if (!isMounted) return;

      setDisplayName(data?.display_name ?? "");
      setFocus(data?.main_focus ?? "Stress relief");
      setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { error } = await supabaseClient
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName || null, main_focus: focus });

    setSaving(false);

    if (error) {
      console.error(error);
      setMessage("Could not save your settings. Please try again.");
      return;
    }

    setMessage("Settings saved. Thanks for taking a moment for yourself.");
  }

  if (loading) {
    return <p className="mt-6 text-sm text-slate-300">Loading settings…</p>;
  }

  return (
    <div className="mt-4 max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <p className="text-sm text-slate-300">
        A few small details to make Havenly feel more like yours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Preferred name</label>
          <input
            type="text"
            className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-emerald-400"
            placeholder="Optional"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-300">
            Main reason you&apos;re here
          </label>
          <select
            className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-emerald-400"
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
          >
            <option>Stress relief</option>
            <option>Clarity & decisions</option>
            <option>Gratitude</option>
            <option>Tracking my mood</option>
          </select>
        </div>

        {message && (
          <p className="text-xs text-emerald-300 border border-emerald-500/30 bg-emerald-500/5 rounded-lg px-3 py-2">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
