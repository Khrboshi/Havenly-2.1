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
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/pwa/icon-192.png" }]
  },
  appleWebApp: {
    capable: true,
    title: "Havenly",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#2ad3b2"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Fix Chrome warning: include this when using apple-mobile-web-app-capable */}
        <meta name="mobile-web-app-capable" content="yes" />
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
