"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ToastMessage() {
  const params = useSearchParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (params.get("logout") === "1") {
      setMessage("You’ve logged out. Take care, and come back whenever you’re ready.");
    }
  }, [params]);

  if (!message) return null;

  return (
    <div className="toast-container animate-fade-in">
      <div className="toast">{message}</div>
    </div>
  );
}
