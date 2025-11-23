import "./globals.css";
import Navbar from "./components/Navbar";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata = {
  title: "Havenly",
  description: "A calm space to reflect.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200">
        <Navbar user={session?.user || null} />
        {children}
      </body>
    </html>
  );
}
