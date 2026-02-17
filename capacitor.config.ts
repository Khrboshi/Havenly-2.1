// Keep this file non-blocking for web builds.
// We will install Capacitor packages later when we actually add the native shells.

const config = {
  appId: "com.your.app",
  appName: "Havenly",
  webDir: "out",
  server: {
    url: "https://YOUR_DOMAIN",
    cleartext: false,
  },
};

export default config;
