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
        image="/images/thika-farm/farm-overview.webp"
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
                { src: "/images/thika-farm/farm-greenhouse-visit.webp", alt: "Devotees visiting the farm greenhouse" },
                { src: "/images/thika-farm/farm-peppers.webp", alt: "Red peppers growing at Thika Farm" },
              ].map((photo, i) => (
                <Image width={1280} height={960} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 33vw" key={photo.src} src={photo.src} alt={photo.alt} className={`w-full object-cover ${i === 1 ? "mt-8" : ""}`} style={{ aspectRatio: "4/3" }} />
              ))}
            </div>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {[
              { src: "/images/thika-farm/farm-pavilion.webp", alt: "Open pavilion in the farm garden", caption: "The garden pavilion" },
              { src: "/images/thika-farm/farm-orchard.webp", alt: "Fruit trees growing in the farm orchard", caption: "The farm orchard" },
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

      <section className="bg-temple-bg py-section">
        <div className="content-width section-padding">
          <SectionHeading eyebrow="Cow Care" title="Life at the" accent="Goshala" />
          <figure className="mt-8 max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden sm:aspect-[2/1]">
              <Image src="/images/thika-farm/farm-cows-enclosure.webp" alt="Cows in the outdoor goshala enclosure at Thika Farm" fill sizes="(max-width: 640px) 100vw, 80vw" className="object-cover" />
            </div>
            <figcaption className="mt-2 font-body text-xs text-ink/75">Cows at the goshala</figcaption>
          </figure>
          <div className="mt-10 grid gap-2 sm:grid-cols-6 sm:gap-3 lg:grid-cols-12" aria-label="More views of the goshala and farm">
            {[
              { src: "goshala-garden-path", alt: "Garden path leading to the pavilion", span: "sm:col-span-4 lg:col-span-8", ratio: "aspect-[16/9]" },
              { src: "goshala-gate", alt: "Krishna Balarama Farm sign at the entrance", span: "sm:col-span-2 lg:col-span-4", ratio: "aspect-[4/5] sm:aspect-auto" },
              { src: "goshala-visitors", alt: "Families visiting the cows at the goshala", span: "sm:col-span-3 lg:col-span-6", ratio: "aspect-[16/9]" },
              { src: "goshala-courtyard", alt: "Devotee walking between the cow shelters and garden pavilion", span: "sm:col-span-3 lg:col-span-6", ratio: "aspect-[16/9]" },
              { src: "goshala-gathering", alt: "Devotees gathered in the farm pavilion", span: "sm:col-span-3 lg:col-span-6", ratio: "aspect-[16/9]" },
              { src: "goshala-farm-fields", alt: "Cultivated fields and greenhouses at the farm", span: "sm:col-span-3 lg:col-span-6", ratio: "aspect-[16/9]" },
              { src: "goshala-cultivated-fields", alt: "Rows of crops growing in the farm fields", span: "sm:col-span-3 lg:col-span-6", ratio: "aspect-[16/9]" },
              { src: "goshala-green-space", alt: "Lawn and cow shelters at the farm", span: "sm:col-span-3 lg:col-span-6", ratio: "aspect-[16/9]" },
              { src: "goshala-cactus-flower", alt: "White cactus flower blooming on the farm", span: "sm:col-span-2 lg:col-span-4", ratio: "aspect-[4/5] sm:aspect-auto" },
              { src: "goshala-dragon-fruit", alt: "Dragon fruit growing on the farm", span: "sm:col-span-4 lg:col-span-8", ratio: "aspect-[16/9]" },
            ].map((photo) => (
              <div key={photo.src} className={`relative overflow-hidden ${photo.span} ${photo.ratio}`}>
                <Image src={`/images/thika-farm/${photo.src}.webp`} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 70vw" className="object-cover" />
              </div>
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
              { icon: "🌿", title: "Organic Farming", desc: "Vegetables, fruits, and grains grown using traditional and sustainable methods. All produce offered as prasādam." },
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
