import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/60 py-8 text-center text-xs text-slate-500">
      <p>© {new Date().getFullYear()} Havenly. All rights reserved.</p>

      <div className="mt-2">
        <Link
          href="/privacy"
          className="text-slate-400 hover:text-emerald-300 transition"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
