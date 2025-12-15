import { notFound, redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type JournalEntry = {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  reflection: string | null;
  created_at: string;
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function JournalEntryPage({ params }: PageProps) {
  const supabase = createServerSupabase();

  // 1️⃣ Auth check
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const entryId = params.id;

  if (!entryId) {
    notFound();
  }

  // 2️⃣ SAFE Supabase query (NO generics)
  const { data, error } = await supabase
    .from("journal_entries")
    .select("id,user_id,title,content,reflection,created_at")
    .eq("id", entryId)
    .eq("user_id", session.user.id)
    .single();

  // 3️⃣ Deterministic failure handling
  if (error || !data) {
    notFound();
  }

  // 4️⃣ Explicit normalization (build-safe)
  const entry: JournalEntry = {
    id: String(data.id),
    user_id: String(data.user_id),
    title: data.title ?? null,
    content: String(data.content),
    reflection: data.reflection ?? null,
    created_at: String(data.created_at),
  };

  // 5️⃣ Render
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-gray-400">
            {new Date(entry.created_at).toLocaleString()}
          </p>
          {entry.title && (
            <h1 className="text-2xl font-semibold mt-1">
              {entry.title}
            </h1>
          )}
        </div>

        <div className="whitespace-pre-wrap text-base leading-relaxed">
          {entry.content}
        </div>

        {entry.reflection && (
          <div className="pt-6 border-t border-white/10">
            <h2 className="text-sm font-medium text-gray-400 mb-2">
              Reflection
            </h2>
            <div className="whitespace-pre-wrap text-base leading-relaxed">
              {entry.reflection}
            </div>
          </div>
        )}

        <div className="pt-6">
          <a
            href="/journal"
            className="text-sm text-emerald-400 hover:underline"
          >
            ← Back to journal
          </a>
        </div>
      </div>
    </div>
  );
}
