import Image from "next/image";
import { withSeo } from "@/lib/seo";
import {
  ArrowRight,
  BookOpen,
  Globe2,
  HeartHandshake,
  MapPin,
  Ship,
  Sparkles,
  Utensils,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "Srila Prabhupada",
  description:
    "A tribute to His Divine Grace A.C. Bhaktivedanta Swami Prabhupada, Founder-Acarya of ISKCON, and his personal connection with Nairobi and East Africa.",
}, "/srila-prabhupada");

const timeline = [
  {
    year: "1896",
    title: "Born Abhay Charan De",
    text: "Srila Prabhupada appeared in Calcutta on September 1, 1896, in a Vaishnava family devoted to Krishna.",
  },
  {
    year: "1922",
    title: "The instruction",
    text: "He met Srila Bhaktisiddhanta Sarasvati Thakura, who asked him to share Sri Caitanya Mahaprabhu's teachings in English.",
  },
  {
    year: "1965",
    title: "Across the ocean",
    text: "At sixty-nine, he sailed to America on the Jaladuta with trunks of books and a mission larger than any institution he yet had.",
  },
  {
    year: "1966",
    title: "ISKCON founded",
    text: "In New York City he incorporated the International Society for Krishna Consciousness, beginning a worldwide movement from a small storefront.",
  },
  {
    year: "1971-72",
    title: "Nairobi blessed",
    text: "He visited Kenya, preached in Nairobi, encouraged broad outreach across the country, and personally installed Sri Sri Radha Bankebihari in 1972.",
  },
  {
    year: "1977",
    title: "Living legacy",
    text: "He passed from this world in Vrindavan, leaving his books, temples, disciples, kirtan, prasadam, and instructions as a continuing shelter.",
  },
];

const teachings = [
  {
    icon: Sparkles,
    title: "Chanting the holy names",
    text: "He taught the Hare Krishna maha-mantra as the direct spiritual practice for this age: hearing, chanting, and remembering Krishna together.",
  },
  {
    icon: BookOpen,
    title: "Books as the foundation",
    text: "His translations and commentaries on Bhagavad-gita, Srimad-Bhagavatam, and Caitanya-caritamrta gave ISKCON its philosophical backbone.",
  },
  {
    icon: Utensils,
    title: "Prasadam for everyone",
    text: "He wanted sanctified vegetarian food shared widely, famously urging that no one near an ISKCON temple should go hungry.",
  },
  {
    icon: HeartHandshake,
    title: "Mercy beyond boundaries",
    text: "He insisted Krishna consciousness was not for one race, caste, or nationality, but for every living being.",
  },
];

const sourceLinks = [
  {
    label: "ISKCON GBC biography",
    href: "https://gbc.iskcon.org/srila-prabhupada/",
  },
  {
    label: "Back to Godhead: Prabhupada in Africa",
    href: "https://btg.krishna.com/brahmananda-dasa-remembers-prabhupada-in-africa/",
  },
  {
    label: "ISKCON News: Nairobi HKTC",
    href: "https://iskconnews.org/students-join-nairobi-hare-krishna-training-centre/",
  },
  {
    label: "ISKCON News: Nairobi temple facilities",
    href: "https://iskconnews.org/iskcon-nairobi-temple-gets-upgraded-facilities/",
  },
  {
    label: "BBT",
    href: "https://bbt.org/",
  },
  {
    label: "Wikimedia image: portrait",
    href: "https://commons.wikimedia.org/wiki/File:A._C._Bhaktivedanta_Swami_Prabhupada.jpg",
  },
  {
    label: "Wikimedia image: Golden Gate Park",
    href: "https://commons.wikimedia.org/wiki/File:Bhaktivedanta_Swami_with_Jagannath_in_Golden_Gate_Park,_February_1967.jpg",
  },
];

