// app/(protected)/journal/[id]/page.tsx
import { redirect } from "next/navigation";
import JournalEntryClient from "./JournalEntryClient";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type JournalEntryRow = {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
  ai_response: string | null;
};

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) redirect("/login");

  const { data, error } = await supabase
    .from("journal_entries")
    .select("id,title,content,created_at,ai_response")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .maybeSingle<JournalEntryRow>();

  if (error) {
    // Keep it simple; you can replace with a nicer error UI later
    throw new Error("Failed to load entry");
  }

  if (!data?.id) {
    redirect("/journal");
  }

  let initialReflection: any = null;
  if (data.ai_response) {
    try {
      initialReflection = JSON.parse(data.ai_response);
    } catch {
      initialReflection = null;
    }
  }

  return (
    <JournalEntryClient
      entry={{
        id: data.id,
        title: data.title,
        content: data.content,
        created_at: data.created_at,
      }}
      initialReflection={initialReflection}
    />
  );
}
