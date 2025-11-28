import "./globals.css";

import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import PwaInstallHint from "./components/PwaInstallHint";

export const metadata: Metadata = {
  title: "Havenly 2.1",
  description: "A calmer, kinder way to understand your day.",
  manifest: "/manifest.json",
  themeColor: "#4CA7A3",
  icons: {
    icon: "/pwa/icon-192.png",
    apple: "/pwa/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Required Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Havenly" />
        <link rel="apple-touch-icon" href="/pwa/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", () => {
                  navigator.serviceWorker.register("/service-worker.js");
                });
              }
            `,
          }}
        />
      </head>

      <body>
        {/* Top Navigation */}
        <SiteHeader />

        {/* Floating mobile install hint */}
        <PwaInstallHint />

        {/* Page content */}
        {children}
      </body>
    </html>
  );
}
