import { NextRequest, NextResponse } from "next/server";
import {
  publicApiErrorResponse,
  rateLimit,
  readLimitedJson,
  rejectCrossOrigin,
  requireBearerToken,
  validatePublicJsonRequest,
} from "@/lib/apiSecurity";
import { asPlainText } from "@/lib/security";
import {
  countPushSubscriptions,
  upsertPushSubscription,
} from "@/lib/pushSubscriptions";
import { isValidDeviceId, isValidPushEndpoint } from "@/lib/pushDevices";

export const runtime = "nodejs";
const maxRequestBytes = 8 * 1024;

function isValidSubscriptionKey(value: string, maxLength: number) {
  return value.length > 0 && value.length <= maxLength && /^[A-Za-z0-9_-]+$/.test(value);
}

export async function POST(request: NextRequest) {
  try {
    const blocked = validatePublicJsonRequest(request, {
      key: "push-subscribe",
      limit: 10,
      windowMs: 10 * 60 * 1000,
      maxBytes: maxRequestBytes,
    });
    if (blocked) return blocked;

    const payload = await readLimitedJson<{
      subscription?: {
        endpoint?: unknown;
        keys?: { p256dh?: unknown; auth?: unknown };
      };
      userAgent?: unknown;
      deviceId?: unknown;
      previousEndpoint?: unknown;
      preferences?: {
        calendar?: unknown;
        noticeboard?: unknown;
      };
    }>(request, maxRequestBytes);

    const endpoint =
      typeof payload.subscription?.endpoint === "string"
        ? payload.subscription.endpoint
        : "";
    const p256dh =
      typeof payload.subscription?.keys?.p256dh === "string"
        ? payload.subscription.keys.p256dh
        : "";
    const auth =
      typeof payload.subscription?.keys?.auth === "string"
        ? payload.subscription.keys.auth
        : "";
    const userAgent = asPlainText(
      typeof payload.userAgent === "string" ? payload.userAgent : request.headers.get("user-agent") || "",
      200
    );
    const calendarEnabled =
      typeof payload.preferences?.calendar === "boolean"
        ? payload.preferences.calendar
        : undefined;
    const noticeboardEnabled =
      typeof payload.preferences?.noticeboard === "boolean"
        ? payload.preferences.noticeboard
        : undefined;

    if (
      !isValidPushEndpoint(endpoint) ||
      !isValidSubscriptionKey(p256dh, 120) ||
      !isValidSubscriptionKey(auth, 64)
    ) {
      return NextResponse.json({ message: "Invalid push subscription." }, { status: 400 });
    }

    // Both are optional so older clients keep working, but anything sent must be valid.
    if (payload.deviceId !== undefined && !isValidDeviceId(payload.deviceId)) {
      return NextResponse.json({ message: "Invalid device." }, { status: 400 });
    }
    if (
      payload.previousEndpoint !== undefined &&
      (!isValidPushEndpoint(payload.previousEndpoint) || payload.previousEndpoint === endpoint)
    ) {
      return NextResponse.json({ message: "Invalid previous subscription." }, { status: 400 });
    }
    const deviceId = isValidDeviceId(payload.deviceId) ? payload.deviceId : undefined;
    const previousEndpoint = isValidPushEndpoint(payload.previousEndpoint)
      ? payload.previousEndpoint
      : undefined;

    await upsertPushSubscription({
      endpoint,
      p256dh,
      auth,
      userAgent,
      deviceId,
      previousEndpoint,
      calendarEnabled,
      noticeboardEnabled,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const publicError = publicApiErrorResponse(error);
    if (publicError) return publicError;

    console.error("Push subscription failed", error);
    return NextResponse.json(
      { message: "Could not save the push subscription. Please try again shortly." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const blocked =
      rejectCrossOrigin(request) ||
      rateLimit(request, "push-count", { limit: 20, windowMs: 10 * 60 * 1000 }) ||
      requireBearerToken(request, process.env.PUSH_SUBSCRIBER_COUNT_TOKEN);
    if (blocked) return blocked;

    const count = await countPushSubscriptions();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Push subscription count failed", error);
    return NextResponse.json({ message: "Unavailable." }, { status: 500 });
  }
}
