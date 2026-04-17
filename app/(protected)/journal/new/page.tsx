import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import JournalForm from "@/app/components/JournalForm";
import { LoadingIndicatorInline } from "@/app/components/LoadingIndicator";
import { getRequestTranslations } from "@/app/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function NewJournalPage() {
  const supabase = await createServerSupabase();

  // ✅ getSession reads from cookie locally — no network call
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect("/magic-login");

  const t = await getRequestTranslations();

  return (
    <div className="mx-auto max-w-3xl px-4">
      {/*
        Suspense is required here because JournalForm calls useSearchParams()
        to read the ?prompt= query parameter passed from the dashboard.
        Without this boundary, Next.js 14 excludes the route from static
        optimisation and logs a build warning.
      */}
      <Suspense fallback={<LoadingIndicatorInline label={t.ui.loadingLabel} />}>
        <JournalForm />
      </Suspense>
    </div>
  );
}
