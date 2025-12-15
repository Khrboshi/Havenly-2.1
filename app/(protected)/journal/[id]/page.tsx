// app/(protected)/journal/[id]/page.tsx
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import JournalEntryClient from "./JournalEntryClient";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function JournalEntryPage({ params }: PageProps) {
  const supabase = await createServerSupabase();

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .select("id, title, content, created_at")
    .eq("id", params.id)
    .single();

  if (error || !entry) {
    notFound();
  }

  return <JournalEntryClient entry={entry} />;
}
