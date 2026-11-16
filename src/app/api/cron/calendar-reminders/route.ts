import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { calendarNotificationEvents } from "@/lib/calendarNotifications";
import {
  claimEventRun,
  hasCalendarEventBeenDelivered,
  recordCalendarDelivery,
} from "@/lib/calendarPushDelivery";
import { eventsDueInNairobi, nairobiDateKey } from "@/lib/calendarPushSchedule";
import { sendCalendarPush } from "@/lib/calendarPush";
import { requireBearerToken } from "@/lib/apiSecurity";
import { listPushRows } from "@/lib/pushSubscriptions";
import { checkPushKeys, recordCronRun } from "@/lib/cronRunLog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Delivery = { eventId: string; status: string; error?: string } & Record<string, unknown>;

function errorText(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Sends today's calendar reminders. Safe to run more than once: a finished event
 * is skipped, overlapping runs elect one sender per event, and a rerun after a
 * partial failure only reaches devices that have not received the reminder.
 *
 * Every run, including days with nothing due, checks the push keys and writes
 * one row to the Sheet's "Cron Runs" tab, because hosting logs are short-lived.
 */
export async function GET(request: NextRequest) {
  const unauthorized = requireBearerToken(request, process.env.CRON_SECRET);
  if (unauthorized) return unauthorized;

  const now = new Date();
  const nairobiDate = nairobiDateKey(now);
  const keys = checkPushKeys();
  const dueEvents = eventsDueInNairobi(calendarNotificationEvents, now);
  const due = dueEvents.map((event) => event.id).join(", ") || "none";
  const deliveries: Delivery[] = [];
  let devices = 0;

  try {
    devices = (await listPushRows()).filter((row) => row.calendarEnabled).length;
    const runId = randomUUID();

    for (const event of dueEvents) {
      try {
        if (await hasCalendarEventBeenDelivered(event.id)) {
          deliveries.push({ eventId: event.id, status: "already-sent" });
          continue;
        }
        // Without working keys every send would fail; say why instead of trying.
        if (!keys.ok) {
          deliveries.push({ eventId: event.id, status: "not-sent", error: keys.message });
          continue;
        }
        if (!(await claimEventRun(event.id, runId))) {
          deliveries.push({ eventId: event.id, status: "another-run-in-progress" });
          continue;
        }

        const result = await sendCalendarPush(event);
        if (result.failed === 0) {
          await recordCalendarDelivery({
            eventId: event.id,
            attempted: result.attempted + result.alreadyDelivered,
            delivered: result.delivered + result.alreadyDelivered,
            failed: 0,
            pruned: result.pruned,
          });
        }
        deliveries.push({
          eventId: event.id,
          status: result.failed === 0 ? "sent" : "partial-failure",
          ...result,
        });
      } catch (error) {
        // One event's failure must not stop the others or hide the reason.
        deliveries.push({ eventId: event.id, status: "error", error: errorText(error) });
      }
    }
  } catch (error) {
    console.error("Calendar reminder cron failed", error);
    await recordCronRun({ nairobiDate, result: "error", pushKeys: keys.message, devices, due, details: errorText(error) });
    return NextResponse.json({ message: "Calendar reminder run failed." }, { status: 500 });
  }

  const failed = deliveries.some((d) => ["error", "not-sent", "partial-failure"].includes(d.status));
  const sent = deliveries.some((d) => d.status === "sent");
  await recordCronRun({
    nairobiDate,
    result: failed ? (sent ? "partial-failure" : "error") : sent ? "sent" : "ok",
    pushKeys: keys.message,
    devices,
    due,
    details: deliveries
      .map((d) => {
        const counts = typeof d.delivered === "number" ? ` ${d.delivered}/${d.attempted} delivered` : "";
        return `${d.eventId}: ${d.status}${counts}${d.error ? ` (${d.error})` : ""}`;
      })
      .join("; "),
  });

  if (!keys.ok) console.error(`Push keys problem: ${keys.message}`);
  return NextResponse.json({ ok: !failed && keys.ok, nairobiDate, pushKeys: keys.message, devices, deliveries });
}
