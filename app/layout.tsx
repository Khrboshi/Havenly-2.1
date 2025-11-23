import "./globals.css";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import Navbar from "./components/Navbar";
import Link from "next/link";

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
      <body className="bg-slate-950 text-slate-200 min-h-screen flex flex-col">
        {/* GLOBAL NAVBAR */}
        <Navbar user={session?.user ?? null} />

        {/* MAIN CONTENT WRAPPER */}
        <main className="mx-auto max-w-5xl px-4 py-10 flex-1">
          {children}
        </main>

        {/* GLOBAL FOOTER */}
        <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
          <p>
            Havenly 2.1 — A calm space for intentional reflection.
            <Link
              href="/privacy"
              className="ml-2 text-emerald-300 underline hover:text-emerald-200"
            >
              Privacy Policy
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
