import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const { callAppsScript } = vi.hoisted(() => ({ callAppsScript: vi.fn() }));

vi.mock("@/lib/appsScriptBridge", () => ({ callAppsScript }));

import { POST } from "./route";

function pageView() {
  return new NextRequest("http://localhost/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "page_view", path: "/" }),
  });
}

describe("analytics write guard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    callAppsScript.mockClear();
  });

  it("does not touch Google Sheets during local development", async () => {
    vi.stubEnv("NODE_ENV", "development");

    const response = await POST(pageView());

    expect(response.status).toBe(200);
    expect(callAppsScript).not.toHaveBeenCalled();
  });

  it("does not touch Google Sheets when disabled on a production build", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ANALYTICS_DISABLED", "true");

    const response = await POST(pageView());

    expect(response.status).toBe(200);
    expect(callAppsScript).not.toHaveBeenCalled();
  });
});
