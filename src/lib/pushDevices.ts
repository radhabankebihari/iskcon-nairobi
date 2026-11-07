import { createHash } from "node:crypto";

/**
 * Device identity for web push.
 *
 * A browser's push endpoint changes when the browser renews the subscription,
 * and an old row can survive next to the new one. Each device therefore sends
 * a random device ID that it keeps in IndexedDB. The store keeps one row per
 * device, and every send is filtered by device, so one phone never receives
 * the same reminder twice.
 *
 * Everything here is pure so the rules can be tested without the store.
 */

export type StoredPushRow = {
  rowNumber: number;
  createdAt: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent: string;
  calendarEnabled: boolean;
  noticeboardEnabled: boolean;
  deviceId: string;
};

export type PushUpsertInput = {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent: string;
  deviceId?: string;
  previousEndpoint?: string;
  calendarEnabled?: boolean;
  noticeboardEnabled?: boolean;
};

export type PushUpsertPlan = {
  /** Row to overwrite, or null to append a new row. */
  targetRow: number | null;
  /** Other rows for the same device, to delete. Highest first, so indexes stay valid. */
  deleteRows: number[];
  values: {
    endpoint: string;
    p256dh: string;
    auth: string;
    userAgent: string;
    calendarEnabled: boolean;
    noticeboardEnabled: boolean;
    deviceId: string;
  };
};

const DEVICE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isValidDeviceId(value: unknown): value is string {
  return typeof value === "string" && DEVICE_ID_PATTERN.test(value);
}

const allowedPushHosts = [
  "fcm.googleapis.com",
  "updates.push.services.mozilla.com",
  "web.push.apple.com",
  "wns2-",
  "notify.windows.com",
];

/** Only real browser push services are accepted, so the server never posts to arbitrary URLs. */
export function isValidPushEndpoint(endpoint: unknown): endpoint is string {
  if (typeof endpoint !== "string" || endpoint.length > 500) return false;

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

/** The key used to recognise one device: its device ID, or its endpoint for older rows. */
export function deviceKey(row: { deviceId?: string; endpoint: string }) {
  if (row.deviceId && isValidDeviceId(row.deviceId)) return `device:${row.deviceId}`;
  return `endpoint:${createHash("sha256").update(row.endpoint).digest("hex").slice(0, 32)}`;
}

/**
 * Decide how to store a subscription so the device ends up with exactly one row.
 *
 * Rows belong to this device when they share the device ID, the endpoint, or the
 * endpoint the device had before the browser renewed it. Preferences sent in the
 * request win; otherwise they carry over from the device's existing row, so a
 * renewal never switches reminders off.
 */
export function planPushUpsert(rows: StoredPushRow[], input: PushUpsertInput): PushUpsertPlan {
  const sameEndpoint = rows.filter((row) => row.endpoint === input.endpoint);
  const sameDevice = input.deviceId ? rows.filter((row) => row.deviceId === input.deviceId) : [];
  const previous = input.previousEndpoint
    ? rows.filter((row) => row.endpoint === input.previousEndpoint)
    : [];

  const owned = new Map<number, StoredPushRow>();
  for (const row of [...sameEndpoint, ...sameDevice, ...previous]) owned.set(row.rowNumber, row);
  const ownedRows = [...owned.values()].sort((a, b) => a.rowNumber - b.rowNumber);

  // Preferences come from the closest match: this endpoint, then the renewed one, then the device.
  const inherited = sameEndpoint[0] ?? previous[0] ?? newestRow(sameDevice);
  // An existing row may already carry the device ID for this endpoint.
  const deviceId = input.deviceId ?? sameEndpoint.find((row) => row.deviceId)?.deviceId ?? "";

  const targetRow = ownedRows[0]?.rowNumber ?? null;
  const deleteRows = ownedRows
    .slice(1)
    .map((row) => row.rowNumber)
    .sort((a, b) => b - a);

  return {
    targetRow,
    deleteRows,
    values: {
      endpoint: input.endpoint,
      p256dh: input.p256dh,
      auth: input.auth,
      userAgent: input.userAgent,
      calendarEnabled: input.calendarEnabled ?? inherited?.calendarEnabled ?? false,
      noticeboardEnabled: input.noticeboardEnabled ?? inherited?.noticeboardEnabled ?? false,
      deviceId,
    },
  };
}

/** Rows to delete when a device turns push off: its endpoint and anything else it owns. */
export function rowsToRemove(rows: StoredPushRow[], endpoint: string, deviceId?: string) {
  return rows
    .filter((row) => row.endpoint === endpoint || (deviceId && row.deviceId === deviceId))
    .map((row) => row.rowNumber)
    .sort((a, b) => b - a);
}

function newestRow(rows: StoredPushRow[]) {
  return [...rows].sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt) || b.rowNumber - a.rowNumber)[0];
}

function timestamp(value: string) {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Choose who receives one reminder: one subscription per device (the most
 * recently saved), skipping devices that already have it.
 */
export function selectRecipients<T extends StoredPushRow>(rows: T[], alreadyDelivered: Set<string>) {
  const byDevice = new Map<string, T>();
  for (const row of rows) {
    const key = deviceKey(row);
    const current = byDevice.get(key);
    if (
      !current ||
      timestamp(row.createdAt) > timestamp(current.createdAt) ||
      (timestamp(row.createdAt) === timestamp(current.createdAt) && row.rowNumber > current.rowNumber)
    ) {
      byDevice.set(key, row);
    }
  }

  const recipients: { key: string; row: T }[] = [];
  let skipped = 0;
  for (const [key, row] of byDevice) {
    if (alreadyDelivered.has(key)) skipped += 1;
    else recipients.push({ key, row });
  }

  return { recipients, skipped, duplicateRows: rows.length - byDevice.size };
}

export type RunClaim = { eventId: string; runId: string; claimedAt: string; order: number };

/**
 * Two cron runs can start at once. Each appends a claim row and reads the claims
 * back; appends are applied in order, so every run sees the same first claim and
 * exactly one run goes ahead. Claims older than the window are ignored so a
 * crashed run cannot block the event for good.
 */
export function winningRun(claims: RunClaim[], eventId: string, now: Date, windowMs: number) {
  const fresh = claims
    .filter((claim) => claim.eventId === eventId)
    .filter((claim) => {
      const at = timestamp(claim.claimedAt);
      return at > 0 && now.getTime() - at < windowMs;
    })
    .sort((a, b) => a.order - b.order);
  return fresh[0]?.runId ?? null;
}

/**
 * Web Push "Topic" header value. When a phone is offline, the push service keeps
 * only the newest message with the same topic, so a resend can never queue a
 * second copy. It must be at most 32 URL-safe base64 characters.
 */
export function pushTopic(eventId: string) {
  return createHash("sha256").update(eventId).digest("base64url").slice(0, 32);
}
