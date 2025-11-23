"use client";

import { useEffect, useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUser(user);
    }

    load();
  }, [router]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
        <p className="text-sm text-slate-400">Account email</p>
        <p className="text-slate-200 font-medium">{user.email}</p>
      </div>

      <p className="text-xs text-slate-500">
        More settings will be added soon.
      </p>
    </div>
  );
}
