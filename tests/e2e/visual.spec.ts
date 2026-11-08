import { expect, test } from "@playwright/test";
import { blockApiWrites, fixedTime, routeLabel, visualRoutes } from "./helpers";

// The visual comparison script builds the base and candidate in one environment.
// Reference images stay out of git because browser rendering varies by OS.
for (const route of visualRoutes) {
  test(`${route} matches its screenshot @visual`, async ({ page }) => {
    await blockApiWrites(page);
    // A controlled clock stops carousels and counters at the same frame each run.
    await page.clock.install({ time: fixedTime });
    await page.goto(route, { waitUntil: "load" });
    await page.addStyleTag({ content: "*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }" });
    await page.clock.runFor(1500);

    // Scroll through once so lazy images and reveal-on-scroll sections render.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const viewport = page.viewportSize()?.height ?? 800;
    for (let y = 0; y < height; y += viewport) {
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
      await page.clock.runFor(500);
      await page.waitForLoadState("networkidle");
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.clock.runFor(500);
    await page.evaluate(() => document.fonts.ready);
    await page.clock.pauseAt(new Date((await page.evaluate(() => Date.now())) + 1000));

    await expect(page).toHaveScreenshot(`${routeLabel(route)}.png`, { fullPage: true, timeout: 60_000 });
  });
}
