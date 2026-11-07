import { describe, expect, it } from "vitest";
import { getNextObservance, getUpcomingCalendarDates } from "./calendarDates";

describe("getUpcomingCalendarDates", () => {
  it("returns only future dates, soonest first", () => {
    const now = new Date("2026-11-04T09:00:00+03:00");
    const dates = getUpcomingCalendarDates(now);

    expect(dates.length).toBeGreaterThan(0);
    expect(dates.every((item) => item.endsAt >= now.getTime())).toBe(true);
    expect([...dates].sort((a, b) => a.endsAt - b.endsAt)).toEqual(dates);
  });

  it("keeps a date listed until that day ends in Nairobi", () => {
    const first = getUpcomingCalendarDates(new Date("2026-01-01T00:00:00+03:00"), 1)[0];

    const lateThatDay = new Date(`${first.isoDate}T23:00:00+03:00`);
    expect(getUpcomingCalendarDates(lateThatDay, 1)[0].isoDate).toBe(first.isoDate);

    const nextMorning = new Date(first.endsAt + 60_000);
    expect(getUpcomingCalendarDates(nextMorning, 1)[0].isoDate).not.toBe(first.isoDate);
  });

  it("applies the limit", () => {
    expect(getUpcomingCalendarDates(new Date("2026-01-01T00:00:00+03:00"), 4)).toHaveLength(4);
  });

  it("carries on into the next printed calendar year", () => {
    const first2027 = getUpcomingCalendarDates(new Date("2027-01-01T00:00:00+03:00"), 1)[0];
    expect(first2027.isoDate).toBe("2027-01-03");
    expect(first2027.event).toBe("Saphala Ekadashi");
    expect(first2027.breakFast).toBe("Mon 4 Jan, 6:31 to 10:35 A.M.");
  });

  it("leaves Kenyan public holidays out of upcoming observances", () => {
    const dates = getUpcomingCalendarDates(new Date("2027-01-01T00:00:00+03:00"));
    expect(dates.some((item) => item.type === "Holiday")).toBe(false);
  });

  it("finds the next date of a named festival", () => {
    const next = getNextObservance(new Date("2026-11-07T09:00:00+03:00"), /^Janmashtami/);
    expect(next?.isoDate).toBe("2027-08-25");
    expect(next?.fast).toBe("Fast till midnight");
  });

  it("lists every 2027 date on the right weekday", () => {
    const dates = getUpcomingCalendarDates(new Date("2027-01-01T00:00:00+03:00"));
    for (const item of dates.filter((d) => d.year === 2027)) {
      const weekday = new Date(`${item.isoDate}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" });
      expect(item.day).toBe(weekday);
    }
  });

  it("is empty once the last calendar year has finished", () => {
    expect(getUpcomingCalendarDates(new Date("2028-01-02T00:00:00+03:00"))).toEqual([]);
  });
});
