export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 18, marginBottom: 8 }}>Signing you in…</div>
        <div style={{ opacity: 0.7, fontSize: 14 }}>
          Please keep this tab open for a moment.
        </div>
      </div>
    </div>
  );
}
