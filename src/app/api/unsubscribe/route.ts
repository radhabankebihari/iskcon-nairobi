import { NextRequest, NextResponse } from "next/server";
import {
  publicApiErrorResponse,
  readLimitedJson,
  validatePublicJsonRequest,
} from "@/lib/apiSecurity";
import {
  removePushSubscription,
} from "@/lib/pushSubscriptions";
import { isValidDeviceId, isValidPushEndpoint } from "@/lib/pushDevices";

export const runtime = "nodejs";
const maxRequestBytes = 4 * 1024;

export async function POST(request: NextRequest) {
  try {
    const blocked = validatePublicJsonRequest(request, {
      key: "push-unsubscribe",
      limit: 10,
      windowMs: 10 * 60 * 1000,
      maxBytes: maxRequestBytes,
    });
    if (blocked) return blocked;

    const payload = await readLimitedJson<{ endpoint?: unknown; deviceId?: unknown }>(
      request,
      maxRequestBytes
    );
    const endpoint = payload.endpoint;

    if (!isValidPushEndpoint(endpoint)) {
      return NextResponse.json({ message: "Invalid endpoint." }, { status: 400 });
    }
    if (payload.deviceId !== undefined && !isValidDeviceId(payload.deviceId)) {
      return NextResponse.json({ message: "Invalid device." }, { status: 400 });
    }

    // With a device ID, any other row this device left behind goes too.
    await removePushSubscription(endpoint, isValidDeviceId(payload.deviceId) ? payload.deviceId : undefined);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const publicError = publicApiErrorResponse(error);
    if (publicError) return publicError;

    console.error("Push unsubscribe failed", error);
    return NextResponse.json(
      { message: "Could not remove the push subscription." },
      { status: 500 }
    );
  }
}
