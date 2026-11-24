import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Baby, Bell, BookOpen, CalendarDays, Clock, Download, Gift, GraduationCap, HeartHandshake, Home, LibraryBig, MapPin, MessageCircle, Music, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";
import SharePageButton from "@/components/ui/SharePageButton";
import { gitaJayanti2026, gitaSponsorship } from "@/data/gitaJayanti";
import { isInSeason } from "@/lib/seasonalSlides";

// Hourly, so the seasonal Gita Jayanti section ends close to its date.
export const revalidate = 3600;

/** When this page was rendered; regenerated hourly (see revalidate). */
function renderedAt() {
  return Date.now();
}

export const metadata = withSeo({
  title: "Bhagavad Gita Classes in Nairobi",
  description:
    "Daily Srimad-Bhagavatam classes, Bhagavad-gita study, Sunday School, Bhakti Sastri, HKTC philosophy classes, Bhakti Vriksha, Ladies Sanga, Namahatta, and personal guidance at ISKCON Nairobi.",
}, "/learn");

const learningPaths = [
  {
    icon: BookOpen,
    eyebrow: "Daily Scripture",
    title: "Srimad-Bhagavatam Class",
    timing: "Daily at 7:30 A.M.",
    description:
      "The morning class studies one verse of Srimad-Bhagavatam with Srila Prabhupada's purport, discussion, and practical application for devotional life.",
  },
  {
    icon: BookOpen,
    eyebrow: "Verse by Verse",
    title: "Bhagavad-gita Classes",
    timing: "Covered in regular temple and HKTC classes",
    description:
      "Deepen your understanding of spiritual wisdom, one verse at a time, following Bhagavad-gita As It Is and the conclusions taught by Srila Prabhupada and the Goswamis.",
    facilitator: "Aishvarya Lila Devi Dasi",
  },
  {
    icon: CalendarDays,
    eyebrow: "Every Sunday",
    title: "Sunday Afternoon Programme",
    timing: "Sundays, 12:00 to 2:00 P.M.",
    description:
      "Join us every Sunday afternoon for kirtan, a spiritual talk, and a delicious feast, open to the whole community.",
  },
  {
    icon: Baby,
    eyebrow: "Ages 3 to 18",
    title: "Sunday School",
    timing: "Sundays, 12:00 to 2:00 P.M.",
    description:
      "Interactive Krishna conscious learning for children through stories, activities, kirtan, and fun, while parents attend the Sunday programme.",
  },
];

const hktcSchedule = [
  { days: "Monday, Tuesday, Thursday", time: "7:00 P.M.", note: "HKTC philosophy class" },
  { days: "Wednesday, Saturday", time: "8:00 P.M.", note: "Community student class" },
];

const formalStudyTracks = [
  {
    title: "Bhakti Sastri",
    scope: "Bhagavad-gita, Nectar of Devotion, Nectar of Instruction, and Sri Isopanisad",
    description:
      "A structured study path for devotees who want deeper grounding in Srila Prabhupada's foundational books.",
    facilitator: "Sri Gauranga Das",
  },
  {
    title: "Bhakti Vaibhava",
    scope: "A systematic study of Srimad-Bhagavatam",
    description:
      "A more advanced course track for serious students who want to study Bhagavatam with discipline, guidance, and service mood.",
    facilitator: "Sri Gauranga Das",
  },
];

type CommunityItem = {
  icon: typeof Users;
  title: string;
  description: string;
  timing?: string;
  facilitator?: string;
};

