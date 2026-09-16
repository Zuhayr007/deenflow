import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  use: {
    channel: "chromium",
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 390, height: 844 },
    geolocation: { latitude: -33.9249, longitude: 18.4241 },
    permissions: ["geolocation"],
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve.mjs",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
  },
});
