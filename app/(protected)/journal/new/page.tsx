import { createServerSupabase } from "@/lib/supabase/server";
import JournalForm from "../../components/JournalForm";

export const dynamic = "force-dynamic";

export default async function NewJournalPage() {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/magic-login");
  }

  return <JournalForm userId={session.user.id} />;
}
