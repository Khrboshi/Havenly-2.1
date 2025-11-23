// app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";
import { createServerSupabase } from "@/lib/supabase/server";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

export const metadata = {
  title: "Havenly 2.1",
  description: "AI-powered reflection journal",
};

async function getUser(): Promise<User | null> {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser(); // Secure & recommended

  return user ?? null;
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 min-h-screen">
        <Navbar user={user} />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
