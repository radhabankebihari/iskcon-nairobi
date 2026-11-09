import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const { callAppsScript } = vi.hoisted(() => ({ callAppsScript: vi.fn() }));

vi.mock("@/lib/appsScriptBridge", () => ({ callAppsScript }));

import { POST as contactPost } from "./contact/route";
import { POST as registrationPost } from "./kirtan-safari-registration/route";
import { POST as interestPost } from "./kirtan-safari-future-interest/route";

function request(path: string, body: Record<string, unknown>) {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("public form honeypots", () => {
  afterEach(() => callAppsScript.mockClear());

  it.each([
    ["contact", "/api/contact", contactPost],
    ["Kirtan Safari registration", "/api/kirtan-safari-registration", registrationPost],
    ["Kirtan Safari interest", "/api/kirtan-safari-future-interest", interestPost],
  ])("silently discards %s submissions with a filled website field", async (_name, path, post) => {
    const response = await post(request(path, { website: "https://spam.example" }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(callAppsScript).not.toHaveBeenCalled();
  });
});
