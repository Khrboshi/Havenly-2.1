// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { AddToHomeScreenPrompt } from "@/components/AddToHomeScreenPrompt";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Havenly 2.1 – A calm space to understand your day",
  description:
    "Havenly is a calm, private micro-journal with gentle AI reflections that help you slow down, notice how you’re really doing, and feel a little lighter — without pressure, streaks, or judgment.",
  applicationName: "Havenly 2.1",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-950 text-slate-50 antialiased`}
      >
        {/* Register service worker for PWA behavior */}
        <ServiceWorkerRegister />

        {/* Global add-to-home-screen hint for mobile users */}
        <AddToHomeScreenPrompt />

        {/* Main site header / navigation */}
        <SiteHeader />

        {/* Page content */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
