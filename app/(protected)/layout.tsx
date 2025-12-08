import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProtectedNavBar from "@/app/components/ProtectedNavBar";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session found → redirect server-side (no flicker)
  if (!session?.user) {
    redirect("/magic-login?redirectedFrom=/dashboard");
  }

  return (
    <div>
      <ProtectedNavBar user={session.user} />
      {children}
    </div>
  );
}
