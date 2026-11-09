import { expect, test } from "@playwright/test";
import { blockApiWrites, fixedTime, publicRoutes } from "./helpers";

for (const width of [375, 768, 1280, 1440]) {
  test.describe(`${width}px layout`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const route of publicRoutes) {
      test(`${route} fits and loads its images`, async ({ page }) => {
        await blockApiWrites(page);
        await page.clock.setFixedTime(fixedTime);
        const response = await page.goto(route, { waitUntil: "load" });
        expect(response?.status()).toBe(200);

        const issues = await page.evaluate(async () => {
          await document.fonts.ready;
          const imageIssues = [...document.images]
            .filter((image) => !image.hasAttribute("alt") || (image.complete && image.naturalWidth === 0))
            .map((image) => image.currentSrc || image.src);
          const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
          return { overflow, imageIssues };
        });

        expect(issues.overflow, `horizontal overflow on ${route}`).toBeLessThanOrEqual(0);
        expect(issues.imageIssues, `missing alt or broken image on ${route}`).toEqual([]);
      });
    }
  });
}

test("unknown route serves the branded 404 with status 404", async ({ page }) => {
  const response = await page.goto("/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible();
});

test.describe("installed app offline navigation", () => {
  test.use({ serviceWorkers: "allow" });

  test("an uncached page opens the offline fallback", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => true));
    await page.waitForFunction(() => Boolean(navigator.serviceWorker?.controller));
    await page.context().setOffline(true);
    await page.goto("/terms?offline-check=1", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "You are offline" })).toBeVisible();
  });
});

test("visible pages do not link to missing internal destinations", async ({ page, request }) => {
  const targets = new Set<string>();
  for (const route of publicRoutes) {
    await blockApiWrites(page);
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const links = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => (anchor as HTMLAnchorElement).href)
    );
    for (const link of links) {
      const url = new URL(link);
      if (url.origin === new URL(page.url()).origin && !url.pathname.startsWith("/api/")) {
        targets.add(url.pathname);
      }
    }
  }
  for (const target of targets) {
    const response = await request.get(target, { maxRedirects: 5 });
    expect(response.status(), target).toBe(200);
  }
});

test("phone navigation and noticeboard work from the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await blockApiWrites(page);
  await page.goto("/", { waitUntil: "load" });

  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator('[role="dialog"][aria-label="Site menu"]')).toHaveAttribute("inert", "");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();

  const noticeboard = page.getByRole("button", { name: "Open temple noticeboard" });
  await noticeboard.focus();
  await page.keyboard.press("Enter");
  await expect(noticeboard).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(noticeboard).toHaveAttribute("aria-expanded", "false");
});
