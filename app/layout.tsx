import "./globals.css";
import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import DeepLinkBootstrap from "./components/DeepLinkBootstrap";
import { SpeedInsights } from "@vercel/speed-insights/next";
import InstallPrompt from "@/app/components/InstallPrompt";

export const metadata: Metadata = {
  title: "Havenly",
  description: "A calm, private journaling companion with gentle AI reflections.",
  icons: {
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/pwa/icon-192.png",
    apple: [{ url: "/pwa/icon-192.png" }]
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Havenly",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#34d399"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Chrome/Android PWA support (fixes your console warning) */}
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS PWA support */}
        {/* NOTE: You already set appleWebApp in metadata. Keeping these is okay, but redundant. */}
        <meta name="apple-mobile-web-app-title" content="Havenly" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/pwa/icon-192.png" />
      </head>

      <body suppressHydrationWarning>
        <DeepLinkBootstrap />
        <Providers>
          <Navbar />
          <InstallPrompt />
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
