import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";

/**
 * Runs scripts/google-sheets/website-backend.gs against an in-memory sheet, so
 * the script's push rules are tested exactly as deployed.
 */
type Row = unknown[];

function loadBackend() {
  const sheets = new Map<string, Row[]>();

  const makeSheet = (name: string) => {
    const rows = sheets.get(name)!;
    const display = (value: unknown) => (typeof value === "boolean" ? (value ? "TRUE" : "FALSE") : String(value ?? ""));
    return {
      getLastRow: () => rows.length,
      setFrozenRows: () => undefined,
      appendRow: (values: Row) => rows.push([...values]),
      deleteRow: (rowNumber: number) => rows.splice(rowNumber - 1, 1),
      getDataRange: () => ({ getDisplayValues: () => rows.map((row) => row.map(display)) }),
      getRange: (a: number | string, column?: number, numRows?: number) => {
        if (typeof a === "string") return { getDisplayValues: () => rows.map((row) => [display(row[0])]) };
        return {
          setValues: (values: Row[]) => {
            values.forEach((value, i) => {
              const index = a - 1 + i;
              while (rows.length <= index) rows.push([]);
              const current = rows[index];
              value.forEach((cell, j) => (current[(column ?? 1) - 1 + j] = cell));
            });
            void numRows;
          },
        };
      },
    };
  };

  const context = {
    console,
    Date,
    JSON,
    Math,
    Number,
    Object,
    Array,
    Boolean,
    String,
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key: string) => (key === "SPREADSHEET_ID" ? "test-sheet" : null) }) },
    SpreadsheetApp: {
      openById: () => ({
        getSheetByName: (name: string) => (sheets.has(name) ? makeSheet(name) : null),
        insertSheet: (name: string) => {
          sheets.set(name, []);
          return makeSheet(name);
        },
      }),
    },
  } as Record<string, unknown>;

  const source = fs.readFileSync(path.join(process.cwd(), "scripts/google-sheets/website-backend.gs"), "utf8");
  vm.createContext(context);
  vm.runInContext(source, context);
  const perform = context.performAction as (action: string, data: unknown) => Record<string, unknown>;
  const subscriptionRows = () => (sheets.get("PushSubscriptions") ?? []).slice(1);
  return { perform, subscriptionRows, version: vm.runInContext("BACKEND_VERSION", context) as number };
}

const DEVICE = "3f2b8c1e-9d4a-4b7e-8f12-6a5c3d2e1b0f";
const OTHER_DEVICE = "a1b2c3d4-e5f6-4a7b-9c8d-0e1f2a3b4c5d";
const ENDPOINT = "https://fcm.googleapis.com/fcm/send/device-one";
const RENEWED = "https://fcm.googleapis.com/fcm/send/device-one-renewed";
const keys = { p256dh: "BKeyForTesting123", auth: "AuthKey123", userAgent: "test" };

describe("website-backend.gs push storage", () => {
  it("reports the version the website requires for push actions", () => {
    expect(loadBackend().version).toBeGreaterThanOrEqual(2);
  });

  it("keeps one row when the noticeboard and calendar toggles save in turn", () => {
    const { perform, subscriptionRows } = loadBackend();
    expect(perform("push.upsert", { endpoint: ENDPOINT, ...keys, deviceId: DEVICE, calendarEnabled: false, noticeboardEnabled: true })).toEqual({ created: true });
    expect(perform("push.upsert", { endpoint: ENDPOINT, ...keys, deviceId: DEVICE, calendarEnabled: true, noticeboardEnabled: true })).toEqual({ created: false });

    const rows = subscriptionRows();
    expect(rows).toHaveLength(1);
    expect(rows[0][5]).toBe(true);
    expect(rows[0][6]).toBe(true);
    expect(rows[0][7]).toBe(DEVICE);
  });

  it("replaces the row when the browser renews the subscription", () => {
    const { perform, subscriptionRows } = loadBackend();
    perform("push.upsert", { endpoint: ENDPOINT, ...keys, deviceId: DEVICE, calendarEnabled: true, noticeboardEnabled: false });
    perform("push.upsert", { endpoint: RENEWED, ...keys, deviceId: DEVICE, previousEndpoint: ENDPOINT });

    const rows = subscriptionRows();
    expect(rows).toHaveLength(1);
    expect(rows[0][1]).toBe(RENEWED);
    expect(rows[0][5]).toBe(true);
  });

  it("merges duplicate rows a device left behind", () => {
    const { perform, subscriptionRows } = loadBackend();
    // As an older, appending script would have left them.
    perform("push.upsert", { endpoint: ENDPOINT, ...keys, deviceId: DEVICE, calendarEnabled: true });
    perform("push.upsert", { endpoint: "https://fcm.googleapis.com/fcm/send/old", ...keys, deviceId: OTHER_DEVICE, calendarEnabled: true });
    perform("push.upsert", { endpoint: RENEWED, ...keys, deviceId: DEVICE, previousEndpoint: ENDPOINT, noticeboardEnabled: true });

    const rows = subscriptionRows();
    expect(rows.map((row) => row[7]).sort()).toEqual([DEVICE, OTHER_DEVICE].sort());
  });

  it("removes every row of a device when it turns notifications off", () => {
    const { perform, subscriptionRows } = loadBackend();
    perform("push.upsert", { endpoint: ENDPOINT, ...keys, deviceId: DEVICE, calendarEnabled: true });
    perform("push.upsert", { endpoint: "https://fcm.googleapis.com/fcm/send/second", ...keys, deviceId: OTHER_DEVICE, calendarEnabled: true });

    expect(perform("push.remove", { endpoint: ENDPOINT, deviceId: DEVICE })).toEqual({ removed: true });
    expect(subscriptionRows().map((row) => row[7])).toEqual([OTHER_DEVICE]);
  });

  it("counts devices, not rows", () => {
    const { perform } = loadBackend();
    perform("push.upsert", { endpoint: ENDPOINT, ...keys, deviceId: DEVICE });
    perform("push.upsert", { endpoint: "https://fcm.googleapis.com/fcm/send/second", ...keys, deviceId: OTHER_DEVICE });
    expect(perform("push.count", {})).toEqual({ count: 2 });
  });

  it("grants a reminder run to one claimant at a time", () => {
    const { perform } = loadBackend();
    expect(perform("push.claimRun", { eventId: "2026-11-10-govardhana", runId: "run-a" })).toEqual({ claimed: true });
    expect(perform("push.claimRun", { eventId: "2026-11-10-govardhana", runId: "run-b" })).toEqual({ claimed: false });
  });
});
