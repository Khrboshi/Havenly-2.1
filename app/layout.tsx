import "./globals.css";
import Navbar from "./components/Navbar";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata = {
  title: "Havenly",
  description: "Daily AI-assisted reflections",
};

export default async function RootLayout({ children }) {
  // SSR-authenticated user
  const supabase = createServerSupabase();
  await supabase.auth.getUser(); // ensures cookies are loaded

  return (
    <html lang="en" className="bg-slate-950 text-white">
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
