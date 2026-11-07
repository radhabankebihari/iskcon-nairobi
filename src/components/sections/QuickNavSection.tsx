"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight, HandHeart, Heart } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { templeInfo, templeSchedule } from "@/data/site";
import { getTempleStatus, type TempleStatus } from "@/lib/templeStatus";

const classTime = templeSchedule.find((item) => item.event === "Srimad-Bhagavatam Class")?.time;

// Each door carries one specific, true fact instead of a generic description, so
// visitors learn something useful before they even click.
const secondaryPaths = [
  {
    icon: BookOpen,
    title: "Learn",
    detail: classTime ? `Srimad-Bhagavatam class daily, ${classTime}` : "Daily classes and study programmes",
    href: "/learn",
  },
  {
    icon: HandHeart,
    title: "Serve",
    detail: "Food For Life, the farm, and festivals",
    href: "/serve",
  },
  {
    icon: Heart,
    title: "Give",
    detail: "Support worship, prasadam, and cow care",
    href: "/donate",
  },
];

export default function QuickNavSection() {
  // The homepage is prerendered, so the visitor's clock is only read after hydration.
  const [status, setStatus] = useState<TempleStatus | null>(null);

  useEffect(() => {
    const update = () => setStatus(getTempleStatus(new Date()));
    const first = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <section className="bg-temple-cream pb-8 pt-8 sm:pb-14 sm:pt-14">
      <div className="content-width section-padding">
        <div className="mb-5 max-w-2xl sm:mb-9">
          <SectionHeading eyebrow="Find Your Path" title="Where would you like to begin?" />
          <p className="mt-3 hidden font-body text-sm leading-relaxed text-ink/75 sm:block sm:text-base">
            Everyone is welcome. Most people start with a visit.
          </p>
        </div>

        <nav
          aria-label="Ways to begin at ISKCON Nairobi"
          className="grid gap-3 sm:gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-5"
        >
          <Link
            href="/visit"
            className="group card-surface flex flex-col overflow-hidden text-ink shadow-sm transition-shadow duration-300 hover:border-gold/50 hover:shadow-card-hover"
          >
            <div className="relative hidden h-52 overflow-hidden sm:block md:h-auto md:min-h-48 md:flex-1">
              <Image
                src="/images/iskcon-nairobi-aerial.jpg"
                alt="The ISKCON Nairobi temple seen from above, with the city skyline behind it"
                fill
                sizes="(max-width: 1024px) 100vw, 640px"
                className="object-cover object-[center_78%] transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-4 sm:gap-2 sm:p-6 md:flex-none lg:p-7">
              <StatusLine status={status} />
              <h3 className="font-display text-2xl font-semibold leading-tight sm:text-[1.7rem]">
                Visit the temple
              </h3>
              <p className="hidden font-body text-sm leading-relaxed text-ink/75 sm:block sm:text-base">
                {templeInfo.shortAddress}. No experience needed. Come as you are.
              </p>
              <span className="text-link mt-2 inline-flex items-center gap-2 text-primary">
                Plan your visit
                <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Phones show the three smaller paths as one divided list; wider screens show cards. */}
          <ul className="grid divide-y divide-temple-sand border border-temple-sand bg-white shadow-sm sm:gap-4 sm:divide-y-0 sm:border-0 sm:bg-transparent sm:shadow-none md:grid-rows-3 lg:gap-5">
            {secondaryPaths.map(({ icon: Icon, title, detail, href }) => (
              <li key={href} className="flex">
                <Link
                  href={href}
                  className="group flex min-h-14 flex-1 items-center gap-3 px-4 py-3 text-ink transition-shadow duration-300 sm:border sm:border-temple-sand sm:bg-white sm:min-h-[4.5rem] sm:gap-4 sm:px-6 sm:py-4 sm:shadow-sm sm:hover:border-gold/50 sm:hover:shadow-card-hover"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold-ink sm:h-11 sm:w-11">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold leading-tight sm:text-xl">{title}</span>
                    <span className="mt-0.5 block font-body text-sm leading-snug text-ink/75">{detail}</span>
                  </span>
                  <ChevronRight
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

function StatusLine({ status }: { status: TempleStatus | null }) {
  // Before hydration, show the timeless fact rather than a guess about now.
  if (!status) {
    return <span className="font-body text-sm font-semibold text-ink/75">Open daily, morning and evening</span>;
  }

  return (
    <span className="inline-flex items-center gap-2 font-body text-sm font-semibold text-ink">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${status.isOpen ? "bg-emerald-600" : "bg-sunset"}`}
        aria-hidden="true"
      />
      {/* "Until 12:45 PM" reads as "Open now until 12:45 PM", keeping the time's capitals. */}
      {`${status.isOpen ? "Open now" : "Closed now,"} ${status.detailText.charAt(0).toLowerCase()}${status.detailText.slice(1)}`}
    </span>
  );
}
