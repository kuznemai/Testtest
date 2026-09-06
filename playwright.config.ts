import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  // The mock backend keeps state in memory, so parallel workers would fight over it.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],
  timeout: 45_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL,
    trace: "retain-on-failure",
  },

  // Uses the Chrome installed on the machine so CI/dev does not need a separate
  // Playwright browser download.
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],

  // Runs the production output: no HMR reloads in the middle of a test, and it
  // exercises exactly what gets deployed.
  webServer: {
    command: "npm run build && node .output/server/index.mjs",
    env: { PORT: String(PORT), NITRO_PORT: String(PORT), HOST: "127.0.0.1" },
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
