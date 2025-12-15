export async function trackUpgradeIntent(source: string) {
  try {
    await fetch("/api/telemetry/upgrade-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source }),
    });
  } catch {
    // Never block UI
  }
}
