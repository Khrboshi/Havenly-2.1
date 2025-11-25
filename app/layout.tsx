export const dynamic = "force-dynamic"; // ensure fresh session on every request

import "./globals.css";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import ClientNavWrapper from "./components/ClientNavWrapper";

export const metadata: Metadata = {
  title: "Havenly – A calm space to reflect",
  description:
    "Take 3–5 minutes a day to check in with yourself, jot a quick note, and get a gentle AI reflection.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {/* Navbar that always tracks auth state */}
        <ClientNavWrapper initialUser={user} />

        {/* Page content */}
        <main className="pt-10">{children}</main>
      </body>
    </html>
  );
}
