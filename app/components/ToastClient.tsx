"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ToastClient() {
  const params = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = params.get("msg");
    if (msg) {
      setMessage(msg);
      const timeout = setTimeout(() => setMessage(null), 4500);
      return () => clearTimeout(timeout);
    }
  }, [params]);

  if (!message) return null;

  return (
    <div className="toast-container">
      <div className="toast animate-fade-in">{message}</div>
    </div>
  );
}
