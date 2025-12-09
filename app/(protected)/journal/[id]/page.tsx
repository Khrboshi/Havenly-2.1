"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/components/SupabaseSessionProvider";

export default function JournalEntryPage({ params }) {
  const router = useRouter();
  const { supabase } = useSupabase();

  const journalId = params.id;

  const [entryText, setEntryText] = useState("");
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [noCredits, setNoCredits] = useState(false);

  type JournalEntry = {
    id: string;
    content: string | null;
    reflection: string | null;
  };

  useEffect(() => {
    async function loadJournal() {
      const { data } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("id", journalId)
        .single<JournalEntry>();

      if (data) {
        setEntryText(data.content || "");
        if (data.reflection) setReflection(data.reflection);
      }
    }

    loadJournal();
  }, [journalId, supabase]);

  async function generateReflection() {
    setLoading(true);
    setNoCredits(false);

    const creditRes = await fetch("/api/user/credits/use", {
      method: "POST",
    }).then((r) => r.json());

    if (!creditRes.success) {
      setLoading(false);
      if (creditRes.error === "INSUFFICIENT_CREDITS") {
        setNoCredits(true);
      }
      return;
    }

    const reflectRes = await fetch("/api/reflect", {
      method: "POST",
      body: JSON.stringify({ journalEntry: entryText }),
    }).then((r) => r.json());

    if (!reflectRes.success) {
      setLoading(false);
      return;
    }

    const newReflection = reflectRes.reflection;
    setReflection(newReflection);

    // FIX — offload update to server API route
    await fetch("/api/journal/update-reflection", {
      method: "POST",
      body: JSON.stringify({ journalId, reflection: newReflection }),
    });

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-brand-text">Your Journal Entry</h1>

      <div className="p-4 bg-white rounded-xl shadow-sm border">
        <p className="whitespace-pre-wrap text-gray-800">{entryText}</p>
      </div>

      <button
        onClick={generateReflection}
        disabled={loading}
        className="bg-brand-primary text-white px-5 py-3 rounded-lg hover:bg-brand-primary-dark transition"
      >
        {loading ? "Generating..." : "Generate AI Reflection"}
      </button>

      {noCredits && (
        <div className="border border-yellow-400 bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-800 font-medium">
            You’ve used all available AI reflections.
          </p>
          <button
            onClick={() => router.push("/upgrade")}
            className="mt-3 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-primary-dark"
          >
            Upgrade to Premium
          </button>
        </div>
      )}

      {reflection && (
        <div className="p-4 bg-white rounded-xl shadow-sm border">
          <h2 className="font-semibold text-xl mb-2 text-brand-text">
            AI Reflection
          </h2>
          <p className="whitespace-pre-wrap text-gray-800">{reflection}</p>
        </div>
      )}
    </div>
  );
}
