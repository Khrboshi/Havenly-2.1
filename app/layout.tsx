import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import ToastMessage from "./components/ToastMessage";

export const metadata: Metadata = {
  title: "Havenly 2.1 – A calm space to reflect",
  description:
    "Havenly helps you slow down, capture what’s happening inside you, and get short AI-assisted reflections in just a few minutes a day.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200">
        {/* Global top navigation (client-side, reacts instantly to auth changes) */}
        <Navbar />

        {/* Page content */}
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>

        {/* Global toast handler for login / logout messages */}
        <ToastMessage />
      </body>
    </html>
  );
}
