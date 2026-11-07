// Every Vaishnava calendar year the site knows about, in date order. Add the
// next printed calendar here as a new year file when the temple releases it.

import { vaishnavaCalendar2026 } from "./vaishnavaCalendar2026";
import { vaishnavaCalendar2027 } from "./vaishnavaCalendar2027";

export type CalendarEntry = {
  date: string;
  day: string;
  event: string;
  /** "Major", "Ekadashi", or "Holiday" (Kenyan public holiday). */
  type?: string;
  /** A short line explaining the observance. */
  description?: string;
  /** Fasting guidance printed on the calendar, such as "Fast till noon". */
  fast?: string;
  /** When to break an Ekadashi fast, such as "Mon 4 Jan, 6:31 to 10:35 A.M.". */
  breakFast?: string;
};

export type CalendarMonth = {
  month: string;
  year: number;
  events: CalendarEntry[];
};

export const vaishnavaCalendarMonths: CalendarMonth[] = [
  ...vaishnavaCalendar2026,
  ...vaishnavaCalendar2027,
];

export const MONTH_NUMBERS: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

/** The yyyy-mm-dd date of a calendar entry. */
export function entryIsoDate(month: CalendarMonth, entry: CalendarEntry) {
  const day = entry.date.replace(/^\D+/, "").padStart(2, "0");
  return `${month.year}-${String(MONTH_NUMBERS[month.month]).padStart(2, "0")}-${day}`;
}
