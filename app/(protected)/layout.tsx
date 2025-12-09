import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import Navbar from "@/app/components/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/magic-login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Persistent navbar */}
      <Navbar />

      {/* Main content wrapper */}
      <main className="mx-auto w-full max-w-7xl px-4 py-10">
        {children}
      </main>
    </div>
  );
}
