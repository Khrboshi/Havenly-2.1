export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-qm-bg">
      <div className="flex items-center gap-3 rounded-full border border-qm-border-subtle bg-qm-card px-4 py-2 text-sm text-qm-secondary">
        <span className="h-2 w-2 animate-pulse rounded-full bg-qm-accent" />
        <span>Loading…</span>
      </div>
    </div>
  );
}
