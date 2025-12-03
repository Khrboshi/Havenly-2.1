import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

export default async function JournalEntryPage({ params }: PageProps) {
  const supabase = createServerSupabase();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/magic-login?redirectedFrom=/journal/${params.id}`);
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .select("id, content, created_at")
    .eq("user_id", user!.id)
    .eq("id", params.id)
    .single();

  if (error || !data) {
    console.error("Error loading journal entry:", error);
    notFound();
  }

  const createdAt = new Date(data.created_at);

  const nicelyFormatted = createdAt.toLocaleString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-20 text-slate-200">
      <p className="text-xs tracking-[0.2em] text-slate-500 uppercase mb-2">
        Reflection from
      </p>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">
        {nicelyFormatted}
      </h1>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-8">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-100">
          {data.content}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href="/journal"
          className="rounded-full bg-slate-800 px-5 py-2 hover:bg-slate-700"
        >
          Back to journal history
        </Link>

        <Link
          href="/journal/new"
          className="rounded-full bg-emerald-400 px-5 py-2 font-semibold text-slate-900 hover:bg-emerald-300"
        >
          Write a new reflection
        </Link>

        <Link
          href="/dashboard"
          className="rounded-full bg-slate-800 px-5 py-2 hover:bg-slate-700"
        >
          Return to dashboard
        </Link>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Your reflections are private and tied to your account.
      </p>
    </div>
  );
}
