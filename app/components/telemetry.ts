export function track(event: string, data?: Record<string, any>) {
  try {
    fetch("/api/telemetry/upgrade-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
      keepalive: true,
    });
  } catch {}
}
