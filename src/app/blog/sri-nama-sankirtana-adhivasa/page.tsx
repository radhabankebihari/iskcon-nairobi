import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Leaf,
  Music2,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import AdhivasaLyrics from "@/components/blog/AdhivasaLyrics";
import { withSeo } from "@/lib/seo";
import StructuredPageData from "@/components/seo/StructuredPageData";

const heroImage = "/images/blog/chaitanya-dances-with-followers.jpg";
const jharikhandaImage = "/images/blog/jharikhanda-mahaprabhu-animals.jpeg";

export const metadata = withSeo({
  title: "The Invitation Before the Festival",
  description:
    "A verse-by-verse translation of Sri Nama Sankirtana Adhivasa, Vrindavana Dasa Thakura's traditional summons sung the evening before every great kirtana festival.",
  alternates: {
    canonical: "/blog/sri-nama-sankirtana-adhivasa",
  },
  openGraph: {
    title: "The Invitation Before the Festival | ISKCON Nairobi",
    description:
      "A verse-by-verse translation of Sri Nama Sankirtana Adhivasa, Vrindavana Dasa Thakura's traditional summons sung the evening before every great kirtana festival.",
    images: [
      {
        url: heroImage,
        width: 736,
        height: 981,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Invitation Before the Festival | ISKCON Nairobi",
    description:
      "A verse-by-verse translation of Sri Nama Sankirtana Adhivasa, Vrindavana Dasa Thakura's traditional summons sung the evening before every great kirtana festival.",
    images: [heroImage],
  },
}, "/blog/sri-nama-sankirtana-adhivasa");

const introParagraphs = [
  "Before a mahotsava begins, before the mridangas are lifted and the nagar-kirtan procession takes to the streets, there is a quieter evening. Devotees gather, articles for worship are arranged, and one specific song is sung - not a prayer of praise, but an invitation. This is adhivasa: the ceremony that prepares a place, and the hearts within it, for what is coming the next day.",
  "The song is the work of Vrindavana Dasa Thakura (1507-1589), best known as the author of the Chaitanya Bhagavata, the first full biography of Sri Chaitanya Mahaprabhu, written in Bengali on the order of his initiating guru, Lord Nityananda. Tradition holds him to be Vyasadeva returned: just as Vyasa gave the world Krishna's pastimes in the Srimad-Bhagavatam, Vrindavana Dasa gave it Gaura's pastimes in his own great work. This shorter song, sung rather than read, has carried a separate life of its own - it remains a standard adhivasa-kirtana at Gaudiya festivals.",
  "Its structure mirrors the ceremony itself. The poet describes preparing the offering, then turns to the assembled Vaishnavas and asks them, humbly, to complete the occasion by their presence. Only in the fourth verse does the song turn: tomorrow, it says, there will be a festival. Everything before that line is invitation; everything after it is promise.",
];

const articleGuide = [
  { icon: BookOpen, label: "Ceremony", value: "Adhivasa, the evening invocation before a mahotsava" },
  { icon: Music2, label: "Form", value: "Bengali padavali kirtana" },
  { icon: CalendarDays, label: "Traditionally sung", value: "The night before an akhanda-kirtana or festival" },
  { icon: Leaf, label: "Author", value: "Vrindavana Dasa Thakura (1507-1589)" },
];

export default function AdhivasaBlogPage() {
  return (
    <>
      <StructuredPageData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: "The Invitation Before the Festival", path: "/blog/sri-nama-sankirtana-adhivasa" }]} article={{ headline: "The Invitation Before the Festival", description: "A verse-by-verse translation of Sri Nama Sankirtana Adhivasa, a traditional summons before a kirtan festival.", image: heroImage, path: "/blog/sri-nama-sankirtana-adhivasa" }} />
      <PageHero
        title="The Invitation"
        titleAccent="Before the Festival"
        subtitle="Temple Journal"
        description="Sri Nama Sankirtana Adhivasa - Vrindavana Dasa Thakura's evening summons to the Vaishnavas, sung on the eve of every great kirtana."
        image={heroImage}
        height="md"
        className="sm:min-h-[500px]"
      />

      <section className="bg-temple-bg py-[clamp(2.7rem,12vw,3.8rem)] sm:py-[clamp(3.5rem,5vw,5.5rem)]">
        <div className="content-width section-padding">
          <div className="mb-12 flex flex-wrap items-center gap-3 font-body text-xs uppercase tracking-[0.14em] text-ink/75">
            <span>July 2026</span>
            <span className="h-1 w-1 self-center rounded-full bg-gold" />
            <span>4 min read</span>
            <span className="h-1 w-1 self-center rounded-full bg-gold" />
            <span>Traditional adhivasa-kirtana</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(300px,0.32fr)] lg:items-start">
            <article className="mx-auto max-w-3xl">
              <div className="space-y-6 font-body text-[1.02rem] leading-[1.85] text-ink/75">
                {introParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <AdhivasaLyrics />

              <div className="mt-12 flex flex-col items-start gap-4 border border-gold/30 bg-dusk p-6 text-sand sm:p-8">
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    Temple Journal
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-white">
                    Continue exploring the Temple Journal
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="text-link tap-target inline-flex items-center gap-2 text-gold transition-colors hover:text-sand"
                >
                  More devotional stories <ArrowRight size={12} />
                </Link>
              </div>
            </article>

            <aside className="lg:sticky lg:top-28">
              <div className="card-surface p-6 shadow-card">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  Article guide
                </p>
                <div className="mt-5 space-y-4">
                  {articleGuide.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex gap-3 border-t border-temple-sand pt-4 first:border-t-0 first:pt-0">
                        <Icon size={18} className="mt-1 shrink-0 text-gold" />
                        <div>
                          <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-ink/75">
                            {item.label}
                          </p>
                          <p className="mt-1 font-body text-sm leading-relaxed text-ink/75">{item.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/blog/jharikhanda-forest-kirtan-safari"
                className="group mt-5 block overflow-hidden card-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-card-hover"
              >
                <div className="relative h-32 overflow-hidden">
                  <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                    src={jharikhandaImage}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dusk/55 via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-ink/75">
                    More from the Journal
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 font-display text-base font-semibold leading-snug text-ink">
                    The Forest That Learned to Chant
                    <ArrowUpRight size={14} className="shrink-0 text-gold" />
                  </p>
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
