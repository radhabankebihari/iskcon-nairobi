import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CalendarNotificationOptIn from "@/components/ui/CalendarNotificationOptIn";
import { homepageFestivalPreview, templeInfo } from "@/data/site";
import { MONTH_NUMBERS, vaishnavaCalendarMonths, type CalendarMonth as CalendarMonthData } from "@/data/vaishnavaCalendar";
import { Calendar, MapPin, ArrowRight, Sparkles, UtensilsCrossed } from "lucide-react";
import { getKirtanSafariState } from "@/lib/kirtanSafariState";
import { getUpcomingCalendarDates } from "@/lib/calendarDates";
import { safeJsonLd } from "@/lib/security";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata = withSeo({
  title: "Festivals",
  description: "ISKCON Nairobi festival calendar including Ratha Yatra, Janmashtami, Gaura Purnima, and Kirtan Safari.",
}, "/festivals");

function CalendarMonth({ month }: { month: CalendarMonthData }) {
  return (
    <section className="card-surface">
        <div className="flex items-center justify-between border-b border-temple-sand bg-temple-cream px-4 py-3">
          <h3 className="font-display text-xl font-semibold text-ink">
            {month.month} <span className="text-ink/75">{month.year}</span>
          </h3>
          <span className="font-body text-xs font-semibold text-gold-ink">
            {month.events.length} observances
          </span>
        </div>
        <div className="divide-y divide-temple-sand/70">
          {month.events.map((item) => (
            <div key={`${month.year}-${month.month}-${item.date}-${item.event}`} className="grid grid-cols-[4.8rem_1fr] gap-3 px-4 py-3">
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-[0.08em] text-primary">{item.date}</p>
                <p className="font-body text-xs uppercase tracking-[0.14em] text-ink/75">{item.day}</p>
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`font-body text-sm leading-snug ${item.type === "Major" ? "font-semibold text-ink" : "text-ink/80"}`}>
                    {item.event}
                  </p>
                  {item.type && (
                    <span className="inline-flex items-center gap-1 bg-gold/10 px-2 py-0.5 font-body text-xs font-semibold text-gold-ink">
                      {item.type === "Major" && <Sparkles size={10} aria-hidden="true" />}
                      {item.type === "Major" ? "Festival" : item.type}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 font-body text-xs leading-relaxed text-ink/75">{item.description}</p>
                )}
                {(item.fast || item.breakFast) && (
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs font-semibold text-primary">
                    {item.fast && <span>{item.fast}</span>}
                    {item.breakFast && (
                      <span className="inline-flex items-center gap-1">
                        <UtensilsCrossed size={11} aria-hidden="true" /> Break fast {item.breakFast}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
  );
}

export default function FestivalsPage() {
  const kirtanSafariState = getKirtanSafariState(new Date());
  const festivalPreview = homepageFestivalPreview.map((festival) =>
    festival.href === "/festivals/kirtan-safari" && kirtanSafariState.phase === "concluded"
      ? {
          ...festival,
          date: "2026 festival archive",
          description:
            "Relive four days of the holy name, guest kirtaniyas, Harinam, prasadam, and devotional community, and receive news of the next edition.",
          tag: "Annual Festival",
        }
      : festival
  );
  const today = new Date();
  const now = today.getTime();
  const nextDates = getUpcomingCalendarDates(today, 6);
  // A month is past once its last day has ended in Nairobi.
  const monthEnd = (month: CalendarMonthData) =>
    Date.UTC(month.year, MONTH_NUMBERS[month.month], 1) - 3 * 60 * 60 * 1000;
  const pastMonths = vaishnavaCalendarMonths.filter((month) => monthEnd(month) <= now);
  const comingMonths = vaishnavaCalendarMonths.filter((month) => monthEnd(month) > now);
  // Show the next four months open; later months sit behind a disclosure.
  const currentMonths = comingMonths.slice(0, 4);
  const laterMonths = comingMonths.slice(4);
  const laterLabel = laterMonths.length
    ? `${laterMonths[0].month} ${laterMonths[0].year} to ${laterMonths[laterMonths.length - 1].month} ${laterMonths[laterMonths.length - 1].year}`
    : "";
  const eventData = getUpcomingCalendarDates(today)
    .filter((item) => item.type === "Major")
    .map((item) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: item.event,
      ...(item.description ? { description: item.description } : {}),
      startDate: item.isoDate,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: templeInfo.legalName,
        address: { "@type": "PostalAddress", streetAddress: templeInfo.shortAddress, addressCountry: "KE" },
      },
    }));
  const upcomingFestivals = festivalPreview.filter(
    (festival) => new Date(festival.endsAt).getTime() > now
  );
  const archivedFestivals = festivalPreview.filter(
    (festival) => new Date(festival.endsAt).getTime() < now
  );

  return (
    <>
      {eventData.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventData) }} />
      )}
      <PageHero
        title="Sacred"
        titleAccent="Festivals"
        subtitle="Temple Festivals"
        description="Celebrate Lord Krishna, Lord Jagannath, Sri Chaitanya Mahaprabhu, and the holy name with Nairobi's devotional community."
        image="/images/hero-ratha-yatra-kenya.jpg"
        height="sm"
        className="lg:min-h-[560px]"
      />

      <section className="pt-section-sm pb-section bg-temple-bg">
        <div className="content-width section-padding">
          <div className="mb-8 max-w-2xl">
            <SectionHeading eyebrow="Coming Up" title="Next Dates at" accent="the Temple" />
          </div>
          {nextDates.length > 0 ? (
            <ul className="mb-12 grid gap-px border border-temple-sand bg-temple-sand sm:grid-cols-2 lg:grid-cols-3">
              {nextDates.map((item) => (
                <li key={`${item.isoDate}-${item.event}`} className="flex items-baseline gap-4 bg-white p-5">
                  <span className="shrink-0">
                    <span className="block font-body text-sm font-bold uppercase tracking-wide text-primary">{item.label}</span>
                    <span className="block font-body text-xs uppercase tracking-[0.14em] text-ink/75">{item.day}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg leading-snug text-ink">{item.event}</span>
                    {item.description && (
                      <span className="mt-1 block font-body text-xs leading-relaxed text-ink/75">{item.description}</span>
                    )}
                    {item.fast && (
                      <span className="mt-1 block font-body text-xs font-semibold text-primary">{item.fast}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-12 font-body text-sm leading-relaxed text-ink/75">
              The next temple calendar is being prepared. Contact the temple office for upcoming dates.
            </p>
          )}

          <CalendarNotificationOptIn />

          {upcomingFestivals.length > 0 && (
          <>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionHeading eyebrow="Next Temple Programmes" title="Upcoming" accent="Highlights" />
            </div>
            <p className="max-w-xl font-body text-sm leading-relaxed text-ink/75">
              Key public events from the ISKCON Nairobi Vaishnava calendar. Dates may be confirmed again closer to each festival.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {upcomingFestivals.map((festival) => (
              <Link
                href={festival.href}
                key={`${festival.href}-${festival.endsAt}`}
                className="group card-surface hover:border-primary/40 hover:shadow-card-hover transition-all overflow-hidden"
              >
                <div className="relative h-56 overflow-hidden image-grade">
                  <Image
                    src={festival.image}
                    alt={festival.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dusk/75 to-transparent" />
                  {festival.tag && (
                    <div className="absolute left-4 top-4 bg-gold px-2.5 py-1">
                      <span className="font-body text-xs font-bold uppercase tracking-[0.14em] text-ink">{festival.tag}</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-display text-white text-xl font-semibold text-shadow">{festival.title}</h2>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-ink/75 mb-2">
                    <Calendar size={12} className="text-gold" />
                    <span className="font-body text-xs">{festival.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-ink/75 mb-4">
                    <MapPin size={12} className="text-gold" />
                    <span className="font-body text-xs">{festival.location}</span>
                  </div>
                  <p className="font-body text-ink/75 text-sm leading-relaxed line-clamp-3">{festival.description}</p>
                  <div className="text-link mt-5 flex items-center gap-2 text-primary">
                    Details <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          </>
          )}

          {archivedFestivals.length > 0 && (
            <section className="mt-16 border-t border-gold/20 pt-10">
              <div className="mb-7 max-w-2xl">
                <span className="eyebrow mb-3 block">Festival Archive</span>
                <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                  Recent celebrations
                </h2>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">
                  Revisit festival stories, photographs, teachings, and memories from the temple community.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {archivedFestivals.map((festival) => (
                  <Link
                    href={festival.href}
                    key={`${festival.href}-${festival.endsAt}`}
                    className="group grid min-h-44 grid-cols-[minmax(7.5rem,0.85fr)_1.15fr] overflow-hidden card-surface transition-all hover:border-primary/40 hover:shadow-card-hover"
                  >
                    <div className="relative image-grade">
                      <Image
                        src={festival.image}
                        alt={festival.title}
                        fill
                        sizes="(max-width: 640px) 40vw, 280px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-center p-5">
                      <span className="font-body text-xs font-bold uppercase tracking-[0.14em] text-gold-ink">
                        {festival.date}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-ink group-hover:text-primary">
                        {festival.title}
                      </h3>
                      <span className="text-link mt-4 inline-flex items-center gap-2 text-primary">
                        Revisit <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16 rounded-none border border-gold/20 bg-white/70 p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="eyebrow block mb-2">Vaishnava Calendar</span>
                <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  Every observance, month by month
                </h2>
                <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-ink/75">
                  Festivals, Ekadashi fasts with break-fast times, and the appearance and disappearance days of
                  great Vaishnavas, from the temple&apos;s printed calendar. Kenyan public holidays are included for
                  planning.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {currentMonths.map((month) => (
              <CalendarMonth key={`${month.year}-${month.month}`} month={month} />
            ))}
          </div>

          {laterMonths.length > 0 && (
            <details className="mt-8 border border-temple-sand bg-white/70">
              <summary className="flex min-h-11 cursor-pointer items-center px-5 py-3 font-body text-sm font-semibold text-ink">
                Later months: {laterLabel}
              </summary>
              <div className="grid gap-5 p-5 lg:grid-cols-2">
                {laterMonths.map((month) => (
                  <CalendarMonth key={`${month.year}-${month.month}`} month={month} />
                ))}
              </div>
            </details>
          )}

          {pastMonths.length > 0 && (
            <details className="mt-8 border border-temple-sand bg-white/70">
              <summary className="flex min-h-11 cursor-pointer items-center px-5 py-3 font-body text-sm font-semibold text-ink">
                Earlier months ({pastMonths.length})
              </summary>
              <div className="grid gap-5 p-5 lg:grid-cols-2">
                {pastMonths.map((month) => (
                  <CalendarMonth key={`${month.year}-${month.month}`} month={month} />
                ))}
              </div>
            </details>
          )}
        </div>
      </section>
    </>
  );
}
