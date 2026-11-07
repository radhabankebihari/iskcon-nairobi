import { describe, expect, it } from "vitest";
import { vaishnavaCalendar2026 } from "./vaishnavaCalendar2026";
import { vaishnavaCalendar2027 } from "./vaishnavaCalendar2027";

function entries(year: typeof vaishnavaCalendar2026, month: string) {
  return year.find((item) => item.month === month)?.events ?? [];
}

describe("printed Vaishnava calendars", () => {
  it("retains all months and prints corrected 2026 Ekadashi dates", () => {
    expect(vaishnavaCalendar2026).toHaveLength(12);
    expect(vaishnavaCalendar2027).toHaveLength(12);
    expect(entries(vaishnavaCalendar2026, "May").find((item) => item.event === "Padmini Ekadashi")?.date).toBe("May 26");
    expect(entries(vaishnavaCalendar2026, "June").find((item) => item.event.startsWith("Pandava Nirjala"))?.date).toBe("Jun 25");
    expect(entries(vaishnavaCalendar2026, "August").find((item) => item.event === "Pavitropana Ekadashi")?.date).toBe("Aug 23");
    expect(entries(vaishnavaCalendar2026, "December").find((item) => item.event === "Utpanna Ekadashi")?.date).toBe("Dec 4");
  });

  it("preserves the next-day parana in Claude's calendar field", () => {
    expect(entries(vaishnavaCalendar2026, "December").find((item) => item.event === "Utpanna Ekadashi")?.breakFast)
      .toBe("Sat 5 Dec, 6:17 to 10:21 A.M.");
    expect(entries(vaishnavaCalendar2027, "June").find((item) => item.event === "Yogini Ekadashi")?.breakFast)
      .toBe("Thu 1 Jul, 6:35 to 10:36 A.M.");
    for (const year of [vaishnavaCalendar2026, vaishnavaCalendar2027]) {
      const ekadashis = year.flatMap((month) => month.events).filter((item) => item.type === "Ekadashi");
      expect(ekadashis).toHaveLength(year === vaishnavaCalendar2026 ? 24 : 25);
      expect(ekadashis.every((item) => Boolean(item.breakFast))).toBe(true);
    }
  });

  it("includes image-only lunar markers and October's displaced final date", () => {
    expect(entries(vaishnavaCalendar2026, "November").find((item) => item.event === "Amavasya (new moon)")?.date).toBe("Nov 9");
    expect(entries(vaishnavaCalendar2027, "August").filter((item) => item.event === "Amavasya (new moon)").map((item) => item.date))
      .toEqual(["Aug 2", "Aug 31"]);
    expect(entries(vaishnavaCalendar2027, "October").find((item) => item.event.includes("Vasudeva Ghosh"))?.date).toBe("Oct 31");
  });
});
