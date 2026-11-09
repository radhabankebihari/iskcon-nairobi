import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, HandHeart, MapPin } from "lucide-react";
import DamodarastakamReader from "@/components/festivals/kartik/DamodarastakamReader";
import SharePageButton from "@/components/ui/SharePageButton";
import { templeInfo } from "@/data/site";
import { getKartikSeason, KARTIK_LAMP_TIMES, shortDate } from "@/lib/kartik";
import { nairobiDateKey } from "@/lib/calendarPushSchedule";
import type { CalendarDate } from "@/lib/calendarDates";
import { safeJsonLd } from "@/lib/security";
import { withSeo } from "@/lib/seo";

// Hourly, so the day counter and the "today" marker move with Nairobi time.
export const revalidate = 3600;

export const metadata = withSeo({
  title: "Kartik, the Month of Damodara",
  description:
    "Kartik at ISKCON Nairobi: the story of Damodara, daily lamp offerings with the Damodarastakam at 7:30 AM and 7:30 PM, ways to keep the month, and its holy days.",
  openGraph: {
    images: [{ url: "/images/festivals/kartik/link-preview.jpg", width: 1200, height: 630, alt: "Ghee lamps beside a painting of Mother Yashoda and child Krishna" }],
  },
  twitter: { images: ["/images/festivals/kartik/link-preview.jpg"] },
}, "/festivals/kartik");

const reasons = [
  {
    title: "The month dearest to Krishna",
    text: "The Puranas praise Kartik above every other month of the year. Devotion offered now, even something as small as a lamp, is said to bear fruit many times over.",
  },
  {
    title: "Urja, Radharani's month",
    text: "Kartik is also called Urja, a name of Srimati Radharani. Devotees treat the month as Her gift, a time to seek Her mercy so their service to Krishna can grow.",
  },
  {
    title: "The close of Caturmasya",
    text: "Kartik is the fourth and last month of Caturmasya, the rainy-season period of vows. Whatever a devotee has kept since Ashadha comes to completion here.",
  },
];

const scenes = [
  {
    label: "The butter pot",
    text: "Mother Yashoda is churning butter and singing of her son. Krishna wants to nurse, but the milk on the stove boils over and she sets Him down to save it. Upset, He breaks a pot of yoghurt and shares the butter with the monkeys.",
  },
  {
    label: "The chase",
    text: "Yashoda returns with a stick in her hand. Krishna, the Lord whom yogis cannot reach in meditation, runs from her, frightened. Slowed by her love and her weight, she runs after Him until she catches Him by the hand.",
  },
  {
    label: "Two fingers short",
    text: "She decides to tie Him to the wooden mortar, but every rope falls two fingers short, however many she knots together. When He sees her tired and perspiring, Krishna lets Himself be bound. One finger is her effort, the other is His mercy.",
  },
  {
    label: "The twin trees",
    text: "Tied to the mortar, Krishna crawls between two arjuna trees and pulls them down. Out step Nalakuvara and Manigriva, the sons of Kuvera, freed from Narada Muni's curse. They leave praying only to serve Him.",
  },
];

const practices = [
  {
    title: "Offer a lamp",
    text: "Wave a small ghee lamp before Damodara in circles while the Damodarastakam is sung. It is the heart of the month, and anyone can do it, children included.",
  },
  {
    title: "Sing the Damodarastakam",
    text: "Satyavrata Muni's eight verses retell the binding of Damodara and ask only for pure love. Sing them every morning and evening, at the temple or at home.",
  },
  {
    title: "Hear and chant more",
    text: "Many devotees add extra rounds of japa, read more of the Bhagavatam, or hear Krishna's Vrindavan pastimes each day of the month.",
  },
  {
    title: "Keep the Caturmasya fast",
    text: "Those who follow Caturmasya avoid urad dal during Kartik, the fourth month of the vow. Others take up a simple personal vow for the month.",
  },
  {
    title: "Bhisma Pancaka",
    text: "The last five days honour Grandfather Bhishma's vow. Some devotees fast more strictly, from Utthana Ekadasi to the full moon. Ask the temple what suits you.",
  },
];

