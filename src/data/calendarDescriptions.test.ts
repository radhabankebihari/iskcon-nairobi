import { describe, expect, it } from "vitest";
import { describeObservance, EKADASHI_DESCRIPTION, HOLIDAY_DESCRIPTION } from "./calendarDescriptions";
import { vaishnavaCalendarMonths } from "./vaishnavaCalendar";

describe("calendar descriptions", () => {
  it("gives every observance in every year a description", () => {
    const missing = vaishnavaCalendarMonths.flatMap((month) =>
      month.events.filter((entry) => !entry.description).map((entry) => `${month.year} ${entry.date} ${entry.event}`)
    );
    expect(missing).toEqual([]);
  });

  it("describes a break-fast entry as a break-fast, not as the Ekadashi", () => {
    expect(describeObservance("Break fast 6:30 to 10:34 A.M. (for the prior day's Ekadashi)")).toMatch(/breaking/);
  });

  it("matches the same festival under either year's spelling", () => {
    expect(describeObservance("Narasimha Chaturdashi - Appearance of Lord Narasimhadeva")).toBe(
      describeObservance("Nrsimha Caturdasi: Appearance of Lord Nrsimhadeva")
    );
    expect(describeObservance("Radhashtami - Appearance of Srimati Radharani")).toMatch(/Radharani/);
  });

  it("uses the shared Ekadashi, holiday, and moon lines", () => {
    expect(describeObservance("Shat Tila Ekadashi", "Ekadashi")).toBe(EKADASHI_DESCRIPTION);
    expect(describeObservance("Madaraka Day", "Holiday")).toBe(HOLIDAY_DESCRIPTION);
    expect(describeObservance("Eid al-Adha (subject to moon sighting)", "Holiday")).toMatch(/sighting of the moon/);
    expect(describeObservance("Purnima (full moon)")).toMatch(/Full moon/);
    expect(describeObservance("Amavasya (new moon)")).toMatch(/New moon/);
  });

  it("describes a shared day by the first person named", () => {
    expect(describeObservance("Disappearances of Sri Mukunda Datta and Sri Sridhara Pandita")).toMatch(/Mukunda Datta/);
  });
});
