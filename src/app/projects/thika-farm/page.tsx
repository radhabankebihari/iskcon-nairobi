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

export default function ThikaFarmPage() {
  return (
    <>
      <StructuredPageData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Projects", path: "/projects" }, { name: "Thika Farm & Goshala", path: "/projects/thika-farm" }]} />
      <PageHero
        title="Thika Farm"
        titleAccent="& Goshala"
        subtitle="Organic Farming & Cow Protection"
        description="Forty acres of sacred land in the Kenyan highlands - where cow protection, organic farming, and devotional community life thrive together."
        image="/images/thika-farm/thika-farm-2022-141.webp"
        height="md"
        className="sm:min-h-[500px]"
      />

      {/* Overview */}
      <section className="py-section bg-temple-bg sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionHeading eyebrow="The Vision" title="A Self-Sufficient" accent="Devotional Community" eyebrowClassName="eyebrow block mb-4" titleClassName="section-title mb-6" />
              <div className="space-y-4 font-body text-ink/75 leading-relaxed">
                <p>The Thika Farm represents ISKCON Nairobi's long-term vision of varnāśrama - a spiritually integrated community where devotees live close to the land, protect cows, grow their own food, and sustain a life centred on devotional practice.</p>
                <p>The farm supplies fresh organic produce, milk, and ghee to the Nairobi temple kitchen and Food For Life programme. Visitors and volunteers are welcome throughout the year.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { src: "/images/thika-farm/thika-farm-2022-103-optimized.webp", alt: "Fruit trees growing at Thika Farm" },
                { src: "/images/thika-farm/thika-farm-2022-135.webp", alt: "Hanging planter in the farm garden" },
              ].map((photo, i) => (
                <Image width={1600} height={1200} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 33vw" key={photo.src} src={photo.src} alt={photo.alt} className={`w-full object-cover ${i === 1 ? "mt-8" : ""}`} style={{ aspectRatio: "3/4" }} />
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              { src: "/images/thika-farm/thika-farm-2022-146-optimized.webp", alt: "Devotee seated with a harmonium on the farm lawn", caption: "A quiet moment on the lawn" },
              { src: "/images/thika-farm/thika-farm-2022-147.webp", alt: "Farm buildings and cow shelters at Thika Farm", caption: "The farm and cow shelters" },
            ].map((photo) => (
              <figure key={photo.src}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                </div>
                <figcaption className="mt-2 font-body text-xs text-ink/75">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="py-section bg-temple-cream sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="text-center mb-12">
            <SectionHeading eyebrow="What We Do" title="Farm Activities" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🐄", title: "Goshala", desc: "Over 200 cows and bulls receive lifelong protection, veterinary care, and the highest quality feed. Milk is used exclusively for temple worship and prasādam." },
              { icon: "🌿", title: "Organic Farming", desc: "Vegetables, fruits, and grains grown using traditional and sustainable methods. No synthetic pesticides or fertilisers. All produce offered as prasādam." },
              { icon: "🧈", title: "Dairy Production", desc: "Fresh milk, yoghurt, ghee, and paneer produced daily from our protected cows - offered in the temple and distributed through Food For Life." },
              { icon: "🏕️", title: "Retreat Visits", desc: "Day visits and weekend spiritual retreats available for groups and individuals. Experience a day of farm life, cow care, and devotional community." },
              { icon: "🤝", title: "Volunteering", desc: "Join us for a week or a season. Volunteers participate in cow care, farming, construction, and daily temple programmes." },
              { icon: "🌱", title: "Training", desc: "Practical training in sustainable agriculture and traditional Indian farming for aspiring homesteaders and devotional farmers." },
            ].map((item) => (
              <div key={item.title} className="bg-white p-7 border border-temple-sand hover:shadow-card hover:border-gold/20 transition-all">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display text-xl font-semibold text-ink mb-3">{item.title}</h3>
                <p className="font-body text-ink/75 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-acacia-ink text-center section-padding">
        <h2 className="font-display text-display-md text-white mb-4">Visit the Farm</h2>
        <p className="font-body text-white mb-8 max-w-md mx-auto">Day visits, volunteering, and retreat stays available. Contact us to plan your trip to Thika.</p>
        <ButtonLink variant="ghost" href="/contact">
          Enquire Now
        </ButtonLink>
      </section>
    </>
  );
}
