"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSupabase } from "@/app/components/SupabaseSessionProvider";

interface UpgradeTriggerModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  source?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export default function UpgradeTriggerModal({
  open,
  onClose,
  title = "You’ve used your free AI reflections",
  message = "The Free plan includes 3 AI reflections per month. Premium unlocks unlimited reflections and deeper insights.",
  source = "unknown",
  ctaHref = "/upgrade",
  ctaLabel = "Unlock Premium",
}: UpgradeTriggerModalProps) {
  const { supabase, session } = useSupabase();

  useEffect(() => {
    if (!open) return;

    // Type-safe runtime insert without requiring regenerated Supabase types
    (supabase.from("analytics_events") as unknown as any).insert({
      user_id: session?.user?.id ?? null,
      event: "upgrade_modal_shown",
      source,
      created_at: new Date().toISOString(),
    });
  }, [open, supabase, session, source]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-200 shadow-xl">
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-3 text-sm text-slate-400">{message}</p>

        <p className="mt-3 text-sm text-slate-400">
          You can continue journaling freely. AI reflections resume immediately
          with Premium.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href={ctaHref}
            onClick={() => {
              (supabase.from("analytics_events") as unknown as any).insert({
                user_id: session?.user?.id ?? null,
                event: "upgrade_clicked",
                source,
                created_at: new Date().toISOString(),
              });
            }}
            className="flex-1 rounded-full bg-emerald-400 px-5 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-emerald-300"
          >
            {ctaLabel}
          </Link>

          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
