// app/head.tsx
export default function Head() {
  return (
    <>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000121" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Favicon */}
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    </>
  );
}
