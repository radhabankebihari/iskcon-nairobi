import { describe, expect, it } from "vitest";
import {
  deviceKey,
  isValidDeviceId,
  isValidPushEndpoint,
  planPushUpsert,
  pushTopic,
  rowsToRemove,
  selectRecipients,
  winningRun,
  type StoredPushRow,
} from "./pushDevices";

const DEVICE_A = "3f2b8c1e-9d4a-4b7e-8f12-6a5c3d2e1b0f";
const DEVICE_B = "a1b2c3d4-e5f6-4a7b-9c8d-0e1f2a3b4c5d";
const OLD = "https://fcm.googleapis.com/fcm/send/old-endpoint";
const NEW = "https://fcm.googleapis.com/fcm/send/new-endpoint";
const OTHER = "https://updates.push.services.mozilla.com/wpush/v2/other";

function row(rowNumber: number, overrides: Partial<StoredPushRow> = {}): StoredPushRow {
  return {
    rowNumber,
    createdAt: "2026-11-01T08:00:00.000Z",
    endpoint: OLD,
    p256dh: "p256dh-key",
    auth: "auth-key",
    userAgent: "test",
    calendarEnabled: false,
    noticeboardEnabled: false,
    deviceId: "",
    ...overrides,
  };
}

const newSubscription = { endpoint: NEW, p256dh: "new-p256dh", auth: "new-auth", userAgent: "test" };

describe("planPushUpsert", () => {
  it("appends a device it has never seen", () => {
    const plan = planPushUpsert([row(1, { endpoint: OTHER, deviceId: DEVICE_B })], {
      ...newSubscription,
      deviceId: DEVICE_A,
      calendarEnabled: true,
    });
    expect(plan.targetRow).toBeNull();
    expect(plan.deleteRows).toEqual([]);
    expect(plan.values).toMatchObject({ endpoint: NEW, deviceId: DEVICE_A, calendarEnabled: true });
  });

  it("keeps reminders on when the browser renews without sending preferences", () => {
    const rows = [row(4, { endpoint: OLD, calendarEnabled: true, noticeboardEnabled: true })];
    const plan = planPushUpsert(rows, { ...newSubscription, previousEndpoint: OLD });
    expect(plan.targetRow).toBe(4);
    expect(plan.values.calendarEnabled).toBe(true);
    expect(plan.values.noticeboardEnabled).toBe(true);
    expect(plan.values.endpoint).toBe(NEW);
  });

  it("replaces the old row of a renewed device instead of adding a second", () => {
    const rows = [
      row(2, { endpoint: OTHER, deviceId: DEVICE_B, calendarEnabled: true }),
      row(5, { endpoint: OLD, deviceId: DEVICE_A, calendarEnabled: true }),
    ];
    const plan = planPushUpsert(rows, { ...newSubscription, deviceId: DEVICE_A });
    expect(plan.targetRow).toBe(5);
    expect(plan.deleteRows).toEqual([]);
    expect(plan.values.calendarEnabled).toBe(true);
  });

  it("merges every row a device left behind into one, deleting from the bottom", () => {
    const rows = [
      row(3, { endpoint: OLD, deviceId: DEVICE_A }),
      row(7, { endpoint: NEW }),
      row(9, { endpoint: "https://fcm.googleapis.com/fcm/send/older", deviceId: DEVICE_A }),
      row(11, { endpoint: OTHER, deviceId: DEVICE_B }),
    ];
    const plan = planPushUpsert(rows, { ...newSubscription, deviceId: DEVICE_A, calendarEnabled: true });
    expect(plan.targetRow).toBe(3);
    expect(plan.deleteRows).toEqual([9, 7]);
  });

  it("lets preferences sent by the device win over stored ones", () => {
    const rows = [row(1, { endpoint: NEW, calendarEnabled: true, noticeboardEnabled: true })];
    const plan = planPushUpsert(rows, { ...newSubscription, calendarEnabled: false });
    expect(plan.values.calendarEnabled).toBe(false);
    expect(plan.values.noticeboardEnabled).toBe(true);
  });

  it("keeps a stored device ID when an older client sends none", () => {
    const plan = planPushUpsert([row(1, { endpoint: NEW, deviceId: DEVICE_A })], newSubscription);
    expect(plan.values.deviceId).toBe(DEVICE_A);
  });

  it("takes preferences from the device's newest row when nothing closer matches", () => {
    const rows = [
      row(1, { endpoint: OLD, deviceId: DEVICE_A, createdAt: "2026-10-01T00:00:00.000Z", calendarEnabled: false }),
      row(2, { endpoint: OTHER, deviceId: DEVICE_A, createdAt: "2026-11-01T00:00:00.000Z", calendarEnabled: true }),
    ];
    const plan = planPushUpsert(rows, { ...newSubscription, deviceId: DEVICE_A });
    expect(plan.values.calendarEnabled).toBe(true);
  });
});

