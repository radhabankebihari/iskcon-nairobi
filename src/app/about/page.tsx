import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { eastAfricaCentres, sevenPurposes, templeInfo } from "@/data/site";
import { withSeo } from "@/lib/seo";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Globe2,
  HeartHandshake,
  Home,
  Mail,
  MapPin,
  Music,
  Phone,
  Utensils,
  Users,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "About",
  description:
    "Learn the story, beliefs, worship, community programmes, and Nairobi mission of Sri Sri Radha Bankebihari Temple, ISKCON Nairobi.",
}, "/about");

const storyMilestones = [
  {
    year: "1969",
    title: "A Nairobi beginning",
    text:
      "ISKCON Nairobi began in the early years of Srila Prabhupada's global movement, making Nairobi one of the first African cities to receive an ISKCON centre.",
  },
  {
    year: "1972",
    title: "Radha Bankebihari installed",
    text:
      "Srila Prabhupada personally installed Sri Sri Radha Bankebihari, giving the temple a direct living connection with ISKCON's Founder-Acarya.",
  },
  {
    year: "1994",
    title: "The temple expands",
    text:
      "As the congregation grew, the temple building expanded and Sri Sri Sita Rama Lakshmana Hanumana were installed for worship.",
  },
  {
    year: "Today",
    title: "Open to all Nairobi",
    text:
      "The temple continues as a home for worship, kirtan, learning, prasadam, student outreach, public festivals, and service across East Africa.",
  },
];

const beliefs = [
  {
    icon: Globe2,
    title: "One spiritual family",
    text:
      "Every living being is an eternal spiritual soul, and all of us are related through our common relationship with Krishna.",
  },
  {
    icon: BookOpen,
    title: "Scripture and study",
    text:
      "Our teaching is grounded in Bhagavad-gita, Srimad-Bhagavatam, Chaitanya Charitamrita, and Srila Prabhupada's books.",
  },
  {
    icon: Music,
    title: "Chanting and kirtan",
    text:
      "The chanting of the holy names is the heart of our practice, both inside the temple and in public sankirtan.",
  },
  {
    icon: Utensils,
    title: "Prasadam culture",
    text:
      "Sanctified vegetarian meals are shared as hospitality, worship, education, and community care.",
  },
];

const deities = [
  "Sri Sri Radha Bankebihari",
  "Sri Sri Sita Rama Lakshmana Hanumana",
  "Sri Sri Jagannath Baladeva Subhadra",
];

const programmes = [
  {
    icon: CalendarDays,
    title: "Sunday Feast and Sunday School",
    text:
      "Every Sunday, 12:00 to 2:00 P.M.: kirtan, a spiritual talk, and a feast for all, with Sunday School for children aged 3 to 18.",
    href: "/learn",
  },
  {
    icon: HeartHandshake,
    title: "Food for Life",
    text:
      "Sanctified vegetarian meals are prepared and distributed through temple programmes, student outreach, and community care.",
    href: "/projects/food-for-life",
  },
  {
    icon: Music,
    title: "Harinam Sankirtan",
    text:
      "Public chanting carries the sound of the maha-mantra through Nairobi's streets and communities.",
    href: "/media",
  },
  {
    icon: BookOpen,
    title: "Hare Krishna Training Centre",
    text:
      "A student programme for university youth, grounded in Vaishnava philosophy, character formation, and Srila Prabhupada's books.",
    href: "/projects/hktc-nairobi",
  },
  {
    icon: Home,
    title: "Namahatta and Home Programmes",
    text:
      "Congregational gatherings bring kirtan, class, prasadam, and devotional support into homes and neighbourhoods.",
    href: "/contact",
  },
  {
    icon: Users,
    title: "Youth Character Classes",
    text:
      "Interactive Sunday sessions help children and young people grow through values, personality development, and spiritual culture.",
    href: "/learn",
  },
];

