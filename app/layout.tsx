// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Havenly 2.1 — A calm space to understand your day",
  description:
    "Havenly is a gentle private micro-journal with AI reflections that help you slow down, notice how you're doing, and feel a little lighter — without pressure or judgment.",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  appleWebApp: {
    capable: true,
    title: "Havenly 2.1",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className="min-h-screen antialiased">
        {/* 
          IMPORTANT:
          The header/navbar is NOT imported here anymore.
          It is rendered inside the page components just like in your repo.
        */}
        {children}

        {/* Mobile install hint */}
        <div className="fixed bottom-4 inset-x-0 px-4 md:hidden z-50">
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-3 text-center shadow-lg">
            <p className="text-slate-200 text-sm leading-relaxed">
              Add Havenly 2.1 to your home screen:
              <br />
              <span className="text-emerald-300 font-medium">
                On iPhone: tap Share → Add to Home Screen
              </span>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
