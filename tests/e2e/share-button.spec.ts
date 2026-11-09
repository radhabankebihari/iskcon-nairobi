import { expect, test } from "@playwright/test";

for (const [route, label, title] of [
  ["/festivals/kartik", "Share Kartik", "Kartik, the Month of Damodara"],
  ["/festivals/janmashtami", "Share this festival", "Krishna Janmashtami"],
] as const) {
  test(`${route} shares its own URL`, async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    });
    await page.goto(`${route}#details`, { waitUntil: "load" });

    const share = page.getByTestId("share-page").first();
    await expect(share).toBeVisible();
    await expect(share).toHaveAccessibleName(label);
    await share.click();
    await expect(share).toContainText("Link copied");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`http://localhost:3031${route}`);
    await expect(share).toContainText(label, { timeout: 5000 });

    await page.evaluate(() => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: (data: ShareData) => {
          (window as Window & { sharedData?: ShareData }).sharedData = data;
          return Promise.resolve();
        },
      });
    });
    await share.click();
    expect(await page.evaluate(() => (window as Window & { sharedData?: ShareData }).sharedData)).toMatchObject({
      title,
      url: `http://localhost:3031${route}`,
    });
  });
}

test("festival hero share link fits a phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/festivals/janmashtami", { waitUntil: "load" });

  const hero = page.locator("main > section").first();
  const subtitle = hero.getByText("Appearance of Lord Krishna", { exact: true });
  const share = hero.getByRole("button", { name: "Share this festival" });
  await expect(subtitle).toBeVisible();
  await expect(share).toBeVisible();
  const heroBox = await hero.boundingBox();
  const shareBox = await share.boundingBox();
  expect(heroBox && shareBox && shareBox.x + shareBox.width <= heroBox.x + heroBox.width).toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
