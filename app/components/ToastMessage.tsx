"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ToastMessage() {
  const params = useSearchParams();
  const [visible, setVisible] = useState(false);

  const message = params.get("message");

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timeout = setTimeout(() => setVisible(false), 3500);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  if (!visible || !message) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-slate-100 text-sm animate-fade-in">
      {message}
    </div>
  );
}
