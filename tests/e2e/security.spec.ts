import { expect, test } from "@playwright/test";

test("homepage sends the launch security headers", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["strict-transport-security"]).toContain("includeSubDomains");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("geolocation=()");
  expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
  expect(headers["cross-origin-resource-policy"]).toBe("same-origin");
});

for (const path of [
  "/",
  "/festivals",
  "/blog",
  "/donate",
  "/contact",
  "/festivals/kirtan-safari",
]) {
  test(`${path} has no CSP console violations`, async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (message) => {
      if (/content security policy|content-security-policy/i.test(message.text())) {
        violations.push(message.text());
      }
    });

    await page.goto(path, { waitUntil: "load" });
    expect(violations).toEqual([]);
  });
}

test("calendar reminder cron rejects unauthenticated requests", async ({ request }) => {
  const response = await request.get("/api/cron/calendar-reminders");
  expect([401, 404]).toContain(response.status());
});