/** One timeline stop per date, with every observance of that day under it. */
const offeringSteps = [
  {
    title: "Come as you are",
    text: "Remove your shoes at the entrance. Lamps are ready at the temple, so there is nothing to bring.",
  },
  {
    title: "Purify with achaman",
    text: "A devotee will pour a few drops of water into your right palm. Sip it three times, saying om keśavāya namaḥ, om nārāyaṇāya namaḥ and om mādhavāya namaḥ, then rinse your hands. The devotee will guide you.",
  },
  {
    title: "Take a lamp",
    text: "Hold the lamp in your right hand. A devotee will light it for you and show you where to stand.",
  },
  {
    title: "Offer it while the song is sung",
    text: "Move the lamp in slow clockwise circles before Lord Damodara, four times at His feet, twice at His navel, three times at His face, then seven times around His whole form.",
  },
  {
    title: "Pray for one thing",
    text: "The Damodarastakam asks only for love of Krishna. Make that your prayer too, in your own words.",
  },
  {
    title: "Place it on the tray",
    text: "Set your lamp down where the devotees show you and let it burn on, then make room for the next person.",
  },
  {
    title: "At home, the same",
    text: "Offer a ghee lamp before a picture of Yashoda and Damodara, morning or evening, and let each family member take a turn.",
  },
];

const circles = [
  { count: 4, place: "at His lotus feet" },
  { count: 2, place: "at His navel" },
  { count: 3, place: "at His face" },
  { count: 7, place: "around His whole form" },
];

function groupByDay(items: CalendarDate[]) {
  const days = new Map<string, CalendarDate[]>();
  for (const item of items) days.set(item.isoDate, [...(days.get(item.isoDate) ?? []), item]);
  return [...days.values()].map((dayItems) => ({ first: dayItems[0], items: dayItems }));
}

function DayLamps({ total, lit, current }: { total: number; lit: number; current: number }) {
  return (
    <div className="flex flex-wrap gap-[5px] sm:gap-1.5" aria-hidden="true">
      {Array.from({ length: total }, (_, index) => {
        const day = index + 1;
        const isToday = day === current;
        return (
          <span
            key={day}
            className={`relative block h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3 ${
              day <= lit ? "bg-gold shadow-[0_0_10px_2px_rgba(230,184,92,0.55)]" : "border border-gold/35 bg-transparent"
            } ${isToday ? "kartik-today-lamp scale-125 bg-gold-light" : ""}`}
          />
        );
      })}
    </div>
  );
}

function HeroImage() {
  const alt = "Devotees of all ages offering ghee lamps before a painting of Mother Yashoda binding baby Krishna";
  const common = { alt, fill: true, sizes: "100vw", priority: true } as const;
  const { props: desktop } = getImageProps({ ...common, src: "/images/hero-kartik-damodara-desktop.webp" });
  const { props: mobile } = getImageProps({ ...common, src: "/images/hero-kartik-damodara-mobile.webp" });
  return (
    <picture className="contents">
      <source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes="100vw" />
      <img {...desktop} alt={alt} className="object-cover object-[68%_center] md:object-[92%_center] 2xl:object-center" />
    </picture>
  );
}

