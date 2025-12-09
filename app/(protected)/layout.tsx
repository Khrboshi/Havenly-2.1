import Navbar from "@/components/Navbar";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserPlan, ensurePlanRow } from "@/lib/userPlan";

export default async function ProtectedLayout({ children }) {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Ensures plan row always exists server-side
    await ensurePlanRow(user.id);

    // Preload plan to reduce navbar flicker
    await getUserPlan(user.id);
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="pt-6">{children}</main>
    </div>
  );
}
