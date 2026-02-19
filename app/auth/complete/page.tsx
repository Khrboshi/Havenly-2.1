"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function safeNext(raw: string | null) {
  const v = (raw || "/dashboard").trim();
  if (!v.startsWith("/") || v.startsWith("//")) return "/dashboard";
  return v;
}

export default function AuthCompletePage() {
  const sp = useSearchParams();
  const next = useMemo(() => safeNext(sp.get("next")), [sp]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    // Notify other tabs (original tab) that auth completed
    const payload = JSON.stringify({ at: Date.now(), next });

    try {
      localStorage.setItem("havenly:auth_complete", payload);
    } catch {}

    try {
      const bc = new BroadcastChannel("havenly_auth");
      bc.postMessage({ type: "AUTH_COMPLETE", next, at: Date.now() });
      bc.close();
    } catch {}

    // Try to close this tab (often blocked)
    const t = setTimeout(() => {
      window.close();
      // if it didn't close, show UI
      setClosed(false);
    }, 300);

    // If the tab *is* allowed to close, user won't see this anyway
    return () => clearTimeout(t);
  }, [next]);

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>You’re signed in</h1>
        <p style={{ opacity: 0.8, marginBottom: 16 }}>
          Return to your original Havenly tab — it should open your dashboard automatically.
        </p>

        <a
          href={next}
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 10,
            background: "#34d399",
            color: "#0f172a",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Continue to dashboard
        </a>

        <div style={{ marginTop: 14, fontSize: 12, opacity: 0.7 }}>
          If this tab didn’t close automatically, you can close it now.
        </div>
      </div>
    </div>
  );
}
