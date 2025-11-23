import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import { createServerSupabase } from "@/lib/supabase/server";
import ToastMessage from "@/app/components/ToastMessage";

export const metadata: Metadata = {
  title: "Havenly",
  description: "Daily reflection and journaling made simple.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data } = await supabase.auth.getUser();

  const user = data?.user || null;

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200">
        <Navbar user={user} />
        <ToastMessage />
        {children}
      </body>
    </html>
  );
}
