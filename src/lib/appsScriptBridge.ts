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
  | "push.recordDelivery"
  | "push.deliveredDevices"
  | "push.recordReceipts"
  | "push.claimRun";

type BridgeResponse<T> = {
  success?: boolean;
  /** BACKEND_VERSION of the deployed website-backend.gs. Older scripts send none. */
  version?: number;
  data?: T;
  error?: string;
};

/**
 * Push actions need the one-row-per-device script (BACKEND_VERSION 2 in
 * scripts/google-sheets/website-backend.gs). An older script would append a
 * new row on every save, so push calls fail until the script is redeployed.
 */
export const BACKEND_VERSION_FOR_PUSH = 2;

export class OutdatedBackendError extends Error {
  constructor(found: number | undefined) {
    super(
      `The Apps Script backend is out of date (version ${found ?? "none"}, needs ${BACKEND_VERSION_FOR_PUSH}). ` +
        "Paste scripts/google-sheets/website-backend.gs into the Sheet's Apps Script and deploy a new version."
    );
    this.name = "OutdatedBackendError";
  }
}

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
  if (action.startsWith("push.") && !((result?.version ?? 0) >= BACKEND_VERSION_FOR_PUSH)) {
    // Checked before reading success: an old script may have already applied
    // the write, but the caller must still learn the deployment is stale.
    throw new OutdatedBackendError(result?.version);
  }
  if (result?.success !== true) {
    throw new Error(`Sheets bridge rejected ${action}: ${result?.error || "unknown error"}`);
  }

  return result.data as T;
}
