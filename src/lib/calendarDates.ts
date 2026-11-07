import { entryIsoDate, vaishnavaCalendarMonths } from "@/data/vaishnavaCalendar";

export type CalendarDate = {
  label: string;
  day: string;
  event: string;
  type?: string;
  description?: string;
  fast?: string;
  breakFast?: string;
  year: number;
  isoDate: string;
  endsAt: number;
};

const allCalendarDates: CalendarDate[] = vaishnavaCalendarMonths
  .flatMap((month) =>
    month.events.map((item) => {
      const isoDate = entryIsoDate(month, item);
      return {
        label: item.date,
        day: item.day,
        event: item.event,
        type: item.type,
        description: item.description,
        fast: item.fast,
        breakFast: item.breakFast,
        year: month.year,
        isoDate,
        endsAt: new Date(`${isoDate}T23:59:59+03:00`).getTime(),
      };
    })
  )
  .sort((a, b) => a.endsAt - b.endsAt);

/**
 * Temple observances that have not finished yet in Nairobi, soonest first.
 * Kenyan public holidays are left out; they appear only in the month listings.
 */
export function getUpcomingCalendarDates(now: Date, limit?: number): CalendarDate[] {
  const upcoming = allCalendarDates.filter(
    (item) => item.type !== "Holiday" && item.endsAt >= now.getTime()
  );
  return limit ? upcoming.slice(0, limit) : upcoming;
}

/** The next date (today included) whose name matches, for festival pages. */
export function getNextObservance(now: Date, pattern: RegExp): CalendarDate | undefined {
  return allCalendarDates.find((item) => pattern.test(item.event) && item.endsAt >= now.getTime());
}

/** "Wednesday 25 August 2027" for a calendar date. */
export function formatObservanceDate(item: CalendarDate) {
  return new Date(`${item.isoDate}T12:00:00+03:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Nairobi",
  });
}
