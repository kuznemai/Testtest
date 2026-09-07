import { defineConfig, devices } from "@playwright/test";

/**
 * Runs the same suite against the generated static site, where the mock backend runs
 * in the browser instead of in Nitro. Base path is `/` here — the sub-path build for
 * GitHub Pages only changes URLs, not behaviour.
 */
const PORT = 4321;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: { baseURL, trace: "retain-on-failure" },

  projects: [
    { name: "static-desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "static-mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],

  webServer: {
    command: "npm run generate && node scripts/serve-static.mjs",
    env: { STATIC_PORT: String(PORT), STATIC_DEMO: "true", NUXT_PUBLIC_STATIC_DEMO: "true" },
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