export default function SrilaPrabhupadaPage() {
  return (
    <div className="bg-temple-bg">
      <section className="relative min-h-[92vh] overflow-hidden bg-dusk text-sand">
        <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
          src="/images/prabhupada/prabhupada-golden-gate-kirtan.jpg"
          alt="Srila Prabhupada leading public kirtan"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dusk via-dusk/82 to-dusk/28" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-transparent to-black/20" />

        <div className="relative z-10 flex min-h-[92vh] items-end">
          <div className="content-width section-padding pb-12 pt-36 sm:pb-20">
            <div className="max-w-3xl">
              <span className="eyebrow mb-5 block text-gold">Founder-Acarya of ISKCON</span>
              <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.95] text-white text-shadow">
                Srila
                <br />
                <em className="not-italic text-gold">Prabhupada</em>
              </h1>
              <p className="mt-6 max-w-2xl font-editorial text-2xl leading-relaxed text-sand/86 sm:text-3xl">
                His Divine Grace A.C. Bhaktivedanta Swami Prabhupada carried Krishna consciousness across the world and personally planted its roots in Kenya.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink variant="primary" href="#nairobi">
                  His Nairobi Legacy <ArrowRight size={14} />
                </ButtonLink>
                <ButtonLink variant="ghost" href="#life">
                  Read the Story
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="life" className="py-section bg-temple-bg bg-temple-texture">
        <div className="content-width section-padding">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <SectionHeading eyebrow="An Ocean of Mercy" title="One life," accent="a world awakened" eyebrowClassName="eyebrow mb-4 block" accentClassName="not-italic text-gold" />
              <p className="mt-6 font-body text-body-md text-ink/75">
                At an age when most people retire, Srila Prabhupada began the work that would define the modern global Hare Krishna movement.
              </p>
            </div>

            <div className="space-y-5 font-body text-body-md leading-relaxed text-ink/75">
              <p>
                Born Abhay Charan De in Calcutta in 1896, Srila Prabhupada was raised with devotion to Krishna from childhood. As a young man he studied, worked, and lived a responsible family life, but the central instruction of his life came in 1922 when he met Srila Bhaktisiddhanta Sarasvati Thakura: take the teachings of Sri Caitanya Mahaprabhu to the English-speaking world.
              </p>
              <p>
                More than four decades later, after accepting sannyasa and publishing early volumes of Srimad-Bhagavatam, he boarded the cargo ship Jaladuta in 1965. He arrived in America with little money, no institution waiting for him, and a trunk of books. In July 1966 he incorporated ISKCON in New York City.
              </p>
              <p>
                In only twelve years, his small storefront mission became an international society with temples, farms, schools, restaurants, book distribution, public kirtan, deity worship, and prasadam service across continents. His achievement was not only organizational; it was deeply personal. He gave people a daily practice, a spiritual family, and a way to live in relationship with Krishna.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand py-section-sm">
        <div className="content-width section-padding">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {timeline.map((item) => (
              <div key={item.year} className="card-surface p-6 shadow-card">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-display text-3xl font-semibold text-primary">{item.year}</span>
                  <span className="h-px flex-1 bg-gold/30" />
                </div>
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nairobi" className="overflow-hidden bg-dusk py-section text-sand">
        <div className="content-width section-padding">
          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
              <SectionHeading eyebrow="Kenya and East Africa" title="He did not send only a movement." accent="He came in person." eyebrowClassName="eyebrow mb-4 block text-gold" titleClassName="section-title-light" accentClassName="not-italic text-gold" />
              <div className="mt-7 space-y-5 font-body text-body-md leading-relaxed text-sand/75">
                <p>
                  ISKCON's early Kenyan work began remarkably soon after the society was founded. Srila Prabhupada came to Nairobi in 1971, giving darshan, leading kirtan, lecturing in the evenings, and encouraging the devotees who were trying to establish Krishna consciousness in East Africa.
                </p>
                <p>
                  Nairobi held a meaningful place in his East African mission. He encouraged the devotees to share Krishna consciousness widely throughout Kenya. That spirit of welcome and service continues to shape ISKCON Nairobi's outreach, education, Food For Life, and student work.
                </p>
                <p>
                  In 1972, Srila Prabhupada personally installed Sri Sri Radha Bankebihari in Nairobi. The worship, kirtan, prasadam, and hospitality offered today at Hare Krishna Close stand in continuity with that personal blessing.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: MapPin, label: "Nairobi visits", value: "1971-72" },
                  { icon: Globe2, label: "East Africa mission", value: "Personal care" },
                  { icon: HeartHandshake, label: "Core instruction", value: "Reach everyone" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-gold/15 bg-white/5 p-4">
                    <stat.icon className="mb-3 text-gold" size={20} />
                    <p className="font-display text-xl text-white">{stat.value}</p>
                    <p className="mt-1 font-body text-xs uppercase tracking-[0.14em] text-sand/75">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <figure className="relative">
              <div className="absolute -inset-4 border border-gold/20" />
              <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                src="/images/prabhupada/prabhupada-nairobi-bus.jpeg"
                alt="Srila Prabhupada seated aboard a blue bus in Nairobi"
                className="relative aspect-[4/3] w-full bg-dusk object-contain shadow-card-hover"
              />
              <figcaption className="relative mt-4 border-l border-gold/40 pl-4 font-body text-xs leading-relaxed text-sand/75">
                Srila Prabhupada, whose books and teachings continue to guide the temple community in Nairobi.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="py-section bg-temple-bg">
        <div className="content-width section-padding">
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading eyebrow="What He Gave" title="A practical path of" accent="hearing, chanting, serving" eyebrowClassName="eyebrow mb-4 block" accentClassName="not-italic text-gold" />
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {teachings.map((item) => (
              <div key={item.title} className="card-surface p-6 shadow-card">
                <item.icon className="mb-5 text-primary" size={24} />
                <h3 className="font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-3xl border-y border-gold/25 py-9 text-center">
            <p className="font-editorial text-2xl italic leading-relaxed text-ink/75 sm:text-3xl">
              Hare Krishna Hare Krishna, Krishna Krishna Hare Hare
              <br />
              Hare Rama Hare Rama, Rama Rama Hare Hare
            </p>
          </div>
        </div>
      </section>

      <section className="bg-temple-brown py-section-sm text-sand">
        <div className="content-width section-padding">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <Ship className="mb-5 text-gold" size={28} />
              <h2 className="font-display text-display-md text-white">Sources and photographs</h2>
              <p className="mt-4 font-body text-sm leading-relaxed text-sand/75">
                These references provide historical context for Srila Prabhupada's life and work in Kenya, alongside records for selected photographs on this page.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sourceLinks.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-11 group flex items-center justify-between gap-4 border border-white/10 bg-white/5 px-4 py-3 font-body text-xs text-sand/75 transition-colors hover:border-gold/40 hover:text-white"
                >
                  {source.label}
                  <ArrowRight size={13} className="text-gold transition-transform group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-14 text-center text-white">
        <div className="content-width section-padding">
          <span className="eyebrow mb-4 block text-white">Visit, chant, take part</span>
          <h2 className="font-display text-display-md">The doors he asked us to keep open are still open.</h2>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink variant="ghost" href="/visit">
              Plan your visit
            </ButtonLink>
            <ButtonLink variant="ghost" href="/learn">
              Study His Books
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
