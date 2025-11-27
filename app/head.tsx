export default function Head() {
  return (
    <>
      {/* PWA & icons */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#020617" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />

      {/* iOS homescreen support */}
      <link rel="apple-touch-icon" href="/icon-192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-title" content="Havenly 2.1" />
    </>
  );
}
