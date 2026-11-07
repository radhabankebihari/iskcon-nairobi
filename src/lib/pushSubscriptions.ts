import { createHash } from "node:crypto";
import { callAppsScript } from "@/lib/appsScriptBridge";

export const PUSH_SHEET_NAME = "PushSubscriptions";
const pushEndpointLocks = new Set<string>();

export type PushSubscriptionRecord = {
  createdAt: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent: string;
  calendarEnabled: boolean;
  noticeboardEnabled: boolean;
};

export async function listPushSubscriptions(): Promise<{ record: PushSubscriptionRecord }[]> {
  const result = await callAppsScript<{ records: PushSubscriptionRecord[] }>("push.list", {});
  if (!Array.isArray(result?.records)) throw new Error("Invalid push subscription response.");

  return result.records
    .filter((record) =>
      typeof record?.endpoint === "string" &&
      record.endpoint.startsWith("https://") &&
      typeof record.keys?.p256dh === "string" &&
      typeof record.keys?.auth === "string"
    )
    .map((record) => ({ record }));
}

export async function countPushSubscriptions(): Promise<number> {
  const result = await callAppsScript<{ count: number }>("push.count", {});
  if (!Number.isSafeInteger(result?.count) || result.count < 0) {
    throw new Error("Invalid push subscription count.");
  }
  return result.count;
}

export async function upsertPushSubscription(input: {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent: string;
  calendarEnabled?: boolean;
  noticeboardEnabled?: boolean;
}): Promise<boolean> {
  const lockKey = createHash("sha256").update(input.endpoint).digest("hex");
  if (pushEndpointLocks.has(lockKey)) return false;

  pushEndpointLocks.add(lockKey);
  try {
    const result = await callAppsScript<{ created: boolean }>("push.upsert", input);
    if (typeof result?.created !== "boolean") throw new Error("Invalid push subscription response.");
    return result.created;
  } finally {
    pushEndpointLocks.delete(lockKey);
  }
}

export async function removePushSubscription(endpoint: string): Promise<boolean> {
  const result = await callAppsScript<{ removed: boolean }>("push.remove", { endpoint });
  if (typeof result?.removed !== "boolean") throw new Error("Invalid push removal response.");
  return result.removed;
}
