import { CalendarDays } from "lucide-react";
import { formatObservanceDate, getNextObservance } from "@/lib/calendarDates";

type Props = {
  /** Matches the observance name in the Vaishnava calendar data. */
  pattern: RegExp;
  /** How the festival is named in the sentence, such as "Janmashtami". */
  name: string;
  /** Extra sentence shown after the date, such as a note about the procession. */
  note?: string;
  className?: string;
};

/**
 * The next date of a festival from the Vaishnava calendar, with its fasting
 * guidance. Renders nothing once the calendar has no future date for it.
 */
export default function FestivalDateNote({ pattern, name, note, className = "" }: Props) {
  const next = getNextObservance(new Date(), pattern);
  if (!next) return null;

  return (
    <div className={`flex gap-3 border border-gold/30 bg-white p-4 sm:p-5 ${className}`}>
      <CalendarDays className="mt-0.5 shrink-0 text-gold" size={18} aria-hidden="true" />
      <div className="font-body text-sm leading-relaxed text-ink/80">
        <p>
          <span className="font-semibold text-ink">
            {name} {next.year}: {formatObservanceDate(next).replace(` ${next.year}`, "")}
          </span>
          {next.fast && <span className="text-primary"> · {next.fast}</span>}
        </p>
        {note && <p className="mt-1 text-ink/75">{note}</p>}
      </div>
    </div>
  );
}
