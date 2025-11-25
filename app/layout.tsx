export const dynamic = "force-dynamic";

import "./globals.css";
import { createServerSupabase } from "@/lib/supabase/server";
import ClientNavWrapper from "./components/ClientNavWrapper";
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
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <ClientNavWrapper initialUser={session?.user ?? null} />
        <main className="pt-10">{children}</main>
      </body>
    </html>
  );
}
