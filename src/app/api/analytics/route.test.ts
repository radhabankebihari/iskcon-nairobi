import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const { callAppsScript } = vi.hoisted(() => ({ callAppsScript: vi.fn() }));

vi.mock("@/lib/appsScriptBridge", () => ({ callAppsScript }));

import { POST } from "./route";

function pageView(path = "/") {
  return new NextRequest("http://localhost/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event: "page_view", path }),
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

  it("stores only the pathname, not query data or fragments", async () => {
    vi.stubEnv("NODE_ENV", "production");
    callAppsScript.mockResolvedValue({ recorded: true });

    const response = await POST(pageView("/festivals/kartik?email=visitor@example.com#lyrics"));

    expect(response.status).toBe(200);
    expect(callAppsScript).toHaveBeenCalledWith("analytics.record", {
      event: "page_view",
      path: "/festivals/kartik",
      city: "",
    });
  });

  it("rejects a protocol-relative analytics path", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const response = await POST(pageView("//external.example/path"));

    expect(response.status).toBe(400);
    expect(callAppsScript).not.toHaveBeenCalled();
  });
});