const communityLearning: CommunityItem[] = [
  {
    icon: Users,
    title: "Bhakti Vriksha",
    description:
      "Small-group devotional gatherings for learning, discussion, kirtan, and meaningful association.",
    facilitator: "Kaivalya Krishna Das",
  },
  {
    icon: HeartHandshake,
    title: "Ladies Sanga",
    description:
      "A warm gathering for ladies, with kirtan, Bhagavad-gita discussion, and devotional association.",
    facilitator: "Caitanya Devi Dasi & Mohan Priya Devi Dasi",
  },
  {
    icon: Home,
    title: "Namahatta Gatherings",
    description:
      "Devotional gatherings held in homes across the community, with kirtan and discussion. You can also invite devotees to your own home.",
    facilitator: "Rukma Das",
  },
  {
    icon: Music,
    title: "Six-Hour Kirtans",
    description: "Immerse yourself in uplifting congregational chanting and devotional music.",
    timing: "Monthly, with dates announced regularly",
  },
  {
    icon: Bell,
    title: "Weekend Seminars",
    description:
      "The temple regularly invites visiting devotees and speakers for seminars. Watch the temple notice board for dates, topics, and speaker announcements.",
  },
  {
    icon: MessageCircle,
    title: "Personal Guidance",
    description:
      "Reach out to the temple if you need help understanding a subject, making spiritual decisions, or applying Krishna consciousness in daily life.",
  },
];

