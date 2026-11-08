import { getAllCalendarDates, isMoonPhase, type CalendarDate } from "@/lib/calendarDates";
import { nairobiDateKey } from "@/lib/calendarPushSchedule";

/** Daily lamp offerings at the temple through Kartik, with Damodarastakam. */
export const KARTIK_LAMP_TIMES = ["7:30 AM", "7:30 PM"] as const;

export type KartikSeason = {
  year: number;
  start: CalendarDate;
  end: CalendarDate;
  /** First day of Bhisma Pancaka, the final five days, when the calendar lists it. */
  bhismaPancaka?: CalendarDate;
  totalDays: number;
  /** "before" until the first day, "during" through the last day, then "after". */
  phase: "before" | "during" | "after";
  /** 1 on the first day; only meaningful while the season is "during". */
  dayNumber: number;
  daysUntilStart: number;
  /** Temple observances inside the season, soonest first. */
  observances: CalendarDate[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

function dayIndex(isoDate: string) {
  return Math.round(Date.parse(`${isoDate}T00:00:00Z`) / DAY_MS);
}

/**
 * The Kartik month (Damodara month) that is current or next, from the Vaishnava
 * calendar. After the last listed season ends it returns that season as "after".
 */
export function getKartikSeason(now: Date = new Date()): KartikSeason | null {
  const dates = getAllCalendarDates();
  const starts = dates.filter((item) => /^kartika vrata begins/i.test(item.event));
  const ends = dates.filter((item) => /^kartika vrata ends/i.test(item.event));
  if (!starts.length || !ends.length) return null;

  const today = nairobiDateKey(now);
  const seasons = starts
    .map((start) => ({ start, end: ends.find((end) => end.isoDate >= start.isoDate) }))
    .filter((season): season is { start: CalendarDate; end: CalendarDate } => Boolean(season.end));
  const season = seasons.find((item) => item.end.isoDate >= today) ?? seasons[seasons.length - 1];
  if (!season) return null;

  const { start, end } = season;
  const inside = dates.filter((item) => item.isoDate >= start.isoDate && item.isoDate <= end.isoDate);
  const phase = today < start.isoDate ? "before" : today > end.isoDate ? "after" : "during";

  return {
    year: start.year,
    start,
    end,
    bhismaPancaka: inside.find((item) => /^first day of bhisma pancaka/i.test(item.event)),
    totalDays: dayIndex(end.isoDate) - dayIndex(start.isoDate) + 1,
    phase,
    dayNumber: phase === "during" ? dayIndex(today) - dayIndex(start.isoDate) + 1 : 0,
    daysUntilStart: phase === "before" ? dayIndex(start.isoDate) - dayIndex(today) : 0,
    observances: inside.filter(
      (item) => item.type !== "Holiday" && !isMoonPhase(item.event) && !/^kartika vrata|caturmasya/i.test(item.event)
    ),
  };
}

/** "26 Oct" style short date for a calendar entry. */
export function shortDate(item: CalendarDate) {
  return new Date(`${item.isoDate}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}
