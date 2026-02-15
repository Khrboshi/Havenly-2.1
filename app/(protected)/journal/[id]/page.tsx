import { createServerSupabase } from "@/lib/supabase/server";
import JournalEntryClient from "./JournalEntryClient";

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabase();

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("id,title,content,created_at,ai_response")
    .eq("id", params.id)
    .maybeSingle();

  if (!entry) {
    return (
      <div className="p-10 text-white">
        Entry not found
      </div>
    );
  }

  let initialReflection = null;

  try {
    initialReflection = entry.ai_response
      ? JSON.parse(entry.ai_response)
      : null;
  } catch {
    initialReflection = null;
  }

  return (
    <JournalEntryClient
      entry={entry}
      initialReflection={initialReflection}
    />
  );
}
