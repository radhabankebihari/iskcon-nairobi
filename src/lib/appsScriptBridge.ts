import { createHmac, randomBytes } from "node:crypto";

export type SheetAction =
  | "contact.submit"
  | "kirtan.register"
  | "kirtan.interest"
  | "analytics.record"
  | "push.list"
  | "push.count"
  | "push.upsert"
  | "push.remove"
  | "push.deliveryExists"
  | "push.recordDelivery";

type BridgeResponse<T> = {
  success?: boolean;
  data?: T;
  error?: string;
};

export async function callAppsScript<T>(action: SheetAction, data: unknown): Promise<T> {
  const rawUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;

  if (!rawUrl || !secret || secret.length < 32) {
    throw new Error("The client-owned Sheets bridge is not configured.");
  }

  const url = new URL(rawUrl);
  if (
    url.origin !== "https://script.google.com" ||
    !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) ||
    url.search
  ) {
    throw new Error("The Sheets bridge URL is invalid.");
  }

  const payload = JSON.stringify({
    timestamp: Date.now(),
    nonce: randomBytes(16).toString("hex"),
    action,
    data,
  });
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload, signature }),
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    throw new Error(`Sheets bridge returned HTTP ${response.status}.`);
  }

  const result = (await response.json()) as BridgeResponse<T>;
  if (result?.success !== true) {
    throw new Error(`Sheets bridge rejected ${action}: ${result?.error || "unknown error"}`);
  }

  return result.data as T;
}
