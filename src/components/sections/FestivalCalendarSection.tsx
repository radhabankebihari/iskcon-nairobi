"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { homepageFestivalPreview } from "@/data/site";
import { useKirtanSafariState } from "@/hooks/useKirtanSafariState";
import { getUpcomingCalendarDates } from "@/lib/calendarDates";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FestivalCalendarSection() {
  const festivalState = useKirtanSafariState();
  // This page is prerendered, so the visitor's date is only read after hydration.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setNow(new Date()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const nextDates = now ? getUpcomingCalendarDates(now, 4) : [];
  const visibleFestivals = homepageFestivalPreview.filter((festival) => {
    if (!now || new Date(festival.endsAt).getTime() <= now.getTime()) return false;
    return festivalState.phase !== "concluded" || festival.href !== "/festivals/kirtan-safari";
  });

  return (
    <section className="pt-10 pb-section bg-temple-cream sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
      <div className="content-width section-padding">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <SectionHeading eyebrow="Festivals" title="Upcoming" accent="Festivals & Events" />
          </div>
        </div>

        {/* The next few dates from the calendar, then the featured festivals */}
        {now && (nextDates.length > 0 || visibleFestivals.length === 0) && (
          nextDates.length > 0 ? (
            <ul className={`grid gap-px border border-temple-sand bg-temple-sand sm:grid-cols-2 ${visibleFestivals.length ? "mb-8" : ""}`}>
              {nextDates.map((item) => (
                <li key={`${item.isoDate}-${item.event}`} className="flex items-baseline gap-4 bg-white p-5">
                  <span className="w-16 shrink-0 font-body text-sm font-bold uppercase tracking-wide text-primary">{item.label}</span>
                  <span className="font-display text-lg leading-snug text-ink">{item.event}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body text-sm leading-relaxed text-ink/75">
              The next temple calendar is being prepared. Contact the temple office for upcoming dates.
            </p>
          )
        )}

        {/* Festival Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleFestivals.map((festival) => (
            <Link
              key={`${festival.href}-${festival.endsAt}`}
              href={festival.href}
              className="group block card-surface hover:border-gold/40 transition-all duration-300 hover:shadow-card-hover overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={festival.image}
                  alt={festival.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Date badge */}
                <div className="absolute bottom-4 left-4 bg-temple-brown/90 backdrop-blur-sm px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar size={11} className="text-gold" />
                    <span className="font-body text-white text-xs">{festival.date}</span>
                  </div>
                </div>
                {festival.tag && (
                  <div className="absolute top-4 left-4 bg-gold px-2.5 py-1">
                    <span className="font-body text-xs font-bold uppercase tracking-[0.14em] text-ink">
                      {festival.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-ink mb-1 group-hover:text-gold-ink transition-colors">
                  {festival.title}
                </h3>
                <div className="flex items-center gap-1.5 mb-3">
                  <MapPin size={11} className="text-gold flex-shrink-0" />
                  <span className="font-body text-ink/75 text-xs">{festival.location}</span>
                </div>
                <p className="font-body text-ink/75 text-sm leading-relaxed line-clamp-2">
                  {festival.description}
                </p>
                <div className="text-link mt-4 flex items-center gap-1.5 text-gold-ink">
                  Learn more <ArrowRight size={11} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-start sm:mt-10">
          <Link
            href="/festivals"
            className="text-link tap-target flex items-center gap-2 text-gold-ink hover:gap-3 transition-all"
          >
            All festivals <ArrowRight size={12} />
          </Link>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 bg-temple-brown p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display text-white text-xl mb-1">Never Miss a Festival</p>
            <p className="font-body text-white/60 text-sm">See every festival, Ekadashi, and holy day on the ISKCON Nairobi calendar.</p>
          </div>
          <Link
            href="/festivals"
            className="min-h-11 bg-primary text-white font-body text-sm font-semibold px-6 py-3 hover:bg-primary-dark transition-colors"
          >
            View Festivals
          </Link>
        </div>
      </div>
    </section>
  );
}
