import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Navbar() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold">
            H
          </div>
          <span className="text-lg font-semibold text-slate-100">Havenly</span>
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {!user && (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-emerald-400 px-3 py-1.5 font-medium text-slate-900 hover:bg-emerald-300 transition"
              >
                Get started
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-white transition"
              >
                Dashboard
              </Link>

              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-slate-600 px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition"
                >
                  Log out
                </button>
              </form>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
