export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/60 bg-slate-900/40 backdrop-blur-lg">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-slate-400">
        Havenly 2.1 · A calmer, kinder way to understand your day.
        <br />
        <span className="text-slate-500">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
