import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.fazaa.app",
  appName: "Fazaa",
  webDir: "out",
  server: {
    url: "https://fazaa-app.com",
    cleartext: false,
  },
};

export default config;