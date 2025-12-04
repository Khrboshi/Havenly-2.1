// app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 mt-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-white/60">
        <p>© {year} Havenly 2.1. All rights reserved.</p>

        <div className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="hover:text-emerald-300 transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
