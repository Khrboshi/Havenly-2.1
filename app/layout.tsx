import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Providers from "./providers";
import DeepLinkBootstrap from "./components/DeepLinkBootstrap";
import { SpeedInsights } from "@vercel/speed-insights/next";
import InstallPrompt from "@/app/components/InstallPrompt";
import { CONFIG, BRAND } from "@/app/lib/config";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = CONFIG.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: BRAND.fullTitle,
    template: BRAND.titleTemplate,
  },
  description: CONFIG.description,
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
    title: CONFIG.appName,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    type: "website",
    siteName: CONFIG.appName,
    title: BRAND.fullTitle,
    description: CONFIG.ogDescription,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: BRAND.fullTitle,
    description: CONFIG.ogDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#7c9fff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/pwa/icon-192.png" />
      </head>

      <body
        className={`${fraunces.variable} ${dmSans.variable}`}
        suppressHydrationWarning
      >
        <DeepLinkBootstrap />
        <Providers>
          <Navbar />
          <InstallPrompt />
          {children}
          <Footer />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
