import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.your.app',
  appName: 'Havenly',
  webDir: 'out',
  server: {
    url: 'https://YOUR_DOMAIN',
    cleartext: false
  }
};

export default config;
