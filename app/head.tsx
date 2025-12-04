// app/head.tsx
export default function Head() {
  return (
    <>
      <title>Havenly 2.1</title>
      <meta
        name="description"
        content="Havenly 2.1 is a calm, private journaling space where you can write a few honest sentences and receive gentle AI reflections."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* PWA & theme */}
      <meta name="theme-color" content="#4CA7A3" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/icon.svg" />

      {/* iOS PWA support */}
      <link rel="apple-touch-icon" href="/pwa/icon-192.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />

      {/* Basic social hints (optional, safe defaults) */}
      <meta property="og:title" content="Havenly 2.1" />
      <meta
        property="og:description"
        content="A calmer, kinder way to understand your day."
      />
    </>
  );
}
