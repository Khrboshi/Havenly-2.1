import "./globals.css";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import Navbar from "./components/Navbar";

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
  const supabase = await createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200">
        {/* Global navigation (uses session to decide which variant to show) */}
        <Navbar user={session?.user ?? null} />

        {/* Main content container */}
        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
