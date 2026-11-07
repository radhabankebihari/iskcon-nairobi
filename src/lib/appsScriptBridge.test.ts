import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { callAppsScript } from "./appsScriptBridge";

const scriptUrl = "https://script.google.com/macros/s/AKfycbxExample123/exec";
const secret = "test-secret-with-at-least-thirty-two-characters";

describe("Apps Script bridge", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("signs the exact payload and returns verified bridge data", async () => {
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", scriptUrl);
    vi.stubEnv("GOOGLE_APPS_SCRIPT_SECRET", secret);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: { recorded: true } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(callAppsScript("contact.submit", { firstName: "Test" }))
      .resolves.toEqual({ recorded: true });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url.href).toBe(scriptUrl);
    const envelope = JSON.parse(options.body);
    expect(envelope.signature).toBe(
      createHmac("sha256", secret).update(envelope.payload).digest("hex")
    );
    expect(JSON.parse(envelope.payload)).toMatchObject({
      action: "contact.submit",
      data: { firstName: "Test" },
    });
  });

  it("rejects missing configuration before sending", async () => {
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", "");
    vi.stubEnv("GOOGLE_APPS_SCRIPT_SECRET", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(callAppsScript("push.list", {})).rejects.toThrow("not configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an untrusted deployment URL", async () => {
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", "https://example.com/macros/s/AKfycbxExample123/exec");
    vi.stubEnv("GOOGLE_APPS_SCRIPT_SECRET", secret);
    await expect(callAppsScript("push.list", {})).rejects.toThrow("URL is invalid");
  });

  it("rejects an Apps Script error response", async () => {
    vi.stubEnv("GOOGLE_APPS_SCRIPT_URL", scriptUrl);
    vi.stubEnv("GOOGLE_APPS_SCRIPT_SECRET", secret);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, error: "The request could not be processed." }),
    }));
    await expect(callAppsScript("push.upsert", {})).rejects.toThrow("rejected push.upsert");
  });
});
