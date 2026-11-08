import { describe, expect, it } from "vitest";
import { getKartikSeason } from "./kartik";

const at = (iso: string) => new Date(`${iso}T09:00:00+03:00`);

describe("getKartikSeason", () => {
  it("knows the 2026 month and today's place in it", () => {
    const season = getKartikSeason(at("2026-11-08"))!;
    expect(season.start.isoDate).toBe("2026-10-26");
    expect(season.end.isoDate).toBe("2026-11-24");
    expect(season.totalDays).toBe(30);
    expect(season.phase).toBe("during");
    expect(season.dayNumber).toBe(14);
  });

  it("counts the first and last days inclusively", () => {
    expect(getKartikSeason(at("2026-10-26"))!.dayNumber).toBe(1);
    expect(getKartikSeason(at("2026-11-24"))!.dayNumber).toBe(30);
  });

  it("moves on to 2027 once the 2026 month ends", () => {
    const season = getKartikSeason(at("2026-11-25"))!;
    expect(season.start.isoDate).toBe("2027-10-15");
    expect(season.phase).toBe("before");
    expect(season.daysUntilStart).toBeGreaterThan(300);
  });

  it("lists the holy days inside the month, without moons or holidays", () => {
    const season = getKartikSeason(at("2026-11-08"))!;
    const names = season.observances.map((item) => item.event);
    expect(names.some((name) => /govardhana puja/i.test(name))).toBe(true);
    expect(names.some((name) => /^(purnima|amavasya) \(/i.test(name))).toBe(false);
    expect(season.observances.every((item) => item.isoDate >= "2026-10-26" && item.isoDate <= "2026-11-24")).toBe(true);
    expect(season.bhismaPancaka?.isoDate).toBe("2026-11-21");
  });

  it("stays on the last listed month after the calendar runs out", () => {
    const season = getKartikSeason(at("2028-01-01"))!;
    expect(season.year).toBe(2027);
    expect(season.phase).toBe("after");
  });
});
