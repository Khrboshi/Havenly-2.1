"use client";

import { useEffect, useState } from "react";
import AddToHomeScreenPrompt from "@/components/AddToHomeScreenPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export default function PwaInstaller() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) setShow(true);
  }, []);

  return (
    <>
      <ServiceWorkerRegister />
      {show && <AddToHomeScreenPrompt />}
    </>
  );
}
