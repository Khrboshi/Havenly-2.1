// app/auth/complete/CompleteClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DESTINATION = "/dashboard";

export default function CompleteClient() {
  const [closeBlocked, setCloseBlocked] = useState(false);

  useEffect(() => {
    // Signal the original tab (magic-login page) via both channels.
    // Always send /dashboard — never rely on URL params which email
    // clients like Yahoo and Gmail routinely strip or mangle.
    const payload = JSON.stringify({ next: DESTINATION, t: Date.now() });
    try { localStorage.setItem("havenly:auth_complete", payload); } catch {}
    try {
      const bc = new BroadcastChannel("havenly_auth");
      bc.postMessage({ type: "AUTH_COMPLETE", next: DESTINATION });
      bc.close();
    } catch {}

    // Attempt to close this tab.
    // window.close() only works when opened via window.open().
    // For email-client links it will be blocked silently.
    // We detect whether it worked by checking if JS is still running 400ms later.
    setTimeout(() => {
      window.close();
      setTimeout(() => {
        // Still running — tab is still open. Show fallback UI.
        setCloseBlocked(true);
      }, 300);
    }, 100);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#f8fafc",
            marginBottom: 8,
          }}
        >
          {closeBlocked ? "You're signed in." : "Signing you in\u2026"}
        </div>
        <div
          style={{
            opacity: 0.6,
            fontSize: 14,
            color: "#cbd5e1",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          {closeBlocked
            ? "Your original tab is ready. You can close this one."
            : ""}
        </div>

        {closeBlocked && (
          <Link
            href={DESTINATION}
            style={{
              display: "inline-block",
              padding: "10px 20px",
              borderRadius: 9999,
              background: "#3ee7b0",
              color: "#020617",
              fontWeight: 700,
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Go to dashboard &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
