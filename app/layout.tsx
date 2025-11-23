import "./globals.css";
import { createServerSupabase } from "@/lib/supabase/server";
import Navbar from "./components/Navbar";
import ToastMessage from "./components/ToastMessage";

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200">
        <Navbar user={session?.user || null} />
        <ToastMessage />
        {children}
      </body>
    </html>
  );
}
