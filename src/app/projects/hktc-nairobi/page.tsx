import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import StickySubNav from "@/components/hktc/StickySubNav";
import Timeline from "@/components/hktc/Timeline";
import Gallery from "@/components/hktc/Gallery";
import FAQAccordion from "@/components/hktc/FAQAccordion";
import { templeInfo } from "@/data/site";
import { withSeo } from "@/lib/seo";
import StructuredPageData from "@/components/seo/StructuredPageData";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Home,
  Camera,
  Utensils,
  Users,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "HKTC Nairobi",
  description:
    "Hare Krishna Training Centre Nairobi serves university students with Prabhupada-centered study, daily classes, accommodation, prasadam, and devotional mentorship.",
}, "/projects/hktc-nairobi");

const stats = [
  { value: "10,000+", label: "Students Reached" },
  { value: "10+", label: "Years Active" },
  { value: "15+", label: "Nations" },
  { value: "2", label: "Student Homes" },
];

const principles = [
  "No meat eating",
  "No intoxication",
  "No illicit sex",
  "No gambling",
];

const dailyRhythm = [
  {
    title: "Daily Srimad-Bhagavatam",
    time: "8:00 A.M.",
    detail:
      "One verse is studied with Srila Prabhupada's purport and practical discussion for devotional life.",
  },
  {
    title: "HKTC Philosophy Classes",
    time: "7:00 P.M.",
    detail:
      "Monday, Tuesday, and Thursday classes serve residents and students from the wider community.",
  },
  {
    title: "Community Student Class",
    time: "8:00 P.M.",
    detail:
      "Wednesday and Saturday evening classes run for one hour and are followed by prasadam.",
  },
  {
    title: "Special Bhagavatam Class",
    time: "Saturday, 6:00 A.M.",
    detail:
      "A focused Saturday morning study session for deeper hearing, reflection, and discussion.",
  },
];

const studySequence = [
  "Nectar of Instruction",
  "Science of Self Realization",
  "Journey to Other Planets",
  "Laws of Nature",
  "Life Comes from Life",
  "Beyond Birth and Death",
  "On the Way to Krishna",
  "Sri Isopanisad",
  "Bhagavad-gita As It Is",
  "Srimad-Bhagavatam",
];

const careModel = [
  {
    icon: Home,
    title: "Two Nairobi Residences",
    text:
      "HKTC supports separate accommodation for male and female students, held under dedicated and unified guidance.",
  },
  {
    icon: Utensils,
    title: "Daily Sanctified Meals",
    text:
      "Students receive breakfast, lunch, and dinner in a purely vegetarian prasadam culture.",
  },
  {
    icon: Users,
    title: "University Student Community",
    text:
      "Most students are drawn from Nairobi's university community, with outreach extending across Kenya and beyond.",
  },
];

const studentLife = [
  {
    title: "Vedic Culture",
    text:
      "Students are introduced to Vaishnava culture through kirtan, japa, scripture, temple etiquette, festivals, service, and daily association.",
  },
  {
    title: "Food and Prasadam",
    text:
      "Life at HKTC includes a practical experience of sanctified vegetarian food, simple cooking culture, and honoring prasadam together.",
  },
  {
    title: "Attire and Identity",
    text:
      "Students naturally encounter tilaka, dhoti, kurta, sari, bead bags, and other visible parts of devotional culture in a guided setting.",
  },
  {
    title: "Guided Growth",
    text:
      "The centre gives students room to explore Krishna consciousness at their own pace, with expert guidance from senior devotees.",
  },
];

