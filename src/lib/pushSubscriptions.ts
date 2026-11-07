import { callAppsScript } from "@/lib/appsScriptBridge";
import type { PushUpsertInput, StoredPushRow } from "@/lib/pushDevices";

export const PUSH_SHEET_NAME = "PushSubscriptions";

/**
 * Push subscriptions live in the client-owned spreadsheet behind the Apps
 * Script bridge. The script keeps one row per device (see push.upsert in
 * scripts/google-sheets/website-backend.gs) and runs every action under a
 * script lock, so concurrent writes cannot interleave.
 */
type BridgeRecord = {
  createdAt: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent: string;
  calendarEnabled: boolean;
  noticeboardEnabled: boolean;
  deviceId?: string;
};

export type PushSubscriptionRecord = BridgeRecord & { deviceId: string };

export async function listPushRows(): Promise<StoredPushRow[]> {
  const result = await callAppsScript<{ records: BridgeRecord[] }>("push.list", {});
  if (!Array.isArray(result?.records)) throw new Error("Invalid push subscription response.");

  return result.records
    .filter((record) =>
      typeof record?.endpoint === "string" &&
      record.endpoint.startsWith("https://") &&
      typeof record.keys?.p256dh === "string" &&
      typeof record.keys?.auth === "string"
    )
    .map((record, index) => ({
      rowNumber: index + 1,
      createdAt: typeof record.createdAt === "string" ? record.createdAt : "",
      endpoint: record.endpoint,
      p256dh: record.keys.p256dh,
      auth: record.keys.auth,
      userAgent: typeof record.userAgent === "string" ? record.userAgent : "",
      calendarEnabled: record.calendarEnabled === true,
      noticeboardEnabled: record.noticeboardEnabled === true,
      deviceId: typeof record.deviceId === "string" ? record.deviceId : "",
    }));
}

export async function listPushSubscriptions(): Promise<{ record: PushSubscriptionRecord }[]> {
  const rows = await listPushRows();
  return rows.map((row) => ({
    record: {
      createdAt: row.createdAt,
      endpoint: row.endpoint,
      keys: { p256dh: row.p256dh, auth: row.auth },
      userAgent: row.userAgent,
      calendarEnabled: row.calendarEnabled,
      noticeboardEnabled: row.noticeboardEnabled,
      deviceId: row.deviceId,
    },
  }));
}

/** Number of distinct devices subscribed. */
export async function countPushSubscriptions(): Promise<number> {
  const result = await callAppsScript<{ count: number }>("push.count", {});
  if (!Number.isSafeInteger(result?.count) || result.count < 0) {
    throw new Error("Invalid push subscription count.");
  }
  return result.count;
}

/**
 * Save a subscription so its device has exactly one row. The script merges any
 * row with the same endpoint, device ID, or previous endpoint, and carries
 * reminder choices over when the request does not send them. Returns true when
 * the device was not stored before.
 */
export async function upsertPushSubscription(input: PushUpsertInput): Promise<boolean> {
  const result = await callAppsScript<{ created: boolean }>("push.upsert", input);
  if (typeof result?.created !== "boolean") throw new Error("Invalid push subscription response.");
  return result.created;
}

/** Remove a device's subscription: its endpoint and any other row with its device ID. */
export async function removePushSubscription(endpoint: string, deviceId?: string): Promise<boolean> {
  const result = await callAppsScript<{ removed: boolean }>("push.remove", { endpoint, deviceId });
  if (typeof result?.removed !== "boolean") throw new Error("Invalid push removal response.");
  return result.removed;
}
