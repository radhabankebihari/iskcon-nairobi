import { expect, test, type Page } from "@playwright/test";
import { blockApiWrites } from "./helpers";

// The status bar, HKTC sub-nav, and noticeboard all pin to the header, which shrinks
// as the page scrolls. These tests scroll for real and measure the rendered positions,
// because a screenshot taken back at the top of the page cannot see a gap.
const TOLERANCE = 0.75;

async function statusBarGap(page: Page) {
  return page.evaluate(() => {
    const header = document.querySelector(".site-nav")!.getBoundingClientRect();
    const bar = [...document.querySelectorAll<HTMLElement>("div.fixed")].find((element) =>
      element.style.top.includes("site-header-height")
    )!;
    return bar.getBoundingClientRect().top - header.bottom;
  });
}

async function scrollTo(page: Page, top: number) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
}

// Records the widest gap on every painted frame while the header animates.
async function widestGapWhileScrolling(page: Page, top: number) {
  return page.evaluate(
    ({ y }) =>
      new Promise<number>((resolve) => {
        const header = document.querySelector(".site-nav")!;
        const bar = [...document.querySelectorAll<HTMLElement>("div.fixed")].find((element) =>
          element.style.top.includes("site-header-height")
        )!;
        const started = performance.now();
        let widest = -Infinity;
        window.scrollTo({ top: y, behavior: "instant" });
        const measure = () => {
          widest = Math.max(widest, bar.getBoundingClientRect().top - header.getBoundingClientRect().bottom);
          if (performance.now() - started < 1200) requestAnimationFrame(measure);
          else resolve(widest);
        };
        requestAnimationFrame(measure);
      }),
    { y: top }
  );
}

test.beforeEach(async ({ page }) => {
  await blockApiWrites(page);
});

test("the temple name stays on one line at every supported width", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });

  const brand = page.locator(".nav-brand-name");
  const metrics = await brand.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      height: element.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(style.lineHeight),
      whiteSpace: style.whiteSpace,
    };
  });

  expect(metrics.whiteSpace).toBe("nowrap");
  expect(metrics.height).toBeLessThanOrEqual(metrics.lineHeight + 1);
});

test("the desktop brand expansion stays on one line", async ({ page, isMobile }) => {
  test.skip(isMobile, "The expansion is intentionally hidden in the mobile header.");
  await page.goto("/", { waitUntil: "load" });

  const expansion = page.locator(".nav-brand-expansion");
  const metrics = await expansion.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      height: element.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(style.lineHeight),
      whiteSpace: style.whiteSpace,
    };
  });

  expect(metrics.whiteSpace).toBe("nowrap");
  expect(metrics.height).toBeLessThanOrEqual(metrics.lineHeight + 1);
});

test("the homepage invites giving through the donate page", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });

  const cta = page.locator("[data-donation-cta]");
  await expect(cta).toHaveAttribute("href", "/donate");
  const box = await cta.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
});

test("the donate page offers every cause with its own page", async ({ page }) => {
  await page.goto("/donate", { waitUntil: "load" });

  const causes = await page
    .locator("[data-giving-cause]")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(causes).toEqual([
    "/donate/general",
    "/donate/temple",
    "/donate/food",
    "/donate/cows",
    "/donate/students",
    "/donate/festivals",
  ]);
});

for (const route of ["/", "/visit"]) {
  test(`${route}: the status bar stays attached to the header`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(1000);

    expect(await widestGapWhileScrolling(page, 700), "gap during the first scroll").toBeLessThanOrEqual(TOLERANCE);
    await page.waitForTimeout(500);
    expect(Math.abs(await statusBarGap(page)), "offset once settled").toBeLessThanOrEqual(TOLERANCE);

    // Returning to the top and scrolling again must land in the same place.
    await scrollTo(page, 0);
    await page.waitForTimeout(800);
    expect(await widestGapWhileScrolling(page, 900), "gap during the second scroll").toBeLessThanOrEqual(TOLERANCE);
    await page.waitForTimeout(500);
    expect(Math.abs(await statusBarGap(page)), "offset after the second scroll").toBeLessThanOrEqual(TOLERANCE);
  });
}

test("the status bar stays attached between the phone and desktop menus", async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  await scrollTo(page, 700);
  await page.waitForTimeout(800);
  expect(Math.abs(await statusBarGap(page))).toBeLessThanOrEqual(TOLERANCE);
});

test("the status bar reattaches after the window is resized", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  await scrollTo(page, 700);
  await page.waitForTimeout(800);

  const { width, height } = page.viewportSize()!;
  await page.setViewportSize({ width: height, height: width });
  await page.waitForTimeout(800);
  expect(Math.abs(await statusBarGap(page))).toBeLessThanOrEqual(TOLERANCE);
});

test("the HKTC sub-navigation pins directly under the header", async ({ page }) => {
  await page.goto("/projects/hktc-nairobi", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  await scrollTo(page, 1600);
  await page.waitForTimeout(800);

  const offset = await page.evaluate(() => {
    const header = document.querySelector(".site-nav")!.getBoundingClientRect();
    const subNav = document.querySelector('nav[aria-label="HKTC page sections"]')!.getBoundingClientRect();
    return subNav.top - header.bottom;
  });
  expect(Math.abs(offset)).toBeLessThanOrEqual(TOLERANCE);
});

test("the noticeboard opens directly under the status bar on phones", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The panel is anchored to its button on wider screens.");

  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(1000);
  await scrollTo(page, 700);
  await page.waitForTimeout(800);
  await page.getByRole("button", { name: "Open temple noticeboard" }).click();
  await page.waitForTimeout(300);

  const offset = await page.evaluate(() => {
    const bar = [...document.querySelectorAll<HTMLElement>("div.fixed")].find((element) =>
      element.style.top.includes("site-header-height")
    )!;
    const panel = document.querySelector(".z-\\[90\\]")!;
    return panel.getBoundingClientRect().top - bar.getBoundingClientRect().bottom;
  });
  expect(Math.abs(offset)).toBeLessThanOrEqual(TOLERANCE);
});

// The browser can restore the scroll position before the page's JavaScript is ready,
// so no scroll event arrives for the header to react to. Slowing the scripts makes
// that order happen every time.
for (const route of ["/", "/visit"]) {
  test(`${route}: refreshing mid-scroll keeps the compact header`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(1000);
    await scrollTo(page, 1200);
    await page.waitForTimeout(800);

    await page.route("**/_next/static/chunks/**/*.js", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await route.continue();
    });
    await page.reload({ waitUntil: "load" });
    await page.waitForFunction(() => window.scrollY > 40);
    await page.waitForTimeout(1500);

    const state = await page.evaluate(() => {
      const header = document.querySelector(".site-nav")!;
      const bar = [...document.querySelectorAll<HTMLElement>("div.fixed")].find((element) =>
        element.style.top.includes("site-header-height")
      )!;
      return {
        background: getComputedStyle(header).backgroundColor,
        barOpacity: getComputedStyle(bar).opacity,
        gap: bar.getBoundingClientRect().top - header.getBoundingClientRect().bottom,
      };
    });

    expect(state.background, "header background").not.toBe("rgba(0, 0, 0, 0)");
    expect(state.barOpacity, "status bar shown").toBe("1");
    expect(Math.abs(state.gap), "status bar attached").toBeLessThanOrEqual(TOLERANCE);
  });
}
