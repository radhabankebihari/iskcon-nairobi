import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StoredPushRow } from "@/lib/pushDevices";
import type { CalendarNotificationEvent } from "@/lib/calendarNotifications";

// An in-memory store and push service stand in for Google Sheets and web push.
const store = vi.hoisted(() => ({
  rows: [] as StoredPushRow[],
  receipts: [] as { eventId: string; key: string }[],
  removed: [] as string[],
  sent: [] as { endpoint: string; topic?: string }[],
  failOnce: new Set<string>(),
  gone: new Set<string>(),
}));

vi.mock("web-push", () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(async (subscription: { endpoint: string }, _payload: string, options: { topic?: string }) => {
      if (store.gone.has(subscription.endpoint)) throw Object.assign(new Error("gone"), { statusCode: 410 });
      if (store.failOnce.delete(subscription.endpoint)) throw Object.assign(new Error("busy"), { statusCode: 503 });
      store.sent.push({ endpoint: subscription.endpoint, topic: options.topic });
    }),
  },
}));

vi.mock("@/lib/pushSubscriptions", () => ({
  listPushRows: vi.fn(async () => store.rows),
  removePushSubscription: vi.fn(async (endpoint: string) => {
    store.removed.push(endpoint);
    store.rows = store.rows.filter((row) => row.endpoint !== endpoint);
    return true;
  }),
}));

vi.mock("@/lib/calendarPushDelivery", () => ({
  listDeliveredDeviceKeys: vi.fn(async (eventId: string) =>
    new Set(store.receipts.filter((receipt) => receipt.eventId === eventId).map((receipt) => receipt.key))
  ),
  recordDeviceReceipts: vi.fn(async (eventId: string, keys: string[]) => {
    keys.forEach((key) => store.receipts.push({ eventId, key }));
  }),
}));

const { sendCalendarPush } = await import("./calendarPush");

const event: CalendarNotificationEvent = {
  id: "2027-01-03-saphala-ekadashi",
  title: "Ekadashi reminder",
  body: "Today is Saphala Ekadashi.",
  event: "Saphala Ekadashi",
  dateLabel: "Jan 3",
  startsAt: "2027-01-03T07:00:00+03:00",
  href: "/festivals",
  type: "Ekadashi",
};

function row(rowNumber: number, endpoint: string, deviceId = "", createdAt = "2026-11-01T00:00:00.000Z"): StoredPushRow {
  return {
    rowNumber, createdAt, endpoint, p256dh: "k", auth: "a", userAgent: "",
    calendarEnabled: true, noticeboardEnabled: false, deviceId,
  };
}

const A = "3f2b8c1e-9d4a-4b7e-8f12-6a5c3d2e1b0f";
const B = "a1b2c3d4-e5f6-4a7b-9c8d-0e1f2a3b4c5d";

beforeEach(() => {
  process.env.VAPID_PUBLIC_KEY = "public";
  process.env.VAPID_PRIVATE_KEY = "private";
  process.env.VAPID_SUBJECT = "mailto:test@example.com";
  store.rows = [];
  store.receipts = [];
  store.removed = [];
  store.sent = [];
  store.failOnce.clear();
  store.gone.clear();
});

describe("sendCalendarPush", () => {
  it("reaches a device once even when it has an old and a renewed row", async () => {
    store.rows = [
      row(1, "https://fcm.googleapis.com/fcm/send/old", A, "2026-10-01T00:00:00.000Z"),
      row(2, "https://fcm.googleapis.com/fcm/send/new", A, "2026-11-01T00:00:00.000Z"),
      row(3, "https://fcm.googleapis.com/fcm/send/b", B),
    ];
    const result = await sendCalendarPush(event);
    expect(result).toMatchObject({ attempted: 2, delivered: 2, failed: 0 });
    expect(store.sent.map((s) => s.endpoint).sort()).toEqual([
      "https://fcm.googleapis.com/fcm/send/b",
      "https://fcm.googleapis.com/fcm/send/new",
    ]);
  });

  it("sends nothing the second time the same reminder runs", async () => {
    store.rows = [row(1, "https://fcm.googleapis.com/fcm/send/a", A), row(2, "https://fcm.googleapis.com/fcm/send/b", B)];
    await sendCalendarPush(event);
    const second = await sendCalendarPush(event);
    expect(second).toMatchObject({ attempted: 0, delivered: 0, alreadyDelivered: 2 });
    expect(store.sent).toHaveLength(2);
  });

  it("retries only the device that failed", async () => {
    store.rows = [row(1, "https://fcm.googleapis.com/fcm/send/a", A), row(2, "https://fcm.googleapis.com/fcm/send/b", B)];
    store.failOnce.add("https://fcm.googleapis.com/fcm/send/b");

    const first = await sendCalendarPush(event);
    expect(first).toMatchObject({ delivered: 1, failed: 1 });

    const retry = await sendCalendarPush(event);
    expect(retry).toMatchObject({ attempted: 1, delivered: 1, failed: 0, alreadyDelivered: 1 });
    expect(store.sent.filter((s) => s.endpoint.endsWith("/a"))).toHaveLength(1);
    expect(store.sent.filter((s) => s.endpoint.endsWith("/b"))).toHaveLength(1);
  });

  it("removes a subscription the push service reports gone", async () => {
    store.rows = [row(1, "https://fcm.googleapis.com/fcm/send/gone", A)];
    store.gone.add("https://fcm.googleapis.com/fcm/send/gone");
    const result = await sendCalendarPush(event);
    expect(result).toMatchObject({ pruned: 1, failed: 0 });
    expect(store.removed).toEqual(["https://fcm.googleapis.com/fcm/send/gone"]);
  });

  it("sends every copy with the same push topic", async () => {
    store.rows = [row(1, "https://fcm.googleapis.com/fcm/send/a", A)];
    await sendCalendarPush(event);
    expect(store.sent[0].topic).toMatch(/^[A-Za-z0-9_-]{32}$/);
  });

  it("skips devices with calendar reminders off", async () => {
    store.rows = [{ ...row(1, "https://fcm.googleapis.com/fcm/send/a", A), calendarEnabled: false }];
    const result = await sendCalendarPush(event);
    expect(result.attempted).toBe(0);
    expect(store.sent).toHaveLength(0);
  });
});
