// app/layout.tsx
import "./globals.css";
import Navbar from "./components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Havenly – A calm space to reflect",
  description:
    "Take 3–5 minutes a day to check in with yourself, jot a quick note, and get a gentle AI reflection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        {/* Global client-side navbar (handles auth via Supabase client) */}
        <Navbar />
        {/* Main content */}
        <main className="pt-10">{children}</main>
      </body>
    </html>
  );
}
