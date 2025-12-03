"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MagicLoginForm from "./components/MagicLoginForm";

function MagicLoginContent() {
  const searchParams = useSearchParams(); // SAFE because wrapped in Suspense

  const message = searchParams.get("message");
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-6 rounded-xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-3">Magic Login</h1>
        <p className="text-center text-slate-300 mb-6">
          Enter your email and we’ll send you a secure login link.
        </p>

        {message && (
          <p className="mb-4 text-green-400 text-center">{message}</p>
        )}
        {error && <p className="mb-4 text-red-400 text-center">{error}</p>}

        <MagicLoginForm />
      </div>
    </div>
  );
}

export default function MagicLoginPage() {
  // Suspense is required for useSearchParams in a client component
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <MagicLoginContent />
    </Suspense>
  );
}
