import "./globals.css";
import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import DeepLinkBootstrap from "./components/DeepLinkBootstrap";
import { SpeedInsights } from "@vercel/speed-insights/next";
import InstallPrompt from "@/app/components/InstallPrompt";

const SITE_URL = "https://havenly-2-1.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Havenly — The Journal That Listens",
    template: "%s | Havenly",
  },
  description:
    "Write what's weighing on you. Get a gentle reflection back. Start seeing what keeps returning. Private AI journaling, free to start.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/pwa/icon-192.png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Havenly",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: "Havenly",
    title: "Havenly — The Journal That Listens",
    description:
      "Write what's weighing on you. Get a gentle reflection back. Start seeing what keeps returning.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: "Havenly — The Journal That Listens",
    description:
      "Write what's weighing on you. Get a gentle reflection back.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2ad3b2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA / Apple */}
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/pwa/icon-192.png" />

        {/* Google Fonts — Fraunces (display) + DM Sans (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300;1,9..144,400;1,9..144,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
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
