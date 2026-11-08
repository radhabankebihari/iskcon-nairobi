import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Baby, Bell, BookOpen, CalendarDays, Clock, GraduationCap, HeartHandshake, Home, LibraryBig, MessageCircle, Music, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "Learn",
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

export default function LearnPage() {
  return (
    <>
      <PageHero
        title="Learn"
        titleAccent="& Study"
        subtitle="Spiritual Education"
        description="All our philosophy is Prabhupada-centered: rooted in Srila Prabhupada's books, the teachings of the Goswamis, and practical devotional life."
        image="/images/learn/krishna-student-refined.webp"
        imageAlt="A devotional painting of young Krishna with Yashoda and Balarama in Vrindavan"
        imageClassName="sm:object-[center_20%]"
        className="sm:min-h-[500px]"
      />

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
                    The temple stocks Srila Prabhupada's books through the office, gift shop, or on request by contacting the temple. Visitors and students are welcome to ask for guidance on where to begin.
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
                community, and prasadam is served afterward. Facilitator: Govinda Prem Das.
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
