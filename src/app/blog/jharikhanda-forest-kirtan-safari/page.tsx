import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bird,
  CalendarDays,
  Compass,
  ExternalLink,
  Leaf,
  Music2,
  PawPrint,
  Sparkles,
  TreePine,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import StructuredPageData from "@/components/seo/StructuredPageData";

const sourceUrl = "https://vedabase.io/en/library/cc/madhya/17/";
const creditUrl = "https://pin.it/1DvGSgZr7";
const heroImage = "/images/blog/jharikhanda-mahaprabhu-animals.jpeg";

export const metadata = withSeo({
  title: "The Forest That Learned to Chant",
  description:
    "Sri Chaitanya Mahaprabhu and the animals of Jharikhanda, retold from Chaitanya-caritamrita, Madhya-lila 17.",
  alternates: {
    canonical: "/blog/jharikhanda-forest-kirtan-safari",
  },
  openGraph: {
    title: "The Forest That Learned to Chant | ISKCON Nairobi",
    description:
      "Sri Chaitanya Mahaprabhu and the animals of Jharikhanda, retold from Chaitanya-caritamrita, Madhya-lila 17.",
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
    title: "The Forest That Learned to Chant | ISKCON Nairobi",
    description:
      "Sri Chaitanya Mahaprabhu and the animals of Jharikhanda, retold from Chaitanya-caritamrita, Madhya-lila 17.",
    images: [heroImage],
  },
}, "/blog/jharikhanda-forest-kirtan-safari");

/* ---------- Prologue: the invocation lines before the story begins ---------- */
const prologue = {
  overture:
    "On His way to Vrindavan, Lord Sri Chaitanya Mahaprabhu passed through the forest of Jharikhanda. As He moved through that wild forest, He made the tigers, elephants, deer, birds, and all living beings chant the Hare Krishna maha-mantra and dance. By His mercy, the animals became overwhelmed with ecstatic love.",
  refrain:
    "All glories to Sri Chaitanya Mahaprabhu. All glories to Lord Nityananda. All glories to Advaitacandra. All glories to all the devotees of the Lord.",
};

