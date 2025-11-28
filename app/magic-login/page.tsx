"use client";

import { useState } from "react";
import sendMagicLink from "./sendMagicLink";

export default function MagicLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const result = await sendMagicLink(email);

    if (result.success) {
      setStatus("sent");
      setMessage("Magic login link sent! Please check your inbox.");
    } else {
      setStatus("error");
      setMessage(result.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--brand-bg)] px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-[var(--brand-text)] mb-2">
          Magic Login
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to receive a login link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-[var(--brand-primary-light)] focus:outline-none"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 rounded-lg bg-[var(--brand-primary)] text-white font-semibold hover:bg-[var(--brand-primary-dark)] transition"
          >
            {status === "loading" ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center ${
              status === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
