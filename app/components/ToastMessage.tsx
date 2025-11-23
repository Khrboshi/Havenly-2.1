"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ToastMessage() {
  const params = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (params.get("from") === "login") {
      setMessage("Welcome back! Glad to see you again.");
    }

    if (params.get("logout") === "1") {
      setMessage("You’ve logged out safely. Come back whenever you need a moment.");
    }
  }, [params]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast">{message}</div>
    </div>
  );
}
