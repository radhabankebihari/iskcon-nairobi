import { google } from "googleapis";
import { asSheetText } from "@/lib/security";
import {
  planPushUpsert,
  rowsToRemove,
  type PushUpsertInput,
  type StoredPushRow,
} from "@/lib/pushDevices";

export const PUSH_SHEET_NAME = "PushSubscriptions";

/**
 * Columns: A created/updated at, B endpoint, C p256dh, D auth, E user agent,
 * F calendar on, G noticeboard on, H device ID. Column H was added for device
 * identity; rows written before it simply have no device ID.
 */
const PUSH_RANGE = `${PUSH_SHEET_NAME}!A:H`;

export type PushSubscriptionRecord = {
  createdAt: string;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  userAgent: string;
  calendarEnabled: boolean;
  noticeboardEnabled: boolean;
  deviceId: string;
};

type PushSheetRef = {
  spreadsheetId: string;
  sheetId: number;
};

function getAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !rawPrivateKey) {
    throw new Error("Push subscription backend is not configured.");
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: rawPrivateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSpreadsheetId() {
  return (
    process.env.PUSH_SUBSCRIPTIONS_SHEET_ID ||
    process.env.CONTACT_SHEET_ID ||
    ""
  );
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

// Row numbers shift when a row is deleted, so changes from this server instance
// run one at a time. Duplicate rows that slip through from separate instances
// are merged on the device's next sync, and sends are filtered per device anyway.
let mutationQueue: Promise<unknown> = Promise.resolve();
function serially<T>(task: () => Promise<T>): Promise<T> {
  const run = mutationQueue.then(task, task);
  mutationQueue = run.catch(() => undefined);
  return run;
}

export async function ensurePushSheet(): Promise<PushSheetRef> {
  const spreadsheetId = getSpreadsheetId();

  if (!spreadsheetId) {
    throw new Error("Push subscription backend is not configured.");
  }

  const sheets = getSheets();

  const metadata = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties(sheetId,title)",
  });

  const existing = metadata.data.sheets?.find(
    (sheet) => sheet.properties?.title === PUSH_SHEET_NAME
  );

  if (existing?.properties?.sheetId != null) {
    return { spreadsheetId, sheetId: existing.properties.sheetId };
  }

  const added = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: { title: PUSH_SHEET_NAME },
          },
        },
      ],
    },
  });

  return {
    spreadsheetId,
    sheetId: added.data.replies?.[0]?.addSheet?.properties?.sheetId ?? 0,
  };
}

function isTrue(value: unknown) {
  return value === true || value === "TRUE";
}

async function readPushRows(spreadsheetId: string): Promise<StoredPushRow[]> {
  const response = await getSheets().spreadsheets.values.get({
    spreadsheetId,
    range: PUSH_RANGE,
  });

  const rows: StoredPushRow[] = [];
  (response.data.values ?? []).forEach((row, index) => {
    const [createdAt, endpoint, p256dh, auth, userAgent, calendarEnabled, noticeboardEnabled, deviceId] = row;

    if (
      typeof endpoint === "string" &&
      endpoint.startsWith("https://") &&
      typeof p256dh === "string" &&
      p256dh.length > 0 &&
      typeof auth === "string" &&
      auth.length > 0
    ) {
      rows.push({
        rowNumber: index + 1,
        createdAt: typeof createdAt === "string" ? createdAt : "",
        endpoint,
        p256dh,
        auth,
        userAgent: typeof userAgent === "string" ? userAgent : "",
        calendarEnabled: isTrue(calendarEnabled),
        noticeboardEnabled: isTrue(noticeboardEnabled),
        deviceId: typeof deviceId === "string" ? deviceId : "",
      });
    }
  });

  return rows;
}

function toRecord(row: StoredPushRow): PushSubscriptionRecord {
  return {
    createdAt: row.createdAt,
    endpoint: row.endpoint,
    keys: { p256dh: row.p256dh, auth: row.auth },
    userAgent: row.userAgent,
    calendarEnabled: row.calendarEnabled,
    noticeboardEnabled: row.noticeboardEnabled,
    deviceId: row.deviceId,
  };
}

export async function listPushRows(): Promise<StoredPushRow[]> {
  const { spreadsheetId } = await ensurePushSheet();
  return readPushRows(spreadsheetId);
}

export async function listPushSubscriptions(): Promise<
  { record: PushSubscriptionRecord; rowNumber: number }[]
> {
  const rows = await listPushRows();
  return rows.map((row) => ({ record: toRecord(row), rowNumber: row.rowNumber }));
}

/** Number of distinct devices subscribed. */
export async function countPushSubscriptions(): Promise<number> {
  const rows = await listPushRows();
  return new Set(rows.map((row) => row.deviceId || row.endpoint)).size;
}

async function deleteRows(ref: PushSheetRef, rowNumbers: number[]) {
  if (rowNumbers.length === 0) return;

  // Highest first, so each deletion leaves the remaining row numbers valid.
  const descending = [...new Set(rowNumbers)].sort((a, b) => b - a);
  await getSheets().spreadsheets.batchUpdate({
    spreadsheetId: ref.spreadsheetId,
    requestBody: {
      requests: descending.map((rowNumber) => ({
        deleteDimension: {
          range: {
            sheetId: ref.sheetId,
            dimension: "ROWS",
            startIndex: rowNumber - 1,
            endIndex: rowNumber,
          },
        },
      })),
    },
  });
}

/**
 * Save a subscription so its device has exactly one row. Returns true when the
 * device was not stored before.
 */
export function upsertPushSubscription(input: PushUpsertInput): Promise<boolean> {
  return serially(async () => {
    const ref = await ensurePushSheet();
    const rows = await readPushRows(ref.spreadsheetId);
    const plan = planPushUpsert(rows, input);
    const sheets = getSheets();

    const values = [
      new Date().toISOString(),
      plan.values.endpoint,
      plan.values.p256dh,
      plan.values.auth,
      asSheetText(plan.values.userAgent),
      plan.values.calendarEnabled,
      plan.values.noticeboardEnabled,
      plan.values.deviceId,
    ];

    if (plan.targetRow !== null) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: ref.spreadsheetId,
        range: `${PUSH_SHEET_NAME}!A${plan.targetRow}:H${plan.targetRow}`,
        valueInputOption: "RAW",
        requestBody: { values: [values] },
      });
      // Every row to delete sits below the target row, so the target is unaffected.
      await deleteRows(ref, plan.deleteRows);
      return false;
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: ref.spreadsheetId,
      range: PUSH_RANGE,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [values] },
    });
    return true;
  });
}

/** Remove a device's subscription: its endpoint and any other row with its device ID. */
export function removePushSubscription(endpoint: string, deviceId?: string): Promise<boolean> {
  return serially(async () => {
    const ref = await ensurePushSheet();
    const rows = await readPushRows(ref.spreadsheetId);
    const doomed = rowsToRemove(rows, endpoint, deviceId);
    await deleteRows(ref, doomed);
    return doomed.length > 0;
  });
}
