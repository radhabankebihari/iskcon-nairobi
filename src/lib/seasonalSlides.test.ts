import { describe, expect, it } from "vitest";
import { slidesInSeason } from "./seasonalSlides";

const slides = [
  { id: "kartik", showUntil: "2026-11-24T23:59:59+03:00" },
  { id: "gita-jayanti", showFrom: "2026-11-25T00:00:00+03:00", showUntil: "2026-12-20T23:59:59+03:00" },
  { id: "temple" },
  { id: "darshan" },
];
const ids = (iso: string) => slidesInSeason(slides, Date.parse(iso)).map((slide) => slide.id);

describe("slidesInSeason", () => {
  it("keeps Kartik through the last evening of the month", () => {
    expect(ids("2026-11-24T23:30:00+03:00")).toEqual(["kartik", "temple", "darshan"]);
  });

  it("switches to Gita Jayanti at midnight Nairobi time", () => {
    expect(ids("2026-11-25T00:00:00+03:00")).toEqual(["gita-jayanti", "temple", "darshan"]);
  });

  it("drops Gita Jayanti after its day", () => {
    expect(ids("2026-12-20T20:00:00+03:00")).toEqual(["gita-jayanti", "temple", "darshan"]);
    expect(ids("2026-12-21T00:00:00+03:00")).toEqual(["temple", "darshan"]);
  });
});
