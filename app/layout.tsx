export const dynamic = "force-dynamic";   // ← REQUIRED so session updates on every request

import "./globals.css";
import { createServerSupabase } from "@/lib/supabase/server";
import Navbar from "./components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Havenly",
  description: "A calm space to reflect",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always load fresh session
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <Navbar user={user} />
        <main className="pt-10">{children}</main>
      </body>
    </html>
  );
}
