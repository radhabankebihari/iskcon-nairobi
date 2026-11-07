import { describe, expect, it } from "vitest";
import { needsPushSync, previousEndpointFor, PUSH_RESYNC_INTERVAL_MS } from "./pushSyncPolicy";

const now = Date.parse("2026-11-07T12:00:00.000Z");
const current = { endpoint: "https://fcm.googleapis.com/fcm/send/a", calendar: true, noticeboard: false };
const synced = { ...current, syncedAt: now - 60_000 };

describe("needsPushSync", () => {
  it("syncs a device that never synced", () => {
    expect(needsPushSync(null, current, now)).toBe(true);
  });

  it("does not sync again on every page view", () => {
    expect(needsPushSync(synced, current, now)).toBe(false);
  });

  it("syncs when the browser renewed the subscription", () => {
    expect(needsPushSync(synced, { ...current, endpoint: "https://fcm.googleapis.com/fcm/send/b" }, now)).toBe(true);
  });

  it("syncs when reminder choices change", () => {
    expect(needsPushSync(synced, { ...current, noticeboard: true }, now)).toBe(true);
  });

  it("syncs once a week as a heartbeat, and after the clock moves back", () => {
    expect(needsPushSync({ ...synced, syncedAt: now - PUSH_RESYNC_INTERVAL_MS }, current, now)).toBe(true);
    expect(needsPushSync({ ...synced, syncedAt: now + 60_000 }, current, now)).toBe(true);
  });
});

describe("previousEndpointFor", () => {
  it("names the endpoint being replaced only when it changed", () => {
    expect(previousEndpointFor(synced, "https://fcm.googleapis.com/fcm/send/b")).toBe(current.endpoint);
    expect(previousEndpointFor(synced, current.endpoint)).toBeUndefined();
    expect(previousEndpointFor(null, current.endpoint)).toBeUndefined();
  });
});
