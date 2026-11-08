import type { Page } from "@playwright/test";

// Every public page. Add new routes here so they are scanned from day one.
export const publicRoutes = [
  "/",
  "/about",
  "/blog",
  "/blog/jharikhanda-forest-kirtan-safari",
  "/blog/sri-nama-sankirtana-adhivasa",
  "/contact",
  "/donate",
  "/donate/general",
  "/festivals",
  "/festivals/gaura-purnima",
  "/festivals/janmashtami",
  "/festivals/kartik",
  "/festivals/kirtan-safari",
  "/festivals/radhashtami",
  "/guest-house",
  "/leadership",
  "/learn",
  "/media",
  "/offline",
  "/privacy",
  "/projects",
  "/projects/food-for-life",
  "/projects/hktc-juja",
  "/projects/hktc-nairobi",
  "/projects/hktc-nairobi/apply",
  "/projects/thika-farm",
  "/serve",
  "/srila-prabhupada",
  "/terms",
  "/visit",
];

// Full-page screenshots are heavy, so they cover the main visitor journeys and
// one page from each shared layout family.
export const visualRoutes = [
  "/",
  "/about",
  "/blog",
  "/contact",
  "/donate",
  "/festivals",
  "/festivals/kirtan-safari",
  "/festivals/janmashtami",
  "/guest-house",
  "/learn",
  "/projects/hktc-nairobi",
  "/serve",
  "/visit",
];

// Temple status, festival phase and reminders all depend on the date. A fixed
// moment outside the festival and during opening hours keeps runs comparable.
export const fixedTime = new Date("2026-11-04T09:00:00+03:00");

// Forms write to Google Sheets and send email, so nothing but reads may reach
// the API during a test run.
export async function blockApiWrites(page: Page) {
  await page.route("**/api/**", (route) =>
    route.request().method() === "GET"
      ? route.continue()
      : route.fulfill({ status: 200, json: { ok: true } })
  );
}

export function routeLabel(route: string) {
  return route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
}
