// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Havenly 2.1 – Daily Reflection Journal",
  description:
    "AI-assisted daily reflection to help you slow down, reflect, and feel better.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800">
            <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <span className="h-8 w-8 rounded-xl bg-emerald-400/90 shadow-md flex items-center justify-center text-slate-950 font-bold">
                  H
                </span>
                <span className="font-semibold tracking-tight">Havenly</span>
              </Link>
              <nav className="flex items-center gap-3 text-sm">
                <Link href="/login" className="hover:text-emerald-300">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full border border-emerald-400/70 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium hover:bg-emerald-400 hover:text-slate-950 transition"
                >
                  Get started
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto max-w-3xl px-4 py-6">{children}</div>
          </main>

          <footer className="border-t border-slate-800 py-3 text-xs text-slate-500 text-center">
            Havenly 2.1 · Built with Supabase & Groq
          </footer>
        </div>
      </body>
    </html>
  );
}
