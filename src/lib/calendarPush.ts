import webpush from "web-push";
import type { CalendarNotificationEvent } from "@/lib/calendarNotifications";
import { listPushRows, removePushSubscription } from "@/lib/pushSubscriptions";
import { pushTopic, selectRecipients } from "@/lib/pushDevices";
import { listDeliveredDeviceKeys, recordDeviceReceipts } from "@/lib/calendarPushDelivery";

export type CalendarPushResult = {
  /** Devices sent to in this run. */
  attempted: number;
  delivered: number;
  failed: number;
  pruned: number;
  /** Devices skipped because an earlier run already reached them. */
  alreadyDelivered: number;
};

/** Receipts are written in batches, so a crash loses at most one batch. */
const RECEIPT_BATCH_SIZE = 25;

function configureWebPush() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    throw new Error("VAPID push credentials are not configured.");
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export async function sendCalendarPush(event: CalendarNotificationEvent): Promise<CalendarPushResult> {
  configureWebPush();

  const rows = (await listPushRows()).filter((row) => row.calendarEnabled);
  const delivered = await listDeliveredDeviceKeys(event.id);
  const { recipients, skipped } = selectRecipients(rows, delivered);

  const result: CalendarPushResult = {
    attempted: recipients.length,
    delivered: 0,
    failed: 0,
    pruned: 0,
    alreadyDelivered: skipped,
  };

  // The service worker uses `id` to recognise a repeat and `tag` so a repeat
  // replaces the shown notification instead of adding a second one.
  const payload = JSON.stringify({
    id: event.id,
    title: event.title,
    body: event.body,
    url: event.href,
    tag: event.id,
    icon: "/brand/icon-192.png",
    badge: "/brand/icon-192.png",
  });
  const options = {
    TTL: 60 * 60 * 24,
    urgency: "normal" as const,
    topic: pushTopic(event.id),
  };

  let pending: string[] = [];
  const flush = async () => {
    const batch = pending;
    pending = [];
    await recordDeviceReceipts(event.id, batch);
  };

  try {
    for (const { key, row } of recipients) {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          payload,
          options
        );
        result.delivered += 1;
        pending.push(key);
        if (pending.length >= RECEIPT_BATCH_SIZE) await flush();
      } catch (error) {
        const status =
          typeof error === "object" && error && "statusCode" in error
            ? Number(error.statusCode)
            : 0;

        if (status === 404 || status === 410) {
          // The subscription is gone for good; remove it so it is never retried.
          await removePushSubscription(row.endpoint);
          result.pruned += 1;
        } else {
          result.failed += 1;
        }
      }
    }
  } finally {
    // Record what was sent even if the loop stopped early.
    await flush();
  }

  return result;
}
