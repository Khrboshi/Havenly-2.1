"use client";

export default function LogoutButton() {
  return (
    <a
      href="/logout"
      className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/90 hover:bg-white/10 transition"
    >
      Log out
    </a>
  );
}
