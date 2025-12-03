import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ProtectedNavBar from "@/app/components/ProtectedNavBar";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Create server client (ASYNC – required)
  const supabase = await createServerSupabase();

  // Fetch user directly (most stable)
  const { data: { user } } = await supabase.auth.getUser();

  // If no user → redirect to login
  if (!user) {
    redirect("/magic-login?redirectedFrom=/dashboard");
  }

  return (
    <div className="min-h-screen bg-bgPrimary text-white">
      <ProtectedNavBar />
      <div className="pt-24 max-w-4xl mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