export default function KartikPage() {
  const season = getKartikSeason();
  const today = nairobiDateKey(new Date());

  const range = season ? `${shortDate(season.start)} – ${shortDate(season.end)} ${season.end.year}` : "October – November";
  const lit = season?.phase === "during" ? season.dayNumber : season?.phase === "after" ? season.totalDays : 0;
  const status = !season
    ? "Dates are on the festival calendar."
    : season.phase === "during"
      ? `Day ${season.dayNumber} of ${season.totalDays}`
      : season.phase === "before"
        ? season.daysUntilStart === 1
          ? "Kartik begins tomorrow"
          : `Kartik begins in ${season.daysUntilStart} days`
        : `Kartik ${season.year} has ended`;

  const eventJsonLd = season && {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `Kartik lamp offerings ${season.year}`,
    description: "Daily Damodarastakam singing and ghee lamp offerings to Lord Damodara through the month of Kartik.",
    startDate: season.start.isoDate,
    endDate: season.end.isoDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: templeInfo.legalName,
      address: { "@type": "PostalAddress", streetAddress: "Hare Krishna Close", addressLocality: "Nairobi", addressCountry: "KE" },
    },
    organizer: { "@type": "Organization", name: templeInfo.name },
  };

  return (
    <div className="kartik-page bg-[#120c08] text-festival-cream">
      {eventJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventJsonLd) }} />}

      {/* 1. Hero: the lamp-lit painting, the month's dates, and today's place in it */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden md:min-h-[min(100svh,860px)] md:items-center">
        <HeroImage />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120c08] via-[#120c08]/55 to-transparent md:bg-gradient-to-r md:from-[#120c08]/95 md:via-[#120c08]/55 md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#120c08] to-transparent" />

        <div className="content-width section-padding relative z-10 pb-12 pt-[55svh] md:pb-16 md:pt-36">
          <div className="max-w-xl">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-gold-light">Damodara month · {range}</p>
            <h1 className="mt-4 font-display text-[clamp(2.9rem,12vw,5.75rem)] font-medium leading-[0.95] text-white">
              Kartik
            </h1>
            <p className="mt-3 font-editorial text-xl italic text-festival-cream/90 sm:text-2xl">
              A month of lamps for the Lord who let love bind Him.
            </p>

            <div className="mt-8 border-l border-gold/40 pl-5">
              <p className="font-body text-sm font-semibold text-white">{status}</p>
              {season && (
                <div className="mt-3">
                  <DayLamps total={season.totalDays} lit={lit} current={season.phase === "during" ? season.dayNumber : 0} />
                </div>
              )}
              <p className="mt-4 font-body text-sm leading-relaxed text-festival-cream/80">
                Lamp offerings every day at <strong className="text-white">{KARTIK_LAMP_TIMES[0]}</strong> and{" "}
                <strong className="text-white">{KARTIK_LAMP_TIMES[1]}</strong>. Lamps are provided at the temple.
              </p>
            </div>
            <div className="mt-2">
              <SharePageButton title="Kartik, the Month of Damodara" text="Daily lamp offerings at 7:30 AM and 7:30 PM, 26 Oct – 24 Nov" label="Share Kartik" />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#damodarastakam" className="btn-primary">
                Sing the Damodarastakam
              </a>
              <a href="#at-the-temple" className="btn-ghost">
                Join at the temple
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Kartik matters: an editorial opening, not a card grid */}
      <section className="bg-sand text-ink">
        <div className="content-width section-padding py-[clamp(3.5rem,9vw,7rem)]">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="eyebrow text-gold-ink">Why this month</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.08] text-ink">
                Of all months, Kartik. Of all offerings, a lamp.
              </h2>
              <p className="mt-6 max-w-md font-editorial text-lg leading-relaxed text-ink/80">
                Kartik falls between October and November, as the year turns towards its darkest nights. For thirty days
                devotees around the world remember one childhood pastime of Krishna and offer Him small flames of ghee.
              </p>
            </div>
            <ol className="divide-y divide-temple-sand border-y border-temple-sand">
              {reasons.map((reason, index) => (
                <li key={reason.title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-7">
                  <span className="font-display text-2xl text-primary">{["i", "ii", "iii"][index]}</span>
                  <div>
                    <h3 className="font-display text-xl text-ink">{reason.title}</h3>
                    <p className="mt-2 font-body text-[0.95rem] leading-relaxed text-ink/75">{reason.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 3. The Damodara story, told along a rope */}
      <section className="relative overflow-hidden">
        <div className="content-width section-padding py-[clamp(3.5rem,9vw,7rem)]">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold-light">The pastime behind the month</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.08] text-white">
              The day a mother&apos;s rope was always two fingers short
            </h2>
            <p className="mt-5 font-body leading-relaxed text-festival-cream/75">
              Told in the tenth canto of the Srimad Bhagavatam, this pastime gives Krishna the name Damodara. Kartik is
              the month of remembering it.
            </p>
          </div>

          <Image
            src="/images/festivals/kartik/damodara-story.webp"
            alt="Painted scenes of Krishna's butter pot, Yashoda's chase and rope, and the twin arjuna trees"
            width={1600}
            height={700}
            sizes="(max-width: 1280px) 100vw, 1216px"
            className="mt-10 h-auto w-full border-y border-gold/20 md:mt-12"
          />

          <ol className="kartik-rope relative mt-14 grid gap-10 md:mt-20 md:grid-cols-4 md:gap-6">
            {scenes.map((scene, index) => (
              <li key={scene.label} className="relative pl-12 md:pl-0 md:pt-14">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full border border-gold/60 bg-[#120c08] font-display text-sm text-gold-light"
                >
                  {index + 1}
                </span>
                <h3 className="font-display text-xl text-white">{scene.label}</h3>
                <p className="mt-3 font-body text-[0.95rem] leading-relaxed text-festival-cream/75">{scene.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid gap-6 border-t border-gold/20 pt-10 md:grid-cols-[auto_1fr] md:items-baseline md:gap-12">
            <p className="font-display text-[clamp(2.25rem,7vw,4rem)] leading-none text-gold-light">
              dāma <span className="text-festival-cream/40">+</span> udara
            </p>
            <p className="max-w-2xl font-editorial text-lg leading-relaxed text-festival-cream/85">
              <em>Dāma</em> means rope and <em>udara</em> means waist. Damodara is the Lord bound at the waist, the
              all-powerful God who chooses to be held by His devotee&apos;s love. That is what devotees pray for this month.
            </p>
          </div>
        </div>
      </section>

      {/* 4. At the temple: the two daily times, set large */}
      <section id="at-the-temple" className="scroll-mt-24 bg-[#1c130c]">
        <div className="content-width section-padding py-[clamp(3.5rem,9vw,6.5rem)]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <p className="eyebrow text-gold-light">At ISKCON Nairobi</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.08] text-white">
                Come and offer a lamp, twice a day
              </h2>
              <p className="mt-5 max-w-lg font-body leading-relaxed text-festival-cream/80">
                Every morning and evening of Kartik, devotees gather before Lord Damodara to sing the Damodarastakam
                together. While the eight verses are sung, everyone offers a small ghee lamp in turn.
              </p>
              <ul className="mt-6 space-y-2 font-body text-sm text-festival-cream/80">
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />Lamps are provided at the temple. Just come.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />Families and first-time visitors are welcome. Children love offering a lamp.</li>
                <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />The steps and the verses are below, so you can follow along on your phone.</li>
              </ul>
              <a
                href={templeInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 font-body text-sm font-semibold text-gold-light underline-offset-4 hover:underline"
              >
                <MapPin size={16} aria-hidden="true" /> {templeInfo.shortAddress}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-gold/25 bg-gold/25">
              {[
                { time: KARTIK_LAMP_TIMES[0], part: "Morning", note: "Start the day with a lamp" },
                { time: KARTIK_LAMP_TIMES[1], part: "Evening", note: "Close the day with a lamp" },
              ].map((slot) => {
                const [clock, meridiem] = slot.time.split(" ");
                return (
                  <div key={slot.time} className="bg-[#1c130c] px-5 py-8 text-center sm:px-8 sm:py-12">
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">{slot.part}</p>
                    <p className="mt-4 font-display text-[clamp(2.75rem,10vw,4.5rem)] leading-none text-white">
                      {clock}
                      <span className="ml-1 align-top font-body text-sm font-semibold text-festival-cream/70 sm:text-base">{meridiem}</span>
                    </p>
                    <p className="mt-4 font-body text-xs text-festival-cream/65 sm:text-sm">{slot.note}</p>
                  </div>
                );
              })}
              <p className="col-span-2 bg-[#241810] px-5 py-4 text-center font-body text-xs text-festival-cream/75 sm:text-sm">
                Daily, {range}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Ways to keep Kartik */}
      <section className="bg-sand text-ink">
        <div className="content-width section-padding py-[clamp(3.5rem,9vw,7rem)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow text-gold-ink">Keeping the month</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.08] text-ink">
                Five ways devotees keep Kartik
              </h2>
            </div>
            <p className="max-w-sm font-body text-sm leading-relaxed text-ink/70">
              Choose what you can keep steadily for thirty days. A small vow kept faithfully is worth more than a large one dropped.
            </p>
          </div>

          <ol className="mt-12 grid gap-x-10 md:grid-cols-2">
            {practices.map((practice, index) => (
              <li
                key={practice.title}
                className={`grid grid-cols-[3.25rem_1fr] gap-4 border-t border-temple-sand py-7 ${index === 0 ? "md:col-span-2 md:grid-cols-[3.25rem_1fr_1fr] md:gap-x-4" : ""}`}
              >
                <span className="font-display text-3xl leading-none text-primary">{index + 1}</span>
                <h3 className={`font-display text-2xl text-ink ${index === 0 ? "md:text-3xl" : ""}`}>{practice.title}</h3>
                <p className={`col-start-2 font-body text-[0.95rem] leading-relaxed text-ink/75 ${index === 0 ? "md:col-start-3 md:row-start-1" : ""}`}>
                  {practice.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* How to offer a lamp: the steps, with the four sets of circles drawn out */}
      <section id="how-to-offer" className="scroll-mt-24 bg-[#1c130c]">
        <div className="content-width section-padding py-[clamp(3.5rem,9vw,6.5rem)]">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold-light">First time?</p>
            <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.08] text-white">
              How to offer your lamp
            </h2>
            <p className="mt-5 font-body leading-relaxed text-festival-cream/75">
              It takes a few minutes and needs no experience. Devotees at the temple will help you.
            </p>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-16 lg:gap-y-10">
            <figure className="lg:col-start-2 lg:row-start-1">
              <Image
                src="/images/festivals/kartik/lamp-offering-at-home.webp"
                alt="Painting of a Kenyan family at home: a mother guides her daughter's hand to offer a ghee lamp before a picture of child Krishna bound to a mortar, while the father and grandmother sing"
                width={1200}
                height={1500}
                sizes="(max-width: 1023px) 100vw, 440px"
                className="aspect-[5/4] w-full rounded-2xl border border-gold/25 object-cover object-[center_8%] lg:aspect-[4/5]"
              />
              <figcaption className="mt-3 font-body text-xs text-festival-cream/60">The same offering works at home, with the whole family taking turns.</figcaption>
            </figure>

            <ol className="grid gap-x-10 gap-y-8 self-start sm:grid-cols-2 lg:col-start-1 lg:row-span-2 lg:row-start-1">
              {offeringSteps.map((step, index) => (
                <li key={step.title} className={`border-t border-gold/20 pt-5 ${index === offeringSteps.length - 1 && offeringSteps.length % 2 === 1 ? "sm:col-span-2" : ""}`}>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">Step {index + 1}</p>
                  <h3 className="mt-2 font-display text-xl text-white">{step.title}</h3>
                  <p className="mt-2 font-body text-[0.95rem] leading-relaxed text-festival-cream/75">{step.text}</p>
                </li>
              ))}
            </ol>

            <div className="self-start rounded-2xl border border-gold/25 bg-[#120c08] p-6 sm:p-8 lg:col-start-2 lg:row-start-2">
              <h3 className="font-display text-2xl text-white">The circles, in order</h3>
              <p className="mt-2 font-body text-sm text-festival-cream/70">Always clockwise, slowly, with your attention on the Lord.</p>
              <ol className="mt-6 space-y-5">
                {circles.map((circle) => (
                  <li key={circle.place} className="grid grid-cols-[3rem_1fr] items-center gap-4">
                    <span className="font-display text-4xl leading-none text-gold-light">{circle.count}<span className="ml-0.5 font-body text-base text-festival-cream/60">×</span></span>
                    <span>
                      <span className="block font-body text-sm font-semibold text-white">{circle.place}</span>
                      <span className="mt-2 flex flex-wrap gap-1.5" aria-hidden="true">
                        {Array.from({ length: circle.count }, (_, i) => (
                          <span key={i} className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_1px_rgba(230,184,92,0.5)]" />
                        ))}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 border-t border-gold/15 pt-4 font-body text-xs leading-relaxed text-festival-cream/65">
                Sixteen circles in all. If you lose count, simply continue with love. The offering is what matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Damodarastakam: the sing-along reader */}
      <section id="damodarastakam" className="scroll-mt-24">
        <div className="mx-auto max-w-5xl px-[clamp(1rem,5vw,2rem)] py-[clamp(3.5rem,9vw,7rem)]">
          <div className="text-center">
            <p className="eyebrow text-gold-light">Sing along</p>
            <h2 className="mt-4 font-display text-[clamp(2.25rem,7vw,3.75rem)] leading-none text-white">Damodarastakam</h2>
            <p className="mx-auto mt-5 max-w-xl font-body leading-relaxed text-festival-cream/75">
              Eight verses spoken by Satyavrata Muni, from the Padma Purana, sung during the lamp offering every day of Kartik.
            </p>
          </div>

          <div className="mt-10">
            <DamodarastakamReader />
          </div>

        </div>
      </section>

      {/* 7. Holy days inside the month, from the calendar */}
      {season && season.observances.length > 0 && (
        <section className="bg-[#1c130c]">
          <div className="content-width section-padding py-[clamp(3.5rem,9vw,6.5rem)]">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <p className="eyebrow text-gold-light">Inside the month · {season.year}</p>
                <h2 className="mt-4 font-display text-[clamp(2rem,5.5vw,3.25rem)] leading-[1.08] text-white">
                  Holy days that fall in Kartik
                </h2>
                <p className="mt-5 max-w-md font-body leading-relaxed text-festival-cream/75">
                  Kartik holds some of the year&apos;s biggest celebrations, including Govardhana Puja and Bhisma Pancaka.
                </p>
                <Link
                  href="/festivals"
                  className="mt-6 inline-flex items-center gap-2 font-body text-sm font-semibold text-gold-light underline-offset-4 hover:underline"
                >
                  Full festival calendar <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>

              <ol className="relative border-l border-gold/25 pl-7">
                {groupByDay([
                  { ...season.start, event: "Kartik begins", fast: undefined },
                  ...season.observances,
                  { ...season.end, event: "Kartik ends", fast: undefined },
                ]).map(({ first, items }) => {
                  const isPast = first.isoDate < today;
                  const isToday = first.isoDate === today;
                  return (
                    <li key={first.isoDate} className={`relative pb-7 last:pb-0 ${isPast ? "opacity-70" : ""}`}>
                      <span
                        className={`absolute -left-[2.05rem] top-1 h-3 w-3 rounded-full ${isToday ? "kartik-today-lamp bg-gold-light" : isPast ? "bg-gold/50" : "border border-gold/60 bg-[#1c130c]"}`}
                        aria-hidden="true"
                      />
                      <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
                        {shortDate(first)} · {first.day}
                        {isToday && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[0.65rem] tracking-normal text-[#1a1108]">Today</span>}
                      </p>
                      {items.map((item) => (
                        <div key={item.event} className="mt-1">
                          <p className={`font-display text-lg ${/^Kartik (begins|ends)$/.test(item.event) ? "text-gold-light" : "text-white"}`}>{item.event}</p>
                          {item.fast && <p className="font-body text-sm text-festival-cream/65">{item.fast}</p>}
                        </div>
                      ))}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* 8. Closing: three plain next steps */}
      <section className="border-t border-gold/15">
        <div className="content-width section-padding py-[clamp(3rem,8vw,5.5rem)]">
          <h2 className="max-w-2xl font-display text-[clamp(1.75rem,4.5vw,2.5rem)] leading-tight text-white">
            One lamp, offered with love, is enough to begin.
          </h2>
          <div className="mt-3"><SharePageButton title="Kartik, the Month of Damodara" label="Share with a friend" /></div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-gold/20 bg-gold/20 sm:grid-cols-3">
            {[
              { href: "/visit", icon: MapPin, title: "Plan your visit", text: "Directions, parking and temple hours." },
              { href: "/festivals#reminders", icon: Bell, title: "Get reminders", text: "Turn on festival reminders on this device." },
              { href: "/donate/festivals", icon: HandHeart, title: "Support the festivals", text: "Give towards Kartik and the temple's festival seva." },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="group flex items-start gap-4 bg-[#120c08] p-6 transition-colors hover:bg-[#1c130c] sm:p-7">
                <item.icon size={20} className="mt-1 shrink-0 text-gold-light" aria-hidden="true" />
                <span>
                  <span className="flex items-center gap-2 font-display text-lg text-white">
                    {item.title}
                    <ArrowRight size={15} className="text-gold-light transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                  <span className="mt-1 block font-body text-sm text-festival-cream/70">{item.text}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
