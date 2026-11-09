import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(new URL("../../scripts/google-sheets/website-backend.gs", import.meta.url), "utf8");

function runScript<T>(expression: string, globals: Record<string, unknown> = {}): T {
  return runInNewContext(`${source}\n${expression}`, { Date, console, ...globals }) as T;
}

describe("website sheet retention", () => {
  it("uses 24 months for submissions and 12 for analytics only", () => {
    const periods = runScript<Record<string, number>>("RETENTION_MONTHS");

    expect(periods["Contact Us"]).toBe(24);
    expect(periods["Guest House Enquiries"]).toBe(24);
    expect(periods["Kirtan Safari Registrations"]).toBe(24);
    expect(periods["Kirtan Safari 2027 Interest"]).toBe(24);
    expect(periods.WebsiteAnalytics).toBe(12);
    expect(Object.keys(periods)).toHaveLength(5);
  });

  it("clamps month-end dates instead of rolling into the next month", () => {
    const cutoff = runScript<Date>(
      "retentionCutoffMonths(new Date('2024-03-31T09:30:00Z'), 1)",
    );

    expect(cutoff.toISOString()).toBe("2024-02-29T09:30:00.000Z");
  });

  it("deletes only dated expired rows, in descending groups", () => {
    const rows = [
      [new Date("2023-01-01T00:00:00Z")],
      [new Date("2023-02-01T00:00:00Z")],
      [new Date("2025-01-01T00:00:00Z")],
      [new Date("2022-01-01T00:00:00Z")],
      ["unparseable timestamp"],
    ];
    const deleteRows = vi.fn();
    const sheet = {
      getLastRow: () => rows.length + 1,
      getRange: () => ({ getValues: () => rows }),
      deleteRows,
    };

    const removed = runScript<number>(
      "purgeExpiredRows(sheet, new Date('2024-01-01T00:00:00Z'))",
      { sheet },
    );

    expect(removed).toBe(3);
    expect(deleteRows.mock.calls).toEqual([[5, 1], [2, 2]]);
  });

  it("replaces only its own scheduled trigger", () => {
    const existing = [
      { getHandlerFunction: () => "purgeExpiredWebsiteRecords" },
      { getHandlerFunction: () => "sendSubmissionNotifications" },
    ];
    const create = vi.fn();
    const atHour = vi.fn(() => ({ create }));
    const everyDays = vi.fn(() => ({ atHour }));
    const timeBased = vi.fn(() => ({ everyDays }));
    const deleteTrigger = vi.fn();
    const scriptApp = {
      getProjectTriggers: () => existing,
      deleteTrigger,
      newTrigger: vi.fn(() => ({ timeBased })),
    };

    runScript("installRetentionTrigger()", { ScriptApp: scriptApp });

    expect(deleteTrigger).toHaveBeenCalledOnce();
    expect(deleteTrigger).toHaveBeenCalledWith(existing[0]);
    expect(scriptApp.newTrigger).toHaveBeenCalledWith("purgeExpiredWebsiteRecords");
    expect(everyDays).toHaveBeenCalledWith(1);
    expect(atHour).toHaveBeenCalledWith(3);
    expect(create).toHaveBeenCalledOnce();
  });
});
