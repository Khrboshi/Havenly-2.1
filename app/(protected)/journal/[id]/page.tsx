import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";
import { getTranslations, getLocaleFromCookieString } from "@/app/lib/i18n";
import JournalEntryClient from "./JournalEntryClient";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  // ✅ getSession reads from cookie locally — no network call
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) redirect("/magic-login");

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("id,title,content,created_at,ai_response")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (!entry) {
    const locale = getLocaleFromCookieString((await cookies()).toString());
    const t = getTranslations(locale);
    return <div className="p-10 text-qm-primary">{t.errors.entryNotFound}</div>;
  }

  let initialReflection = null;
  try {
    initialReflection = entry.ai_response
      ? JSON.parse(entry.ai_response)
      : null;
  } catch {
    initialReflection = null;
  }

  // Cheap count to detect first-entry moment
  const { count: entryCount } = await supabase
    .from("journal_entries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", session.user.id);

  const isFirstEntry = (entryCount ?? 0) <= 1;

  return (
    <JournalEntryClient
      entry={entry}
      initialReflection={initialReflection}
      isFirstEntry={isFirstEntry}
    />
  );
}
