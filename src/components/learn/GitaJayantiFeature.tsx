import { ArrowRight, BookOpen, CalendarDays, Clock, Download, MapPin, UtensilsCrossed } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import SharePageButton from "@/components/ui/SharePageButton";
import { gitaJayanti2026 } from "@/data/gitaJayanti";

function daysUntil(isoDate: string, now: number) {
  const nairobiToday = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi" }).format(now);
  return Math.round((Date.parse(`${isoDate}T00:00:00Z`) - Date.parse(`${nairobiToday}T00:00:00Z`)) / 86_400_000);
}

/**
 * Gita Jayanti on the Learn page, in the site's own style: the event only.
 * Giving lives in the Sponsor a Bhagavad-gita section directly below.
 * Shown until the celebration day ends (see gitaJayanti2026.season).
 */
export default function GitaJayantiFeature({ now }: { now: number }) {
  const g = gitaJayanti2026;
  const days = daysUntil(g.isoDate, now);
  const countdown = days > 1 ? `${days} days to go` : days === 1 ? "Tomorrow" : "Today";

  const details = [
    { icon: CalendarDays, label: "Date", value: g.date },
    { icon: Clock, label: "Begins", value: g.startTime },
    { icon: BookOpen, label: "Programme", value: "Complete recitation of all eighteen chapters" },
    { icon: UtensilsCrossed, label: "Afterwards", value: "Prasadam for everyone" },
    { icon: MapPin, label: "Where", value: "ISKCON Nairobi, Hare Krishna Close" },
  ];

  return (
    <section id="gita-jayanti" className="scroll-mt-24 bg-temple-cream py-14 sm:py-20">
      <div className="content-width section-padding grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div>
          <span className="eyebrow mb-4 block">Gita Jayanti &middot; {g.shortDate}</span>
          <h2 className="section-title max-w-xl">Hear the whole Gita, together</h2>
          <p className="mt-5 max-w-xl font-body leading-relaxed text-ink/75">
            Gita Jayanti honours the day Lord Krishna spoke the Bhagavad-gita to Arjuna on the battlefield of
            Kurukshetra. Join devotees and guests at the temple for a complete recitation of the Gita, followed by
            prasadam. Everyone is welcome.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink variant="primary" href="/visit">Plan your visit</ButtonLink>
            <ButtonLink variant="outline" href="#sponsor-a-gita">
              Sponsor a Gita <ArrowRight size={15} aria-hidden="true" />
            </ButtonLink>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1">
            <a href={g.poster} download className="inline-flex min-h-11 items-center gap-2 font-body text-sm text-ink/70 underline underline-offset-4 hover:text-ink">
              <Download size={15} aria-hidden="true" /> Download the poster
            </a>
            <SharePageButton tone="light" title="Gita Jayanti at ISKCON Nairobi" text={`${g.date}, complete Bhagavad-gita recitation from ${g.startTime}`} label="Share" />
          </div>
        </div>

        <div className="card-surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-temple-sand bg-white px-5 py-3">
            <p className="font-display text-lg font-semibold text-ink">Gita Jayanti 2026</p>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">{countdown}</p>
          </div>
          <dl className="divide-y divide-temple-sand/70 bg-white">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="grid grid-cols-[1.25rem_6rem_1fr] items-baseline gap-3 px-5 py-3.5">
                <Icon size={16} className="translate-y-0.5 text-gold-dark" aria-hidden="true" />
                <dt className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-ink/75">{label}</dt>
                <dd className="font-body text-sm text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