/** Gita Jayanti: shown at the top of Learn until the celebration day ends. */
function GitaJayantiSection() {
  const g = gitaJayanti2026;
  return (
    <section id="gita-jayanti" className="relative scroll-mt-24 overflow-hidden bg-dusk text-white">
      <Image src="/images/book-marathon/bhagavad-gita-hero-desktop-composed.webp" alt="" fill sizes="100vw" className="hidden object-cover object-right sm:block" />
      <Image src="/images/book-marathon/bhagavad-gita-hero-mobile-composed.webp" alt="" fill sizes="100vw" className="object-cover object-top sm:hidden" />
      <div className="absolute inset-0 bg-gradient-to-r from-dusk/95 via-dusk/75 to-dusk/10 max-sm:bg-gradient-to-b max-sm:from-dusk/10 max-sm:via-dusk/60 max-sm:to-dusk/95" />
      <div className="content-width section-padding relative z-10 flex min-h-[560px] flex-col justify-end pb-14 pt-[22rem] sm:min-h-[520px] sm:justify-center sm:py-20">
        <div className="max-w-xl">
          <span className="eyebrow mb-4 block text-gold">Gita Jayanti &middot; {g.shortDate}</span>
          <h2 className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-[1.05] text-white">Hear the whole Gita, together</h2>
          <p className="mt-5 font-body leading-relaxed text-white/85">
            Gita Jayanti honours the day Lord Krishna spoke the Bhagavad-gita to Arjuna. Join devotees and guests at the
            temple for a complete recitation of the Gita, followed by prasadam. Everyone is welcome.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-body text-sm font-semibold text-white/90">
            <li className="inline-flex items-center gap-2"><CalendarDays size={16} className="text-gold" aria-hidden="true" />{g.date}</li>
            <li className="inline-flex items-center gap-2"><Clock size={16} className="text-gold" aria-hidden="true" />From {g.startTime}</li>
            <li className="inline-flex items-center gap-2"><MapPin size={16} className="text-gold" aria-hidden="true" />ISKCON Nairobi</li>
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink variant="primary" href="#sponsor-a-gita">Sponsor a Gita</ButtonLink>
            <a href={g.poster} download className="inline-flex min-h-11 items-center gap-2 font-body text-sm font-semibold text-gold-light underline underline-offset-4 hover:text-white">
              <Download size={16} aria-hidden="true" /> Download the poster
            </a>
            <SharePageButton title="Gita Jayanti at ISKCON Nairobi" text={`${g.date}, complete Bhagavad-gita recitation from ${g.startTime}`} label="Share" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Sponsor a Bhagavad-gita: shown all year, details from the official poster. */
function SponsorGitaSection() {
  const s = gitaSponsorship;
  return (
    <section id="sponsor-a-gita" className="scroll-mt-24 bg-white py-14 sm:py-20">
      <div className="content-width section-padding grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <span className="eyebrow mb-4 block">Give the gift of the Gita</span>
          <h2 className="section-title max-w-xl">Sponsor a Bhagavad-gita</h2>
          <p className="mt-5 max-w-xl font-body leading-relaxed text-ink/75">
            Help place Bhagavad-gita As It Is in someone&apos;s hands. Each copy is {s.pricePerCopy}, and the temple&apos;s book
            distributors share it with students, visitors, and seekers across Nairobi.
          </p>
          <dl className="mt-7 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-l-2 border-gold pl-5 font-body text-sm text-ink/80">
            <dt className="font-semibold">M-Pesa Paybill</dt><dd>{s.mpesaPaybill}</dd>
            <dt className="font-semibold">Account</dt><dd>{s.mpesaAccount}</dd>
            <dt className="font-semibold">Per copy</dt><dd>{s.pricePerCopy}</dd>
          </dl>
          <p className="mt-4 font-body text-sm text-ink/70">
            Questions about sponsoring: <a href="tel:+254753419194" className="font-semibold text-primary underline underline-offset-4">0753 419 194</a>
          </p>
        </div>
        <div className="flex items-center gap-5 border-t border-gold/40 py-8 lg:border-l lg:border-t-0 lg:pl-10">
          <Gift size={36} className="shrink-0 text-primary" aria-hidden="true" />
          <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">One book can begin a lifelong conversation.</p>
        </div>
      </div>
    </section>
  );
}

export default function LearnPage() {
  const showGitaJayanti = isInSeason(gitaJayanti2026.season, renderedAt());
  return (
    <>
      <PageHero
        title="Learn"
        titleAccent="& Study"
        subtitle="Spiritual Education"
        description="All our philosophy is Prabhupada-centered: rooted in Srila Prabhupada's books, the teachings of the Goswamis, and practical devotional life."
        image="/images/learn/krishna-student-refined-optimized.webp"
        imageAlt="A devotional painting of young Krishna with Yashoda and Balarama in Vrindavan"
        imageClassName="sm:object-[center_20%]"
        className="sm:min-h-[500px]"
      />

      {showGitaJayanti && <GitaJayantiSection />}

      <section className="bg-temple-bg pt-section-sm pb-section">
        <div className="content-width section-padding">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <SectionHeading eyebrow="Programmes & Classes" title="Study Through" accent="Hearing and Discussion" eyebrowClassName="eyebrow mb-3 block" />
            <p className="mx-auto mt-5 max-w-2xl font-body text-sm leading-relaxed text-ink/75 sm:text-base">
              ISKCON Nairobi offers learning through daily temple classes, the Sunday programme and Sunday School,
              Bhakti Sastri and Bhakti Vaibhava courses, weekly HKTC philosophy sessions, and community sangas.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {learningPaths.map((path) => (
              <article
                key={path.title}
                className="group card-surface p-6 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-card-hover"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <path.icon size={19} />
                </div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  {path.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink transition-colors group-hover:text-gold">
                  {path.title}
                </h3>
                <div className="mt-4 flex items-center gap-2 border-y border-temple-sand py-3 font-body text-xs font-semibold uppercase tracking-[0.12em] text-ink/75">
                  <Clock size={13} className="text-gold" />
                  {path.timing}
                </div>
                <p className="mt-4 font-body text-sm leading-relaxed text-ink/75">{path.description}</p>
                {"facilitator" in path && path.facilitator && (
                  <p className="mt-3 font-body text-xs font-semibold text-gold-ink">Facilitator: {path.facilitator}</p>
                )}
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
            <article className="overflow-hidden card-surface shadow-card">
              <div className="grid h-full gap-0 sm:grid-cols-[0.76fr_1fr]">
                <div className="relative min-h-[14rem] overflow-hidden bg-dusk">
                  <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                    src="/images/learn/krishna-guru-study.jpeg"
                    alt="Lord Krishna learning from His guru"
                    className="h-full w-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dusk/40 to-transparent" />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-7">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <LibraryBig size={19} />
                  </div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    Srila Prabhupada's Books
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink">
                    Books Available at the Temple
                  </h3>
                  <p className="mt-4 font-body text-sm leading-relaxed text-ink/75">
                    Srila Prabhupada&apos;s books are available through our temple office. Ask us where to begin.
                  </p>
                </div>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {formalStudyTracks.map((track) => (
                <article key={track.title} className="flex flex-col justify-between border border-temple-sand bg-temple-cream/65 p-6">
                  <div>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <GraduationCap size={19} />
                    </div>
                    <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                      Formal Study
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-ink">{track.title}</h3>
                    <p className="mt-3 font-body text-xs font-semibold uppercase tracking-[0.12em] text-ink/75">
                      {track.scope}
                    </p>
                    <p className="mt-4 font-body text-sm leading-relaxed text-ink/75">{track.description}</p>
                    <p className="mt-3 font-body text-xs font-semibold text-gold-ink">Facilitator: {track.facilitator}</p>
                  </div>
                  <Link
                    href="/contact"
                    className="text-link tap-target mt-6 inline-flex items-center gap-2 self-start text-gold-ink transition-all hover:gap-3"
                  >
                    Ask about this course
                    <ArrowRight size={12} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SponsorGitaSection />

      <section className="bg-temple-cream pt-8 pb-16">
        <div className="content-width section-padding">
          <div className="grid gap-10 lg:grid-cols-[0.84fr_1fr] lg:items-start">
            <div>
              <span className="eyebrow mb-3 block">HKTC Philosophy Classes</span>
              <h2 className="font-display text-display-sm font-semibold leading-tight text-ink">
                Regular Evening
                <br />
                <em className="not-italic font-normal">Study at HKTC</em>
              </h2>
              <p className="mt-5 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
                The Hare Krishna Training Centre helps train and guide students in Krishna consciousness, with
                philosophy classes through the week. Each class is one hour, includes students from the wider
                community, and prasadam is served afterward. Facilitator: Govinda Prem Prabhu.
              </p>
            </div>

            <div className="grid gap-4">
              {hktcSchedule.map((item) => (
                <div key={item.days} className="card-surface p-5 shadow-card">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-gold-ink">
                        {item.note}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold text-ink">{item.days}</h3>
                    </div>
                    <div className="flex w-fit items-center gap-2 bg-temple-brown px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.12em] text-sand">
                      <Clock size={13} className="text-gold" />
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
              <div className="border border-gold/30 bg-gold/10 p-5">
                <p className="font-body text-sm leading-relaxed text-ink/75">
                  Class topics may include Bhagavad-gita, Srimad-Bhagavatam, devotional practice, Vaishnava
                  philosophy, character formation, and practical service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-temple-brown pt-8 pb-16 text-sand">
        <div className="content-width section-padding">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-3 block text-gold">Community Learning</span>
            <h2 className="font-display text-display-sm font-semibold leading-tight text-white">
              Seminars, Sangas
              <br />
              <em className="not-italic font-normal">and Personal Guidance</em>
            </h2>
            <p className="mt-5 font-body text-sm leading-relaxed text-sand/75 sm:text-base">
              Learning also happens through association: small groups, sangas, home gatherings, kirtan,
              visiting speakers, and direct guidance from devotees.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {communityLearning.map((item) => (
              <article key={item.title} className="border border-gold/15 bg-white/[0.06] p-5">
                <item.icon className="mb-4 text-gold" size={21} />
                <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-sand/75">{item.description}</p>
                {(item.timing || item.facilitator) && (
                  <p className="mt-3 font-body text-xs font-semibold text-gold">
                    {item.timing ?? `Facilitator: ${item.facilitator}`}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink variant="primary" href="/contact" className="justify-center">
              Ask About Classes
            </ButtonLink>
            <Link
              href="/projects/hktc-nairobi"
              className="min-h-11 inline-flex items-center justify-center gap-2 border border-gold/40 px-5 py-3 font-body text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-white"
            >
              Explore HKTC Nairobi
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