export default function HKTCNairobiPage() {
  return (
    <>
      <StructuredPageData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }, { name: "HKTC Nairobi", path: "/projects/hktc-nairobi" }]} />
      <PageHero
        title="HKTC"
        titleAccent="Nairobi"
        subtitle="Hare Krishna Training Centre"
        description="A Prabhupada-centered home for university students: study, sadhana, prasadam, service, and mentorship in the heart of Nairobi."
        image="/images/hktc/hktc-nairobi-hero-class.jpg"
        height="md"
        className="sm:min-h-[500px]"
        contentClassName="sm:!pb-10"
      />

      <StickySubNav />

      {/* OVERVIEW */}
      <section id="overview" className="scroll-mt-32 bg-temple-bg py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <SectionHeading eyebrow="Student Formation" title="University Life" accent="Rooted in Bhakti" eyebrowClassName="eyebrow mb-4 block" />
              <div className="mt-6 space-y-4 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
                <p>
                  The Hare Krishna Training Centre serves mostly university students, giving them a serious
                  spiritual foundation while they continue their academic and professional development in Nairobi.
                </p>
                <p>
                  The centre is headed by Govinda Prem Prabhu, Regional Secretary for ISKCON Nairobi and the devotee
                  guiding HKTC's student training, devotional education, and community care.
                </p>
                <p>
                  HKTC is part of the vision carried forward from Srila Prabhupada's mission for Africa. Public
                  reports record its work beginning in Kenya in April 2011, with an official opening on 11 January
                  2017 under the blessings of H.H. Gopal Krishna Goswami Maharaja.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="card-surface p-4">
                    <p className="font-display text-2xl font-semibold text-gold-ink sm:text-3xl">{stat.value}</p>
                    <p className="mt-1 font-body text-xs font-semibold uppercase tracking-[0.14em] text-ink/75">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="overflow-hidden card-surface shadow-card">
                <Image width={960} height={640} sizes="(max-width: 768px) 100vw, 50vw"
                  src="/images/hktc/govinda-prem-community-gathering.webp"
                  alt="Govinda Prem Prabhu with devotees at a gathering"
                  className="h-full w-full object-cover brightness-[1.03] contrast-[1.03]"
                />
              </div>
              <div className="border border-gold/25 bg-gold/10 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-1 shrink-0 text-gold" size={20} />
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">Four Regulative Principles</h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-ink/75">
                      Students are trained in disciplined devotional life through the four regulative principles:
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {principles.map((principle) => (
                        <span
                          key={principle}
                          className="border border-gold/25 bg-white px-3 py-2 font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink/75"
                        >
                          {principle}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT LIFE */}
      <section id="student-life" className="scroll-mt-32 bg-temple-brown py-section text-sand sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <span className="eyebrow mb-3 block text-gold">Life as a Student</span>
              <h2 className="font-display text-display-sm font-semibold leading-tight text-white">
                A Living Introduction
                <br />
                <em className="not-italic font-normal">to Vedic Culture</em>
              </h2>
              <p className="mt-5 font-body text-sm leading-relaxed text-sand/75 sm:text-base">
                Life at HKTC is a fascinating introduction to Vedic culture: its food, philosophy, attire, music,
                discipline, service mood, and community life. Students are not forced into an artificial pace. They
                explore, ask questions, practice, and grow under expert guidance.
              </p>
              <p className="mt-4 font-body text-sm leading-relaxed text-sand/75 sm:text-base">
                Public articles about the centre describe a rhythm of simple living and high thinking, with students
                rising early, attending temple programmes, chanting, studying, serving, cooking, taking prasadam, and
                building character through Srila Prabhupada's books.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {studentLife.map((item) => (
                <article key={item.title} className="border border-gold/15 bg-white/[0.06] p-5">
                  <h3 className="font-display text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-sand/75">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DAILY RHYTHM */}
      <section id="daily-rhythm" className="scroll-mt-32 bg-temple-cream py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="mb-10 max-w-3xl">
            <SectionHeading eyebrow="Daily Classes" title="Hearing," accent="Study and Prasadam" eyebrowClassName="eyebrow mb-3 block" />
            <p className="mt-5 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
              HKTC follows the same Prabhupada-centered learning culture described on the Learn page. Bhagavad-gita
              and Srimad-Bhagavatam are studied verse by verse, with attention to Srila Prabhupada's purports and
              the teachings of the Goswamis.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {dailyRhythm.map((item) => (
              <article key={item.title} className="card-surface p-5 shadow-card">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">{item.detail}</p>
                  </div>
                  <div className="flex w-fit shrink-0 items-center gap-2 bg-temple-brown px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.12em] text-sand">
                    <CalendarDays size={13} className="text-gold" />
                    {item.time}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK PROGRAMME */}
      <section id="book-programme" className="scroll-mt-32 bg-temple-bg py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <SectionHeading eyebrow="Book Programme" title="Sequential Study of" accent="Srila Prabhupada's Books" eyebrowClassName="eyebrow mb-3 block" />
              <p className="mt-5 max-w-3xl font-body text-sm leading-relaxed text-ink/75 sm:text-base">
                Students move through Srila Prabhupada's books in sequence, growing from introductory philosophy to
                deeper scriptural study. The year culminates in examinations and an annual graduation ceremony for
                those who complete the prescribed study.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {studySequence.map((book, index) => (
                  <div key={book} className="flex items-center gap-3 card-surface p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 font-body text-xs font-bold text-gold-ink">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-body text-sm font-medium text-ink/75">{book}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <aside className="overflow-hidden card-surface shadow-card">
                <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                  src="/images/hktc/hktc-nairobi-prabhupada-book-study.jpg"
                  alt="HKTC Nairobi students studying Srila Prabhupada's books"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="border-t border-temple-sand p-6">
                  <BookOpen className="mb-4 text-gold" size={28} />
                  <h3 className="font-display text-2xl font-semibold text-ink">Prabhupada Book Study</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">
                    Students study directly from Srila Prabhupada's books, with reading, written work, discussion,
                    and examinations woven into the yearly programme.
                  </p>
                </div>
              </aside>

              <aside className="border border-gold/25 bg-temple-brown p-6 text-sand shadow-card">
                <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                  src="/images/hktc/hktc-nairobi-graduation-certificates.jpg"
                  alt="HKTC Nairobi students after graduation with certificates"
                  className="mb-6 aspect-[16/9] w-full object-cover"
                />
                <GraduationCap className="mb-5 text-gold" size={30} />
                <h3 className="font-display text-2xl font-semibold text-white">Graduation Ceremony</h3>
                <p className="mt-4 font-body text-sm leading-relaxed text-sand/75">
                  Students celebrate the completion of their studies and examinations at the HKTC graduation ceremony. View photographs from the occasion in the graduation album.
                </p>
                <a
                  href="https://photos.app.goo.gl/MIZfuQWWgNPvBuG43"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target mt-6 inline-flex items-center gap-2 border-b border-gold/50 pb-1 font-body text-sm font-semibold text-gold transition-colors hover:text-white"
                >
                  View Graduation Album
                  <ExternalLink size={13} />
                </a>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline section */}
      <section id="timeline" className="scroll-mt-32 bg-temple-brown py-section text-sand sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="mb-10 max-w-2xl">
            <span className="eyebrow mb-3 block text-gold">Our Story</span>
            <h2 className="font-display text-display-sm font-semibold leading-tight text-white">
              A Decade of
              <br />
              <em className="not-italic font-normal">Building Students</em>
            </h2>
          </div>
          <div className="text-sand [&_.eyebrow]:text-gold/75 [&_h3]:text-white [&_p]:text-sand/62 [&_li]:border-sand/15">
            <Timeline />
          </div>
        </div>
      </section>

      {/* Gallery section */}
      <section id="gallery" className="scroll-mt-32 bg-temple-cream py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="mb-10 max-w-2xl">
            <SectionHeading eyebrow="Moments at HKTC" title="Life in" accent="Pictures" eyebrowClassName="eyebrow mb-3 block" />
            <p className="mt-5 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
              A glimpse into daily life at HKTC Nairobi. Tap any photo to see it full size.
            </p>
          </div>
          <Gallery />
          <a
            href="https://www.instagram.com/hktc.africa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-link tap-target mt-6 inline-flex items-center gap-2 text-gold-ink hover:text-ink"
          >
            <Camera size={14} />
            More on Instagram @hktc.africa
            <ExternalLink size={13} />
          </a>
        </div>
      </section>

      {/* STUDENT CARE */}
      <section id="student-care" className="scroll-mt-32 bg-temple-bg py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <SectionHeading eyebrow="Student Care" title="Accommodation," accent="Meals and Guidance" eyebrowClassName="eyebrow mb-3 block" />
              <p className="mt-5 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
                HKTC is more than a classroom. It supports a protected devotional environment where students can
                learn, live, serve, eat prasadam, and receive guidance in Krishna consciousness.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {careModel.map((item) => (
                <article key={item.title} className="card-surface p-5 shadow-card">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <item.icon size={20} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section id="faq" className="scroll-mt-32 bg-temple-cream py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="mb-10 max-w-2xl">
            <SectionHeading eyebrow="Common Questions" title="Frequently" accent="Asked Questions" eyebrowClassName="eyebrow mb-3 block" />
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* SUPPORT */}
      <section id="support" className="scroll-mt-32 bg-temple-brown py-section text-sand sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <span className="eyebrow mb-3 block text-gold">Support HKTC</span>
              <h2 className="font-display text-display-sm font-semibold leading-tight text-white">
                Help Sponsor
                <br />
                <em className="not-italic font-normal">Student Formation</em>
              </h2>
              <p className="mt-5 max-w-2xl font-body text-sm leading-relaxed text-sand/75 sm:text-base">
                Support can help provide study materials, prasadam, student accommodation, retreats, examinations,
                visiting speakers, and the daily service that keeps the centre running.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink variant="primary" href="/donate/students" className="justify-center">
                  Support Student Sponsorship
                </ButtonLink>
                <Link
                  href="/contact"
                  className="min-h-11 inline-flex items-center justify-center gap-2 border border-gold/40 px-5 py-3 font-body text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-white"
                >
                  Speak to the Temple
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <a
                href="https://www.instagram.com/hktc.africa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 border border-gold/20 bg-white/[0.06] p-5 transition-colors hover:border-gold/45 hover:bg-white/[0.09]"
              >
                <div className="flex items-center gap-4">
                  <Camera className="text-gold" size={24} />
                  <div>
                    <p className="font-display text-xl font-semibold text-white">Follow HKTC Africa</p>
                    <p className="mt-1 font-body text-xs uppercase tracking-[0.14em] text-sand/75">
                      Classes, students, and updates
                    </p>
                  </div>
                </div>
                <ExternalLink className="shrink-0 text-gold" size={16} />
              </a>

              <div className="border border-gold/15 bg-white/[0.05] p-5">
                <BookOpen className="mb-4 text-gold" size={24} />
                <h3 className="font-display text-xl font-semibold text-white">Further Reading</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-sand/75">
                  Explore reports and stories about the students, daily life, and development of the Hare Krishna Training Centre.
                </p>
                <div className="mt-5 flex flex-wrap gap-4">
                  <a
                    href="https://peopledaily.digital/lifestyle/young-hare-krishna-monks-revive-simple-way-of-living"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link tap-target text-gold"
                  >
                    People Daily
                  </a>
                  <a
                    href="https://iskconnews.org/kenyas-hare-krishna-training-centre-gives-students-ashram-experience/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link tap-target text-gold"
                  >
                    Ashram Experience
                  </a>
                  <a
                    href="https://iskconnews.org/students-join-nairobi-hare-krishna-training-centre/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link tap-target text-gold"
                  >
                    ISKCON News
                  </a>
                  <a
                    href="https://www.dandavats.com/?p=56815"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link tap-target text-gold"
                  >
                    Dandavats Report
                  </a>
                  <a
                    href="https://www.dandavats.com/?p=26003"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link tap-target text-gold"
                  >
                    Dandavats HKTC
                  </a>
                </div>
              </div>

              <div className="border border-gold/15 bg-white/[0.05] p-5">
                <HeartHandshake className="mb-4 text-gold" size={24} />
                <p className="font-body text-sm leading-relaxed text-sand/75">
                  For visits, sponsorship, class enquiries, or student support, contact {templeInfo.name} through
                  the temple office.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
