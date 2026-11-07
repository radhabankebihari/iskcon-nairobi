import { NextRequest, NextResponse } from "next/server";
import {
  publicApiErrorResponse,
  readLimitedJson,
  validatePublicJsonRequest,
} from "@/lib/apiSecurity";
import {
  removePushSubscription,
} from "@/lib/pushSubscriptions";

export const runtime = "nodejs";
const maxRequestBytes = 4 * 1024;

const allowedPushHosts = [
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  "web.push.apple.com",
  "wns2-",
  "notify.windows.com",
];

function isValidPushEndpoint(endpoint: string) {
  if (endpoint.length > 500) return false;
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:") return false;
    return allowedPushHosts.some((host) =>
      host.endsWith("-")
        ? url.hostname.startsWith(host)
        : url.hostname === host || url.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const blocked = validatePublicJsonRequest(request, {
      key: "push-unsubscribe",
      limit: 10,
      windowMs: 10 * 60 * 1000,
      maxBytes: maxRequestBytes,
    });
    if (blocked) return blocked;

    const payload = await readLimitedJson<{ endpoint?: unknown }>(request, maxRequestBytes);
    const endpoint = typeof payload.endpoint === "string" ? payload.endpoint : "";

    if (!isValidPushEndpoint(endpoint)) {
      return NextResponse.json({ message: "Invalid endpoint." }, { status: 400 });
    }

    await removePushSubscription(endpoint);

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