/* ---------- The story, chaptered by scene ---------- */
const scenes = [
  {
    id: "the-vow",
    icon: Compass,
    label: "The vow to depart",
    paragraphs: [
      "When autumn arrived, Sri Chaitanya Mahaprabhu desired to go to Vrindavan. In a solitary place, He spoke with Ramananda Raya and Svarupa Damodara Gosvami, asking them to help Him leave for Vrindavan.",
      "The Lord told them that He would depart very early in the morning, quietly and without being seen. He would not take the well-known public road. He wanted to travel secretly through the forest, and He wished to go alone. If anyone tried to follow Him, He asked that they be stopped.",
      "He also asked them not to be unhappy. If they gave Him permission with joy, He said, then He would be happy on His way to Vrindavan.",
      "Ramananda Raya and Svarupa Damodara replied that the Lord was completely independent. He was not dependent on anyone, and He would certainly do whatever He desired. Still, they placed one request before Him, because He had said that He would be happy if they were happy.",
      "They begged Him to take at least one gentle and qualified brahmana. Such a person could collect alms, cook for Him, offer Him prasadam, and carry His waterpot while traveling. They explained that in the jungle there might be no brahmana from whom the Lord could accept lunch, so one pure brahmana should accompany Him.",
      "Sri Chaitanya Mahaprabhu answered that He would not take any of His close associates, because if He chose one of them, the others would be unhappy. If someone were to go, that person would have to be new, peaceful, and suitable for the journey.",
      "Svarupa Damodara then proposed Balabhadra Bhattacharya. He was deeply attached to the Lord, honest, learned, and advanced in spiritual consciousness. He had originally come with the Lord from Bengal, and he also desired to see the holy places of pilgrimage.",
      "Svarupa Damodara also suggested that another brahmana could go as a servant to help on the way, carry the Lord's cloth and waterpot, and make arrangements for food. Balabhadra Bhattacharya would collect alms and cook for the Lord. With two people accompanying Him through the jungle, there would be no difficulty.",
      "Sri Chaitanya Mahaprabhu accepted this request. On the previous night, He went to see Lord Jagannatha and took His permission. Then, near the end of the night, before others could see Him, the Lord rose and immediately began His journey.",
    ],
  },
  {
    id: "into-the-forest",
    icon: TreePine,
    label: "Into the forest",
    paragraphs: [
      "In the morning, the devotees could not find Him. Their hearts became anxious, and they searched everywhere. Svarupa Damodara restrained them, and understanding the mind of Sri Chaitanya Mahaprabhu, they became silent.",
      "The Lord avoided the famous public road and took a side path. Keeping the city of Kataka on His right, He entered the forest. As He moved through the solitary jungle, He chanted the holy name of Krishna.",
      "Tigers and elephants saw Him and moved aside. The Lord walked through the jungle in deep ecstasy. Packs of tigers, elephants, rhinoceroses, and boars appeared before Him, yet He passed directly through them.",
    ],
    witness:
      "Balabhadra Bhattacharya was frightened to see such animals, but by the influence of Sri Chaitanya Mahaprabhu, they all stood aside.",
  },
  {
    id: "the-tiger",
    icon: PawPrint,
    label: "The tiger",
    paragraphs: [
      "One day, a tiger was lying across the path. Sri Chaitanya Mahaprabhu, absorbed in ecstatic love, walked along that path and touched the tiger with His feet. The Lord told the tiger, \"Chant the holy name of Krishna.\"",
    ],
    pullQuote: "At once the tiger rose, began to dance, and chanted, \"Krishna! Krishna!\"",
  },
  {
    id: "the-elephants",
    icon: TreePine,
    label: "The elephants at the river",
    paragraphs: [
      "On another day, Sri Chaitanya Mahaprabhu was bathing in a river and murmuring the Gayatri mantra. A herd of maddened elephants came to drink water. Seeing them before Him, the Lord splashed water on the elephants and asked them to chant the name of Krishna.",
      "The water touched their bodies, and the elephants began chanting, \"Krishna! Krishna!\" They danced and sang in ecstasy. Some fell to the ground, and some cried out in spiritual joy.",
    ],
    witness: "Balabhadra Bhattacharya watched all this in complete astonishment.",
  },
  {
    id: "the-deer",
    icon: Leaf,
    label: "The deer",
    paragraphs: [
      "At other times, Sri Chaitanya Mahaprabhu chanted loudly as He passed through the jungle. Hearing His sweet voice, the does came near Him. Drawn by the Lord's great vibration, the deer followed Him on both sides. With great affection, the Lord patted them.",
      "Seeing them, He remembered the description of the deer of Vrindavan, who approached the son of Maharaja Nanda, gorgeously dressed and playing His flute. The does and the bucks worshiped the Lord with loving glances.",
    ],
  },
  {
    id: "together",
    icon: PawPrint,
    label: "Tigers and deer together",
    paragraphs: [
      "As Sri Chaitanya Mahaprabhu continued through the jungle, five or seven tigers came. They joined the deer and began following the Lord. Seeing tigers and deer walking together, the Lord remembered Vrindavan and recited a verse describing the nature of that transcendental abode.",
      "In Vrindavan there is no ordinary hunger, anger, or thirst. There, even beings who are naturally hostile live together in transcendental friendship. Seeing the animals of Jharikhanda together in this mood, Mahaprabhu saw the forest through remembrance of Vrindavan.",
      "Then Sri Chaitanya Mahaprabhu said, \"Chant Krishna! Krishna!\" The tigers and deer began to chant the holy name and dance. They jumped together.",
    ],
    pullQuote: "The tigers and deer embraced one another. Touching mouths, they began to kiss.",
    witness: "Balabhadra Bhattacharya was struck with wonder.",
    trailingParagraphs: [
      "When Sri Chaitanya Mahaprabhu saw this extraordinary scene, He smiled. After enjoying that joyful transformation, He left the animals and continued on His way.",
    ],
  },
  {
    id: "the-birds",
    icon: Bird,
    label: "The birds",
    paragraphs: [
      "Various birds, including peacocks, saw Sri Chaitanya Mahaprabhu and began to follow Him. They chanted and danced, maddened by the holy name of Krishna. When the Lord loudly chanted \"Haribol!\", the trees and creepers became jubilant simply by hearing Him.",
    ],
  },
  {
    id: "what-remained",
    icon: Sparkles,
    label: "What the forest carried away",
    paragraphs: [
      "In this way, all living entities in the forest of Jharikhanda became overwhelmed by the holy name of Lord Krishna as it was vibrated by Sri Chaitanya Mahaprabhu. Some were moving beings, and some were standing still, yet all were touched by the sound of Krishna's name.",
    ],
  },
];

const articleGuide = [
  { icon: BookOpen, label: "Primary source", value: "Chaitanya-caritamrita, Madhya-lila 17.1-46" },
  { icon: Music2, label: "Theme", value: "The holy name awakens ecstatic love" },
  { icon: Leaf, label: "Setting", value: "Jharikhanda Forest on the road to Vrindavan" },
  { icon: CalendarDays, label: "Festival link", value: "Kirtan Safari, 27-30 August 2026" },
];

function WitnessNote({ text }: { text: string }) {
  return (
    <aside className="my-7 border-l-2 border-gold/50 pl-4">
      <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">
        Balabhadra witnesses
      </p>
      <p className="mt-1 font-body text-sm italic leading-relaxed text-ink/75">{text}</p>
    </aside>
  );
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="my-10 border-y border-gold/30 py-8 text-center">
      <p className="font-display text-2xl italic leading-snug text-ink sm:text-3xl">&ldquo;{text}&rdquo;</p>
    </blockquote>
  );
}

