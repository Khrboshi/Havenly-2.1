"use client";

import { useState } from "react";
import ToastMessage from "./ToastMessage";

export default function ToastClient() {
  const [toast, setToast] = useState("");

  // Call this to trigger a toast
  (globalThis as any).toast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  return toast ? <ToastMessage message={toast} /> : null;
}
