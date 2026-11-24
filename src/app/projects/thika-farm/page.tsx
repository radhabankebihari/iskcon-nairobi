import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import StructuredPageData from "@/components/seo/StructuredPageData";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "Thika Farm & Goshala",
  description: "Forty acres of sacred land where cow protection, organic farming, and devotional community life come together in the Kenyan highlands.",
}, "/projects/thika-farm");

const farm = (name: string) => `/images/thika-farm/${name}.webp`;

// Cow care in one tight story: a large lead photo and two companions, then
// three moments of daily care. On phones the photos become a swipeable row.
const goshalaPhotos = [
  { src: farm("new-cow-and-calf"), caption: "Cow and calf", alt: "A cow standing beside her calf in the goshala", layout: "lg:col-span-8 lg:row-span-2" },
  { src: farm("new-young-calf"), caption: "A young calf", alt: "A young brown calf at the farm", layout: "lg:col-span-4" },
  { src: farm("new-cow-portrait"), caption: "One of the farm's cows", alt: "A brown cow looking toward the camera", layout: "lg:col-span-4" },
  { src: farm("new-daily-cow-care"), caption: "HH Bhakti Narasimha Swami feeds a calf", alt: "HH Bhakti Narasimha Swami feeding a calf inside the cow shelter", layout: "lg:col-span-4" },
  { src: farm("new-cow-care-visit"), caption: "Feeding the cows", alt: "Devotees feeding cows at the farm", layout: "lg:col-span-4" },
  { src: farm("new-visitors-at-goshala"), caption: "Devotees visit the cows", alt: "Devotees gathered beside cows at the goshala", layout: "lg:col-span-4" },
];

const activities = [
  { title: "Goshala", image: farm("new-cow-closeup"), alt: "Close view of a brown cow at Thika Farm", desc: "Over 200 cows and bulls receive lifelong protection, veterinary care, and the highest quality feed. Milk is used exclusively for temple worship and prasādam." },
  { title: "Organic Farming", image: farm("goshala-cultivated-fields"), alt: "Rows of crops growing in the farm fields", desc: "Vegetables, fruits, and grains grown using traditional and sustainable methods. All produce offered as prasādam." },
  { title: "Dairy Production", image: farm("farm-cows-enclosure"), alt: "Cows in the outdoor goshala enclosure", desc: "Fresh milk, yoghurt, ghee, and paneer produced daily from our protected cows - offered in the temple and distributed through Food For Life." },
  { title: "Retreat Visits", image: farm("goshala-gathering"), alt: "Devotees gathered in the farm pavilion", desc: "Day visits and weekend spiritual retreats available for groups and individuals. Experience a day of farm life, cow care, and devotional community." },
  { title: "Volunteering", image: farm("farm-greenhouse-visit"), alt: "Devotees visiting the farm greenhouse", desc: "Join us for a week or a season. Volunteers participate in cow care, farming, construction, and daily temple programmes." },
  { title: "Training", image: farm("goshala-farm-fields"), alt: "Cultivated fields and greenhouses at the farm", desc: "Practical training in sustainable agriculture and traditional Vedic farming for aspiring homesteaders and devotional farmers." },
];

export default function ThikaFarmPage() {
  return (
    <>
      <StructuredPageData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }, { name: "Thika Farm & Goshala", path: "/projects/thika-farm" }]} />
      <PageHero
        title="Thika Farm"
        titleAccent="& Goshala"
        subtitle="Organic Farming & Cow Protection"
        description="Forty acres of sacred land in the Kenyan highlands - where cow protection, organic farming, and devotional community life thrive together."
        image="/images/thika-farm/farm-overview.webp"
        height="md"
        className="sm:min-h-[500px]"
      />

      {/* Vision: the text beside one wide view of the whole farm */}
      <section className="py-section bg-temple-bg sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14">
            <div>
              <SectionHeading eyebrow="The Vision" title="A Self-Sufficient" accent="Devotional Community" eyebrowClassName="eyebrow block mb-4" titleClassName="section-title mb-6" />
              <div className="space-y-4 font-body text-ink/75 leading-relaxed">
                <p>The Thika Farm represents ISKCON Nairobi's long-term vision of varnāśrama - a spiritually integrated community where devotees live close to the land, protect cows, grow their own food, and sustain a life centred on devotional practice.</p>
                <p>The farm supplies fresh organic produce, milk, and ghee to the Nairobi temple kitchen and Food For Life programme. Visitors and volunteers are welcome throughout the year.</p>
              </div>
            </div>
            <figure>
              <div className="relative aspect-[16/9] overflow-hidden shadow-card">
                <Image src={farm("new-farm-aerial")} alt="Aerial view of the farm buildings and surrounding grounds" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
              </div>
              <figcaption className="mt-2 font-body text-xs text-ink/75">An aerial view of Thika Farm</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Life at the goshala: only cow photographs, in one compact block */}
      <section className="bg-temple-cream py-section">
        <div className="content-width section-padding">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <SectionHeading eyebrow="Cow Care" title="Life at the" accent="Goshala" />
            </div>
            <p className="max-w-xl font-body text-sm leading-relaxed text-ink/75 sm:text-base">
              Cows are honoured in Vedic culture as mothers. At Thika they are cared for for life: fed, sheltered, treated
              when unwell, and visited by devotees and families who come to serve them.
            </p>
          </div>

          <ul
            className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-12 lg:auto-rows-[15rem]"
            aria-label="Photographs of cow care at the goshala"
            // Focusable so keyboard users can scroll the phone swipe row.
            tabIndex={0}
          >
            {goshalaPhotos.map((photo) => (
              <li
                key={photo.src}
                className={`relative aspect-[4/3] w-[82vw] shrink-0 snap-start overflow-hidden sm:w-auto lg:aspect-auto ${photo.layout}`}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 40vw" className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 font-body text-xs font-semibold text-white">
                  {photo.caption}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 font-body text-xs text-ink/60 sm:hidden">Swipe to see more</p>
        </div>
      </section>

      {/* Activities: each card shows the part of the farm it describes */}
      <section className="py-section bg-temple-bg sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="text-center mb-12">
            <SectionHeading eyebrow="What We Do" title="Farm Activities" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((item) => (
              <article key={item.title} className="overflow-hidden bg-white border border-temple-sand transition-all hover:shadow-card hover:border-gold/20">
                <div className="relative aspect-[16/10]">
                  <Image src={item.image} alt={item.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-ink mb-3">{item.title}</h3>
                  <p className="font-body text-ink/75 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA: the farm gate beside the invitation */}
      <section className="bg-acacia-ink text-white">
        <div className="content-width section-padding grid items-center gap-8 py-14 md:grid-cols-[minmax(0,1fr)_20rem] md:gap-12">
          <div className="text-center md:text-left">
            <h2 className="font-display text-display-md text-white mb-4">Visit the Farm</h2>
            <p className="font-body text-white mb-8 max-w-md mx-auto md:mx-0">Day visits, volunteering, and retreat stays available. Contact us to plan your trip to Thika.</p>
            <ButtonLink variant="ghost" href="/contact">
              Enquire Now
            </ButtonLink>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[16rem] overflow-hidden border border-white/20 md:max-w-none">
            <Image src={farm("goshala-gate")} alt="Krishna Balarama Farm sign at the entrance" fill sizes="(max-width: 768px) 16rem, 20rem" className="object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