export default function JharikhandaBlogPage() {
  return (
    <>
      <StructuredPageData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: "The Forest That Learned to Chant", path: "/blog/jharikhanda-forest-kirtan-safari" }]} article={{ headline: "The Forest That Learned to Chant", description: "Sri Chaitanya Mahaprabhu and the animals of Jharikhanda, retold from Chaitanya-caritamrita, Madhya-lila 17.", image: heroImage, path: "/blog/jharikhanda-forest-kirtan-safari" }} />
      <PageHero
        title="The Forest That"
        titleAccent="Learned to Chant"
        subtitle="Temple Journal"
        description="Sri Chaitanya Mahaprabhu and the animals of Jharikhanda, retold from Chaitanya-caritamrita, Madhya-lila 17."
        image={heroImage}
        height="md"
        className="sm:min-h-[500px]"
      />

      <section className="bg-temple-bg py-[clamp(2.7rem,12vw,3.8rem)] sm:py-[clamp(3.5rem,5vw,5.5rem)]">
        <div className="content-width section-padding">
          <div className="mb-12 flex flex-wrap items-center gap-3 font-body text-xs uppercase tracking-[0.14em] text-ink/75">
            <span>July 2026</span>
            <span className="h-1 w-1 self-center rounded-full bg-gold" />
            <span>12 min read</span>
            <span className="h-1 w-1 self-center rounded-full bg-gold" />
            <span>Chaitanya-caritamrita, Madhya-lila 17</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(300px,0.32fr)] lg:items-start">
            <article className="mx-auto max-w-3xl">
              {/* Prologue */}
              <div className="mb-14 text-center">
                <p className="font-display text-xl italic leading-relaxed text-ink/80 sm:text-2xl">
                  {prologue.overture}
                </p>
                <p className="mt-6 font-body text-xs uppercase tracking-[0.2em] text-gold-ink">
                  {prologue.refrain}
                </p>
              </div>

              {/* Scenes */}
              <div className="space-y-14">
                {scenes.map((scene) => {
                  const Icon = scene.icon;
                  return (
                    <section key={scene.id} id={scene.id} className="scroll-mt-28">
                      <div className="mb-6 flex items-center gap-3 border-b border-temple-sand pb-3">
                        <Icon size={16} className="shrink-0 text-gold" />
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-ink/75">
                          {scene.label}
                        </p>
                      </div>

                      <div className="space-y-6 font-body text-[1.02rem] leading-[1.85] text-ink/75">
                        {scene.paragraphs.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>

                      {scene.id === "the-tiger" && (
                        <figure className="my-12 overflow-hidden card-surface shadow-card">
                          <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 720px"
                            src={heroImage}
                            alt="Sri Chaitanya Mahaprabhu dancing with animals in Jharikhanda Forest"
                            className="h-auto w-full object-cover"
                          />
                          <figcaption className="border-t border-temple-sand px-5 py-3 font-body text-xs leading-relaxed text-ink/75">
                            Mahaprabhu chants with the animals of Jharikanda.
                          </figcaption>
                        </figure>
                      )}

                      {scene.pullQuote && <PullQuote text={scene.pullQuote} />}
                      {scene.witness && <WitnessNote text={scene.witness} />}

                      {scene.trailingParagraphs && (
                        <div className="space-y-6 font-body text-[1.02rem] leading-[1.85] text-ink/75">
                          {scene.trailingParagraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>

              <div className="mt-12 flex flex-col items-start gap-4 border border-gold/30 bg-dusk p-6 text-sand sm:p-8">
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                    Kirtan Safari 2026
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-white">
                    Join the kirtan journey through Jharikhanda Forest
                  </p>
                </div>
                <Link
                  href="/festivals/kirtan-safari"
                  className="text-link tap-target inline-flex items-center gap-2 text-gold transition-colors hover:text-sand"
                >
                  Festival details <ArrowRight size={12} />
                </Link>
              </div>
            </article>

            <aside className="lg:sticky lg:top-28">
              <div className="card-surface p-6 shadow-card">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  In this story
                </p>
                <nav className="mt-4 space-y-2">
                  {scenes.map((scene) => (
                    <a
                      key={scene.id}
                      href={`#${scene.id}`}
                      className="tap-target flex items-center gap-2 font-body text-sm text-ink/75 transition-colors hover:text-gold"
                    >
                      <scene.icon size={13} className="shrink-0 text-gold" />
                      {scene.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="mt-5 card-surface p-6 shadow-card">
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

              <div className="mt-5 border border-gold/25 bg-temple-cream p-5">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-ink/75">
                  Read source
                </p>
                <p className="mt-3 font-body text-sm leading-relaxed text-ink/75">
                  Read the full chapter in Chaitanya-caritamrita, Madhya-lila 17.
                </p>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link tap-target mt-4 inline-flex items-center gap-2 text-gold-ink transition-all hover:gap-3"
                >
                  Open Vedabase <ExternalLink size={12} />
                </a>
              </div>

              <div className="mt-5 card-surface p-5">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-ink/75">
                  Image credits
                </p>
                <p className="mt-3 font-body text-xs leading-relaxed text-ink/75">
                  Artwork credited to Mayapur Institute via{" "}
                  <a className="text-gold-ink hover:underline" href={creditUrl} target="_blank" rel="noopener noreferrer">
                    Pinterest
                  </a>.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
