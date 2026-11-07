import { callAppsScript } from "@/lib/appsScriptBridge";

/**
 * Calendar reminder delivery records, kept in the client-owned spreadsheet:
 *
 * - PushDeliveryLog: one row per event once every device has it. A completed
 *   event is skipped outright.
 * - PushDeliveryReceipts: one row per event and device. A rerun after a partial
 *   failure only sends to devices without a receipt.
 * - PushRunClaims: one row per run that claimed an event. The script grants the
 *   claim under its lock, so overlapping cron runs cannot both deliver.
 */

/** A run that has not finished within this window is treated as crashed. */
export const RUN_CLAIM_WINDOW_MS = 10 * 60 * 1000;

/** True once an event has reached every device and is closed. */
export async function hasCalendarEventBeenDelivered(eventId: string) {
  const result = await callAppsScript<{ exists: boolean }>("push.deliveryExists", { eventId });
  if (typeof result?.exists !== "boolean") throw new Error("Invalid delivery status response.");
  return result.exists;
}

export async function recordCalendarDelivery(input: {
  eventId: string;
  attempted: number;
  delivered: number;
  failed: number;
  pruned: number;
}) {
  const result = await callAppsScript<{ recorded: boolean }>("push.recordDelivery", input);
  if (result?.recorded !== true) throw new Error("Delivery record was not saved.");
}

/** Device keys that already received this event. */
export async function listDeliveredDeviceKeys(eventId: string): Promise<Set<string>> {
  const result = await callAppsScript<{ keys: string[] }>("push.deliveredDevices", { eventId });
  if (!Array.isArray(result?.keys)) throw new Error("Invalid delivery receipts response.");
  return new Set(result.keys.filter((key) => typeof key === "string" && key));
}

/** Record that these devices received the event. One call for the whole batch. */
export async function recordDeviceReceipts(eventId: string, deviceKeys: string[]) {
  if (deviceKeys.length === 0) return;
  const result = await callAppsScript<{ recorded: number }>("push.recordReceipts", { eventId, keys: deviceKeys });
  if (result?.recorded !== deviceKeys.length) throw new Error("Delivery receipts were not saved.");
}

/**
 * Claim the right to send an event. Returns true for exactly one of any runs
 * that claim the same event inside the claim window.
 */
export async function claimEventRun(eventId: string, runId: string) {
  const result = await callAppsScript<{ claimed: boolean }>("push.claimRun", {
    eventId,
    runId,
    windowMs: RUN_CLAIM_WINDOW_MS,
  });
  if (typeof result?.claimed !== "boolean") throw new Error("Invalid run claim response.");
  return result.claimed;
}
