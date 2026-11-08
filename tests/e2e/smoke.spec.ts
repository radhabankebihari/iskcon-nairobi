import { expect, test } from "@playwright/test";
import { blockApiWrites, fixedTime, publicRoutes } from "./helpers";

for (const route of publicRoutes) {
  test(`${route} loads cleanly`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await blockApiWrites(page);
    await page.clock.setFixedTime(fixedTime);
    const response = await page.goto(route, { waitUntil: "load" });

    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
    expect(pageErrors).toEqual([]);
    expect(await page.locator("h1").count(), "page should have one main heading").toBe(1);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, "page should not scroll sideways").toBeLessThanOrEqual(0);
  });
}

// Pages are prerendered once, so time-dependent text must not differ from the
// saved HTML at any point in the temple's day.
for (const time of ["05:00", "14:00", "18:00", "23:00"]) {
  test(`hydrates without errors at ${time} Nairobi time`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await blockApiWrites(page);
    await page.clock.setFixedTime(new Date(`2026-11-04T${time}:00+03:00`));
    await page.goto("/visit", { waitUntil: "load" });
    await page.waitForTimeout(500);

    expect(pageErrors).toEqual([]);
  });
}

test("homepage hero copy is visible without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/", { waitUntil: "load" });

  await expect(page.locator(".hero-tagline")).toBeVisible();
  await expect(page.locator(".hero-ctas a, .hero-ctas button").first()).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await context.close();
});

test("unknown donation funds return a 404", async ({ page }) => {
  const response = await page.goto("/donate/does-not-exist");
  expect(response?.status()).toBe(404);
});

test("Ratha Yatra page stays unpublished", async ({ page, request }) => {
  const response = await page.goto("/festivals/rath-yatra");
  expect(response?.status()).toBe(404);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/festivals/rath-yatra");
  await page.goto("/festivals");
  await expect(page.locator('a[href="/festivals/rath-yatra"]')).toHaveCount(0);
});

test("the unpublished shop is not listed as a public page", async ({ request }) => {
  expect((await request.get("/shop")).status()).toBe(404);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("https://iskconnairobi.com/shop");
});

test("founder sources read as publication notes, not editing notes", async ({ page }) => {
  await page.goto("/srila-prabhupada");
  await expect(page.getByRole("heading", { name: "Sources and photographs" })).toBeVisible();
  await expect(page.locator("main")).not.toContainText("your supplied text");
  await expect(page.locator("main")).not.toContainText("I found references");
});

test("Juja outreach and guest-house pages match the published offering", async ({ page }) => {
  await page.goto("/projects/hktc-juja");
  await expect(page.locator("main")).toContainText("students and families");
  await expect(page.locator("main")).not.toContainText("satellite campus");
  await page.goto("/guest-house");
  await expect(page.getByRole("heading", { name: /Guest House/ })).toBeVisible();
});

test("farm gallery opens with distinct photographs", async ({ page }) => {
  await page.goto("/media#farm-goshala");
  await expect(page.getByRole("button", { name: "Farm & Goshala", exact: true })).toHaveAttribute("aria-pressed", "true");
  const photos = await page.locator("#farm-goshala ~ div button img").evaluateAll((images) =>
    images.map((image) => image.getAttribute("src"))
  );
  expect(photos).toHaveLength(6);
  expect(new Set(photos).size).toBe(photos.length);
});

test("the misspelled Radhashtami address redirects", async ({ page }) => {
  await page.goto("/festivals/radhastami");
  await expect(page).toHaveURL(/\/festivals\/radhashtami$/);
});

test("the old Damodarastakam address opens the verses on the Kartik page", async ({ page }) => {
  await blockApiWrites(page);
  await page.goto("/festivals/damodarastakam");
  await expect(page).toHaveURL(/\/festivals\/kartik#damodarastakam$/);
  await expect(page.getByRole("heading", { name: "Damodarastakam", exact: true })).toBeVisible();
});

test("the Damodarastakam reader switches between verses and meanings", async ({ page }) => {
  await blockApiWrites(page);
  await page.goto("/festivals/kartik#damodarastakam", { waitUntil: "load" });
  const verses = page.locator("#damodarastakam ol > li");
  await expect(verses).toHaveCount(8);
  const firstLine = page.getByText("namāmīśvaraṁ sac-cid-ānanda-rūpaṁ");
  await expect(firstLine).toBeVisible();

  await page.getByRole("radio", { name: "Meaning" }).click();
  await expect(firstLine).toHaveCount(0);
  await expect(verses.first()).toContainText("I bow to the Lord");

  await page.getByRole("radio", { name: "Sanskrit" }).click();
  await expect(firstLine).toBeVisible();
  await expect(verses.first()).not.toContainText("I bow to the Lord");
});

for (const route of publicRoutes) {
  test(`${route} declares itself as its canonical address`, async ({ page }) => {
    await blockApiWrites(page);
    await page.goto(route, { waitUntil: "domcontentloaded" });

    if (route === "/offline") return;
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical ?? "").pathname).toBe(route);
  });
}

test("every address in the sitemap loads", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);

  expect(paths.length).toBeGreaterThan(10);
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});

test("the homepage always lists upcoming dates", async ({ page }) => {
  await blockApiWrites(page);
  await page.clock.setFixedTime(fixedTime);
  await page.goto("/", { waitUntil: "load" });

  const section = page.locator("section", { hasText: "Upcoming" }).filter({ hasText: "Festivals" }).last();
  await expect(section.locator("li").first()).toBeVisible();
});
