import { callAppsScript } from "@/lib/appsScriptBridge";

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
