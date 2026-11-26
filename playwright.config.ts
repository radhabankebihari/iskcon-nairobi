import { defineConfig } from "@playwright/test";

const port = 3031;
const appDirectory = process.env.VISUAL_APP_DIR;

export default defineConfig({
  testDir: "./tests/e2e",
  snapshotPathTemplate: "tests/e2e/__screenshots__/{projectName}/{arg}{ext}",
  fullyParallel: false,
  // The accessibility baseline is rewritten test by test when updating.
  workers: 1,
  timeout: 90_000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  use: {
    baseURL: `http://localhost:${port}`,
    // A cached worker would hide regressions and outlive the test server.
    serviceWorkers: "block",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: {
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 } },
    },
    // Screenshot-only sizes, because much of the site's CSS targets these widths.
    {
      name: "tablet",
      grep: /@visual/,
      use: { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true },
    },
    {
      name: "landscape",
      grep: /@visual/,
      use: { viewport: { width: 812, height: 375 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: {
    // Tests run the production build, so analytics must be switched off explicitly.
    command: `npm run start -- -p ${port}`,
    ...(appDirectory ? { cwd: appDirectory } : {}),
    url: `http://localhost:${port}`,
    timeout: 60_000,
    reuseExistingServer: false,
    env: { ANALYTICS_DISABLED: "true" },
  },
});