describe("rowsToRemove", () => {
  it("removes the endpoint and every row of the same device, highest first", () => {
    const rows = [
      row(2, { endpoint: OLD, deviceId: DEVICE_A }),
      row(4, { endpoint: OTHER, deviceId: DEVICE_B }),
      row(6, { endpoint: NEW, deviceId: DEVICE_A }),
    ];
    expect(rowsToRemove(rows, NEW, DEVICE_A)).toEqual([6, 2]);
    expect(rowsToRemove(rows, OTHER)).toEqual([4]);
  });
});

describe("selectRecipients", () => {
  it("sends once per device, to its newest subscription", () => {
    const rows = [
      row(1, { endpoint: OLD, deviceId: DEVICE_A, createdAt: "2026-10-01T00:00:00.000Z" }),
      row(2, { endpoint: NEW, deviceId: DEVICE_A, createdAt: "2026-11-01T00:00:00.000Z" }),
      row(3, { endpoint: OTHER, deviceId: DEVICE_B }),
    ];
    const { recipients, duplicateRows } = selectRecipients(rows, new Set());
    expect(recipients.map(({ row }) => row.endpoint).sort()).toEqual([NEW, OTHER].sort());
    expect(duplicateRows).toBe(1);
  });

  it("skips devices that already received the reminder", () => {
    const rows = [row(1, { endpoint: NEW, deviceId: DEVICE_A }), row(2, { endpoint: OTHER })];
    const delivered = new Set([deviceKey(rows[0])]);
    const { recipients, skipped } = selectRecipients(rows, delivered);
    expect(skipped).toBe(1);
    expect(recipients.map(({ row }) => row.endpoint)).toEqual([OTHER]);
  });

  it("recognises older rows by endpoint, so a repeated endpoint is sent once", () => {
    const rows = [row(1, { endpoint: OTHER }), row(2, { endpoint: OTHER })];
    expect(selectRecipients(rows, new Set()).recipients).toHaveLength(1);
  });
});

describe("winningRun", () => {
  const now = new Date("2027-01-03T04:00:30.000Z");
  const window = 10 * 60 * 1000;

  it("lets only the first claim inside the window send", () => {
    const claims = [
      { eventId: "e1", runId: "run-a", claimedAt: "2027-01-03T04:00:00.000Z", order: 4 },
      { eventId: "e1", runId: "run-b", claimedAt: "2027-01-03T04:00:01.000Z", order: 5 },
    ];
    expect(winningRun(claims, "e1", now, window)).toBe("run-a");
  });

  it("ignores a stale claim from a run that crashed", () => {
    const claims = [
      { eventId: "e1", runId: "crashed", claimedAt: "2027-01-03T03:00:00.000Z", order: 1 },
      { eventId: "e1", runId: "retry", claimedAt: "2027-01-03T04:00:20.000Z", order: 2 },
    ];
    expect(winningRun(claims, "e1", now, window)).toBe("retry");
  });

  it("keeps claims for different events apart", () => {
    const claims = [{ eventId: "e2", runId: "other", claimedAt: "2027-01-03T04:00:00.000Z", order: 1 }];
    expect(winningRun(claims, "e1", now, window)).toBeNull();
  });
});

describe("validation", () => {
  it("accepts only random v4 device IDs", () => {
    expect(isValidDeviceId(DEVICE_A)).toBe(true);
    expect(isValidDeviceId("not-a-device")).toBe(false);
    expect(isValidDeviceId("3f2b8c1e-9d4a-1b7e-8f12-6a5c3d2e1b0f")).toBe(false);
    expect(isValidDeviceId(42)).toBe(false);
  });

  it("accepts only real browser push services", () => {
    expect(isValidPushEndpoint(NEW)).toBe(true);
    expect(isValidPushEndpoint("https://web.push.apple.com/abc")).toBe(true);
    expect(isValidPushEndpoint("https://evil.example.com/fcm.googleapis.com")).toBe(false);
    expect(isValidPushEndpoint("http://fcm.googleapis.com/x")).toBe(false);
  });

  it("makes a push topic the push service accepts", () => {
    const topic = pushTopic("2027-08-25-janmashtami-appearance-of-lord-sri-krishna");
    expect(topic).toMatch(/^[A-Za-z0-9_-]{32}$/);
    expect(pushTopic("same")).toBe(pushTopic("same"));
  });
});
