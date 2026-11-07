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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sends today's calendar reminders. Safe to run more than once: a finished event
 * is skipped, overlapping runs elect one sender per event, and a rerun after a
 * partial failure only reaches devices that have not received the reminder.
 */
export async function GET(request: NextRequest) {
  const unauthorized = requireBearerToken(request, process.env.CRON_SECRET);
  if (unauthorized) return unauthorized;

  try {
    const now = new Date();
    const runId = randomUUID();
    const dueEvents = eventsDueInNairobi(calendarNotificationEvents, now);
    const deliveries = [];

    for (const event of dueEvents) {
      if (await hasCalendarEventBeenDelivered(event.id)) {
        deliveries.push({ eventId: event.id, status: "already-sent" });
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
    }

    return NextResponse.json({
      ok: true,
      nairobiDate: nairobiDateKey(now),
      deliveries,
    });
  } catch (error) {
    console.error("Calendar reminder cron failed", error);
    return NextResponse.json({ message: "Calendar reminder run failed." }, { status: 500 });
  }
}
