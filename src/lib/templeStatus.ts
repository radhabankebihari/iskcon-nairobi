import { templeHours, templeSchedule } from "@/data/site";

export type TempleStatus = {
  isOpen: boolean;
  windowLabel: string;
  primaryText: string;
  detailText: string;
  nextProgramme: string;
};

const NAIROBI_TIMEZONE = "Africa/Nairobi";

function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

const morningOpens = toMinutes(templeHours.morning.opens);
const morningCloses = toMinutes(templeHours.morning.closes);
const eveningOpens = toMinutes(templeHours.evening.opens);
const eveningCloses = toMinutes(templeHours.evening.closes);

// The overnight window runs past midnight, so its end is expressed as minutes
// into the following day.
const windows = [
  { start: morningOpens, end: morningCloses, isOpen: true, label: `${templeHours.morning.opens} - ${templeHours.morning.closes}` },
  { start: morningCloses, end: eveningOpens, isOpen: false, label: `${templeHours.morning.closes} - ${templeHours.evening.opens}` },
  { start: eveningOpens, end: eveningCloses, isOpen: true, label: `${templeHours.evening.opens} - ${templeHours.evening.closes}` },
  { start: eveningCloses, end: morningOpens + 1440, isOpen: false, label: `${templeHours.evening.closes} - ${templeHours.morning.opens}` },
];

const programmes = templeSchedule.map(({ time, event }) => {
  const match = time.match(/^(\d+):(\d+) (A\.M\.|P\.M\.)$/);
  if (!match) throw new Error(`Invalid temple schedule time: ${time}`);
  const hour = Number(match[1]) % 12 + (match[3] === "P.M." ? 12 : 0);
  return { minute: hour * 60 + Number(match[2]), label: event };
});

function getNairobiMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: NAIROBI_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

  return hour * 60 + minute;
}

function formatTime(minuteOfDay: number) {
  const normalized = minuteOfDay % 1440;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function getCurrentWindow(minutes: number) {
  const comparableMinutes = minutes < morningOpens ? minutes + 1440 : minutes;

  return windows.find((window) => comparableMinutes >= window.start && comparableMinutes < window.end) ?? windows[0];
}

function getNextProgramme(minutes: number) {
  const nextToday = programmes.find((programme) => programme.minute > minutes);
  const next = nextToday ?? programmes[0];

  return `${next.label} at ${formatTime(next.minute)}`;
}

export function getTempleStatus(date: Date): TempleStatus {
  const minutes = getNairobiMinutes(date);
  const window = getCurrentWindow(minutes);
  const boundary = window.end % 1440;
  const nextProgramme = getNextProgramme(minutes);

  if (window.isOpen) {
    return {
      isOpen: true,
      windowLabel: window.label,
      primaryText: "Temple Open",
      detailText: `Until ${formatTime(boundary)}`,
      nextProgramme,
    };
  }

  return {
    isOpen: false,
    windowLabel: window.label,
    primaryText: "Temple Closed",
    detailText: `Opens ${formatTime(boundary)}`,
    nextProgramme,
  };
}
