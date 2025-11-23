"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ToastMessage() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const from = searchParams.get("from");
    const message = searchParams.get("message");

    let toastText = "";

    if (from === "login") {
      toastText = "Welcome back. You’re now logged in.";
    } else if (message === "logged_out") {
      toastText =
        "You’re signed out for now. Come back any time you need a quiet moment.";
    }

    if (!toastText) {
      setVisible(false);
      return;
    }

    setText(toastText);
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 4500);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="toast-container">
      <div className="toast animate-fade-in">{text}</div>
    </div>
  );
}
