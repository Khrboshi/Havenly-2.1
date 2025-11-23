import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Havenly 2.1",
  description: "AI-powered reflection journal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <Navbar />
        <ToastMessage />
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}

// ------------------------------
// TOAST SYSTEM
// ------------------------------
"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function ToastMessage() {
  const params = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (params.get("loggedout") === "1") {
      setShow(true);
      setTimeout(() => setShow(false), 4500);
    }
  }, [params]);

  if (!show) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        You logged out. Take care of yourself today — your space will be here
        when you come back.
      </div>
    </div>
  );
}