const visitCards = [
  { label: "Address", value: templeInfo.shortAddress },
  { label: "Open Daily", value: templeInfo.hours },
  { label: "Contact", value: `${templeInfo.phoneDisplay} | ${templeInfo.email}` },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About ISKCON"
        titleAccent="Nairobi"
        subtitle="Sri Sri Radha Bankebihari Temple"
        description="A temple for all: worship, learning, prasadam, kirtan, service, and community in the heart of Nairobi."
        image="/images/iskcon-nairobi-aerial.jpg"
        height="md"
        className="sm:min-h-[500px]"
      />

      <section className="bg-temple-bg py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionHeading eyebrow="A Temple for All" title="Welcome to" accent="Radha Bankebihari Mandir" eyebrowClassName="eyebrow mb-4 block" />
              <div className="mt-6 space-y-4 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
                <p>
                  For over 50 years, Sri Sri Radha Bankebihari Mandir has stood as a place of worship, learning,
                  and welcome in Nairobi. Whether you grew up within this tradition, are curious about Eastern
                  philosophy, or simply need a quiet place to sit, you are welcome here.
                </p>
                <p>
                  ISKCON Nairobi is one of the oldest ISKCON centres in Africa. It carries the personal imprint of
                  Srila A.C. Bhaktivedanta Swami Prabhupada, whose vision continues to inspire a welcoming
                  spiritual community serving people throughout Kenya.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/srila-prabhupada"
                  className="min-h-11 inline-flex items-center justify-center gap-2 border border-gold/40 px-5 py-3 font-body text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-white"
                >
                  Nairobi and Prabhupada
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Image width={1170} height={1170} sizes="(max-width: 768px) 100vw, 50vw" unoptimized
                src="/images/hero-radha-bankebihari-darshan.webp"
                alt="Sri Sri Radha Bankebihari on the ISKCON Nairobi altar"
                className="hidden aspect-[4/5] w-full object-cover shadow-card sm:block"
              />
              <div className="grid gap-4">
                <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                  src="/images/prabhupada/srila-prabhupada-seated-smiling.jpg"
                  alt="Srila Prabhupada"
                  className="aspect-[4/5] w-full object-cover object-top shadow-card sm:mt-10"
                />
                <div className="border border-gold/25 bg-gold/10 p-5">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    Founder-Acarya
                  </p>
                  <p className="mt-2 font-display text-xl leading-tight text-ink">
                    The doors he asked us to open are still open.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-temple-brown py-section text-sand sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="mb-10 max-w-3xl">
            <span className="eyebrow mb-3 block text-gold">Our Story</span>
            <h2 className="font-display text-display-sm font-semibold leading-tight text-white">
              Nairobi was never meant
              <br />
              <em className="not-italic font-normal">to be a closed temple</em>
            </h2>
            <p className="mt-5 font-body text-sm leading-relaxed text-sand/75 sm:text-base">
              Srila Prabhupada's instruction shaped the temple from the beginning: the mission here was not to serve
              only people already familiar with the tradition. It was to make Krishna consciousness accessible to
              Nairobi and to Kenya.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {storyMilestones.map((item) => (
              <article key={item.year} className="border border-gold/15 bg-white/[0.06] p-5">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  {item.year}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-sand/75">{item.text}</p>
              </article>
            ))}
          </div>

          <Image width={1170} height={1170} sizes="100vw" unoptimized
            src="/images/hero-radha-bankebihari-darshan.webp"
            alt="Sri Sri Radha Bankebihari on the ISKCON Nairobi altar"
            className="mt-8 aspect-[4/5] w-full object-cover shadow-card sm:hidden"
          />
        </div>
      </section>

      <section className="bg-temple-cream py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <SectionHeading eyebrow="What We Believe" title="Ancient Philosophy," accent="Living Practice" eyebrowClassName="eyebrow mb-3 block" />
              <p className="mt-5 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
                ISKCON belongs to the Gaudiya Vaishnava tradition, a devotional path within the broader Vedic
                tradition that traces its lineage to Sri Chaitanya Mahaprabhu. Its central teaching is simple:
                every living being is spiritual, and our deepest relationship is with Krishna.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {beliefs.map((item) => (
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

          <div className="mt-12 border-t border-gold/25 pt-10">
            <div className="max-w-2xl">
              <span className="eyebrow mb-3 block">Our Mission</span>
              <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                The seven purposes of ISKCON
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
                Srila Prabhupada set out these purposes when he founded ISKCON in New York in 1966. They still guide
                every temple programme.
              </p>
            </div>
            <ol className="mt-8 grid gap-x-8 gap-y-5 md:grid-cols-2">
              {sevenPurposes.map((purpose, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-lg font-semibold text-gold-ink">
                    {index + 1}
                  </span>
                  <p className="font-body text-sm leading-relaxed text-ink/80">{purpose}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-temple-bg py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <SectionHeading eyebrow="Life at the Temple" title="Worship," accent="Service and Community" eyebrowClassName="eyebrow mb-3 block" />
              <p className="mt-5 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
                The temple's rhythm is made of darshan, arati, kirtan, scriptural study, prasadam, festivals,
                service projects, family gatherings, youth education, and public outreach.
              </p>

              <div className="mt-8 card-surface p-5 shadow-card">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  Presiding Deities
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {deities.map((deity) => (
                    <div key={deity} className="border border-gold/20 bg-gold/10 p-3">
                      <p className="font-display text-lg leading-tight text-ink">{deity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
              src="/images/hero-ratha-yatra-kenya.jpg"
              alt="ISKCON Nairobi public festival procession"
              className="aspect-[4/3] w-full object-cover shadow-card-hover"
            />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group card-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-gold/45 hover:shadow-card-hover"
              >
                <item.icon className="mb-4 text-gold" size={22} />
                <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-gold">
                  {item.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">{item.text}</p>
                <div className="text-link mt-5 inline-flex items-center gap-2 text-gold-ink">
                  Explore
                  <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-temple-cream py-section sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="mb-8 max-w-2xl">
            <SectionHeading eyebrow="ISKCON East Africa" title="Sister temples" accent="across the region" eyebrowClassName="eyebrow mb-3 block" />
            <p className="mt-4 font-body text-sm leading-relaxed text-ink/75 sm:text-base">
              Travelling beyond Nairobi? These ISKCON centres welcome visitors for darshan, kirtan, and prasadam.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {eastAfricaCentres.map((centre) => (
              <li key={centre.city} className="card-surface p-5">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold-ink">{centre.city}</p>
                <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-ink">{centre.temple}</h3>
                <p className="mt-3 flex gap-2 font-body text-sm leading-relaxed text-ink/75">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  {centre.address}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {centre.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="tap-target inline-flex items-center gap-2 font-body text-sm text-ink/80 hover:text-primary"
                    >
                      <Phone size={14} className="text-gold" aria-hidden="true" />
                      {phone}
                    </a>
                  ))}
                </div>
                {centre.email && (
                  <a
                    href={`mailto:${centre.email}`}
                    className="tap-target mt-1 inline-flex max-w-full items-center gap-2 break-all font-body text-sm text-ink/80 hover:text-primary"
                  >
                    <Mail size={14} className="shrink-0 text-gold" aria-hidden="true" />
                    {centre.email}
                  </a>
                )}
                {centre.website && (
                  <a
                    href={centre.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link tap-target mt-3 text-primary"
                  >
                    Visit website <ArrowRight size={13} aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-temple-brown py-section-sm text-sand">
        <div className="content-width section-padding">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="eyebrow mb-3 block text-gold">Visit Us</span>
              <h2 className="font-display text-display-sm font-semibold leading-tight text-white">
                Come for darshan,
                <br />
                <em className="not-italic font-normal">prasadam or a quiet moment</em>
              </h2>
              <p className="mt-5 font-body text-sm leading-relaxed text-sand/75 sm:text-base">
                No prior experience with the tradition is required. Come with an open mind, respectful dress, and a
                willingness to experience temple life.
              </p>
            </div>

            <div className="grid gap-3">
              {visitCards.map((item) => (
                <div key={item.label} className="border border-gold/15 bg-white/[0.06] p-4">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    {item.label}
                  </p>
                  <p className="mt-2 whitespace-pre-line font-body text-sm leading-relaxed text-sand/75">{item.value}</p>
                </div>
              ))}
              <ButtonLink variant="primary" href="/visit" className="mt-2 justify-center">
                Plan your visit
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
