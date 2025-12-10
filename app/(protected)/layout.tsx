import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // User must be authenticated
  if (!session) {
    redirect("/magic-login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar is NOT duplicated anymore.
          It will be rendered globally or once at the page level. */}

      <main className="mx-auto w-full max-w-7xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
