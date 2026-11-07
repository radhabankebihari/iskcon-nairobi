import { entryIsoDate, vaishnavaCalendarMonths, type CalendarEntry } from "@/data/vaishnavaCalendar";

export type CalendarNotificationEvent = {
  id: string;
  title: string;
  body: string;
  event: string;
  dateLabel: string;
  startsAt: string;
  href: string;
  type: "Ekadashi" | "Major";
};

function eventSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hrefForEvent(event: string) {
  const lower = event.toLowerCase();

  if (lower.includes("janmashtami")) {
    return "/festivals/janmashtami";
  }

  if (lower.includes("radhashtami")) {
    return "/festivals/radhashtami";
  }

  if (lower.includes("kirtan safari")) {
    return "/festivals/kirtan-safari";
  }

  if (lower.includes("ratha yatra")) {
    return "/festivals/rath-yatra";
  }

  if (lower.includes("gaura purnima")) {
    return "/festivals/gaura-purnima";
  }

  return "/festivals";
}

function titleForEvent(event: string, type: "Ekadashi" | "Major") {
  if (type === "Ekadashi") {
    return "Ekadashi reminder";
  }

  return event.split(" - ")[0].split(" / ")[0].split(": ")[0];
}

function bodyForEvent(item: CalendarEntry, type: "Ekadashi" | "Major") {
  const fast = item.fast ? ` ${item.fast}.` : "";

  if (type === "Ekadashi") {
    const breakFast = item.breakFast
      ? ` Break fast ${item.breakFast}.`
      : " Please check temple announcements for local fasting details.";
    return `Today is ${item.event}.${fast}${breakFast}`;
  }

  return `Today at ISKCON Nairobi: ${item.event}.${fast} Open the calendar for programme details.`;
}

export const calendarNotificationEvents: CalendarNotificationEvent[] =
  vaishnavaCalendarMonths
    .flatMap((month) => {
      return month.events
        .filter((item) => item.type === "Ekadashi" || item.type === "Major")
        .map((item) => {
          const isoDate = entryIsoDate(month, item);
          const type = item.type as "Ekadashi" | "Major";
          const startsAt = `${isoDate}T07:00:00+03:00`;
          const id = `${isoDate}-${eventSlug(item.event)}`;

          return {
            id,
            title: titleForEvent(item.event, type),
            body: bodyForEvent(item, type),
            event: item.event,
            dateLabel: item.date,
            startsAt,
            href: hrefForEvent(item.event),
            type,
          };
        });
    })
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
