import { NextRequest, NextResponse } from "next/server";
import {
  publicApiErrorResponse,
  readLimitedJson,
  validatePublicJsonRequest,
} from "@/lib/apiSecurity";
import { asPlainText } from "@/lib/security";
import { callAppsScript } from "@/lib/appsScriptBridge";

export const runtime = "nodejs";

const maxRequestBytes = 8 * 1024;
const allowedEvents = new Set([
  "page_view",
  "app_installed",
  "install_prompt_accepted",
  "install_prompt_dismissed",
]);

type AnalyticsPayload = {
  event?: unknown;
  path?: unknown;
  website?: unknown;
};

function decodedHeaderText(request: NextRequest, name: string, maxLength: number) {
  const value = request.headers.get(name) || "";

  try {
    return asPlainText(decodeURIComponent(value), maxLength);
  } catch {
    return asPlainText(value, maxLength);
  }
}

// Local development and automated test runs share the production credentials in
// .env.local, so they must never append to the visitor analytics sheet.
function isAnalyticsWriteEnabled() {
  return process.env.NODE_ENV === "production" && process.env.ANALYTICS_DISABLED !== "true";
}

export async function POST(request: NextRequest) {
  if (!isAnalyticsWriteEnabled()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const blocked = validatePublicJsonRequest(request, {
      key: "analytics",
      limit: 120,
      windowMs: 10 * 60 * 1000,
      maxBytes: maxRequestBytes,
    });
    if (blocked) return blocked;

    const payload = await readLimitedJson<AnalyticsPayload>(request, maxRequestBytes);

    if (asPlainText(payload.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const event = asPlainText(payload.event, 40);
    const path = asPlainText(payload.path, 260);

    if (!allowedEvents.has(event) || !path.startsWith("/")) {
      return NextResponse.json({ message: "Invalid analytics event." }, { status: 400 });
    }

    await callAppsScript("analytics.record", {
      event,
      path,
      city: decodedHeaderText(request, "x-vercel-ip-city", 120),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const publicError = publicApiErrorResponse(error);
    if (publicError) return publicError;

    console.error("Analytics event failed", error);
    return NextResponse.json({ message: "Analytics unavailable." }, { status: 500 });
  }
}
