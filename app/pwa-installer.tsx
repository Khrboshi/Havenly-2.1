"use client";

import { useEffect, useState } from "react";
import AddToHomeScreenPrompt from "@/components/AddToHomeScreenPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function PwaInstaller() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isMobile()) {
      setShowPrompt(true);
    }
  }, []);

  return (
    <>
      <ServiceWorkerRegister />
      {showPrompt && <AddToHomeScreenPrompt />}
    </>
  );
}
