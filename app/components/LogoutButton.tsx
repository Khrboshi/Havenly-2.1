"use client";

export default function LogoutButton() {
  async function handleLogout() {
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      // Do NOT router.push or refresh
      // Server redirect will take over
    } catch (e) {
      console.error("Logout failed", e);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-400 hover:text-red-300 transition"
    >
      Logout
    </button>
  );
}
