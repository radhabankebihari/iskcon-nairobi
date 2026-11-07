import { google } from "googleapis";
import { winningRun, type RunClaim } from "@/lib/pushDevices";

/**
 * Three tabs make calendar reminders idempotent:
 *
 * - PushDeliveryLog: one row per event once every device has it. A completed
 *   event is skipped outright.
 * - PushDeliveryReceipts: one row per event and device. A rerun after a partial
 *   failure only sends to devices without a receipt.
 * - PushRunClaims: one row per cron run and event. Only the first claim inside
 *   the claim window sends, so overlapping runs cannot both deliver.
 */
const DELIVERY_SHEET_NAME = "PushDeliveryLog";
const RECEIPT_SHEET_NAME = "PushDeliveryReceipts";
const CLAIM_SHEET_NAME = "PushRunClaims";

/** A run that has not finished within this window is treated as crashed. */
export const RUN_CLAIM_WINDOW_MS = 10 * 60 * 1000;

const sheetHeaders: Record<string, string[]> = {
  [DELIVERY_SHEET_NAME]: ["Event ID", "Sent At", "Attempted", "Delivered", "Failed", "Pruned"],
  [RECEIPT_SHEET_NAME]: ["Event ID", "Device Key", "Sent At"],
  [CLAIM_SHEET_NAME]: ["Event ID", "Run ID", "Claimed At"],
};

function getSpreadsheetId() {
  return process.env.PUSH_SUBSCRIPTIONS_SHEET_ID || process.env.CONTACT_SHEET_ID || "";
}

function getSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawPrivateKey) {
    throw new Error("Push delivery backend is not configured.");
  }

  const auth = new google.auth.JWT({
    email,
    key: rawPrivateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

const readySheets = new Set<string>();

async function ensureSheet(title: string) {
  const spreadsheetId = getSpreadsheetId();
  if (!spreadsheetId) throw new Error("Push delivery backend is not configured.");

  const sheets = getSheets();
  if (readySheets.has(title)) return { spreadsheetId, sheets };

  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties(title)",
  });
  const exists = metadata.data.sheets?.some((sheet) => sheet.properties?.title === title);

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] },
    });
    const header = sheetHeaders[title];
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${title}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [header] },
    });
  }

  readySheets.add(title);
  return { spreadsheetId, sheets };
}

/** True once an event has reached every device and is closed. */
export async function hasCalendarEventBeenDelivered(eventId: string) {
  const { spreadsheetId, sheets } = await ensureSheet(DELIVERY_SHEET_NAME);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${DELIVERY_SHEET_NAME}!A:A`,
  });

  return (response.data.values ?? []).some((row) => row[0] === eventId);
}

export async function recordCalendarDelivery(input: {
  eventId: string;
  attempted: number;
  delivered: number;
  failed: number;
  pruned: number;
}) {
  const { spreadsheetId, sheets } = await ensureSheet(DELIVERY_SHEET_NAME);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${DELIVERY_SHEET_NAME}!A:F`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[
        input.eventId,
        new Date().toISOString(),
        input.attempted,
        input.delivered,
        input.failed,
        input.pruned,
      ]],
    },
  });
}

/** Device keys that already received this event. */
export async function listDeliveredDeviceKeys(eventId: string): Promise<Set<string>> {
  const { spreadsheetId, sheets } = await ensureSheet(RECEIPT_SHEET_NAME);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${RECEIPT_SHEET_NAME}!A:B`,
  });

  return new Set(
    (response.data.values ?? [])
      .filter((row) => row[0] === eventId && typeof row[1] === "string" && row[1])
      .map((row) => row[1] as string)
  );
}

/** Record that these devices received the event. One write for the whole batch. */
export async function recordDeviceReceipts(eventId: string, deviceKeys: string[]) {
  if (deviceKeys.length === 0) return;

  const { spreadsheetId, sheets } = await ensureSheet(RECEIPT_SHEET_NAME);
  const sentAt = new Date().toISOString();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${RECEIPT_SHEET_NAME}!A:C`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: deviceKeys.map((key) => [eventId, key, sentAt]) },
  });
}

/**
 * Claim the right to send an event. Returns true for exactly one of any runs
 * that claim the same event inside the claim window.
 */
export async function claimEventRun(eventId: string, runId: string, now = new Date()) {
  const { spreadsheetId, sheets } = await ensureSheet(CLAIM_SHEET_NAME);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${CLAIM_SHEET_NAME}!A:C`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [[eventId, runId, now.toISOString()]] },
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${CLAIM_SHEET_NAME}!A:C`,
  });
  const claims: RunClaim[] = (response.data.values ?? []).map((row, order) => ({
    eventId: String(row[0] ?? ""),
    runId: String(row[1] ?? ""),
    claimedAt: String(row[2] ?? ""),
    order,
  }));

  return winningRun(claims, eventId, now, RUN_CLAIM_WINDOW_MS) === runId;
}
