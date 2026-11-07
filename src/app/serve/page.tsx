import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({ title: "Serve" }, "/serve");

const opportunities = [
  { emoji: "🍛", title: "Food For Life", desc: "Cook, pack, and distribute prasādam meals. Daily and weekend shifts available.", commitment: "Flexible" },
  { emoji: "🌾", title: "Thika Farm", desc: "Cow care, organic farming, construction, and maintenance at the Thika campus.", commitment: "Weekend / Residential" },
  { emoji: "🎺", title: "Festival Crew", desc: "Event management, logistics, and hospitality for festivals and programmes.", commitment: "Seasonal" },
  { emoji: "📚", title: "HKTC Support", desc: "Library management, class assistance, and administrative support at the college.", commitment: "Weekly" },
  { emoji: "📸", title: "Media & Content", desc: "Photography, videography, social media, and digital content creation.", commitment: "Flexible" },
  { emoji: "🏗️", title: "Temple Services", desc: "Deity worship, flower arrangement, temple cleaning, and general seva.", commitment: "Daily / Weekly" },
];

export default function ServePage() {
  return (
    <>
      <PageHero
        title="Serve the"
        titleAccent="Community"
        subtitle="Volunteer Opportunities"
        description="Join hundreds of dedicated volunteers whose selfless service sustains ISKCON Nairobi's programmes across Kenya."
        image="/images/serve/krishna-balarama-service-refined.webp"
        imageAlt="A devotional painting of Krishna, Balarama, and cowherd friends sharing a meal"
        className="sm:min-h-[500px]"
      />
      <section className="pt-section-sm pb-section bg-temple-bg">
        <div className="content-width section-padding">
          <div className="text-center mb-12">
            <SectionHeading eyebrow="Volunteer Opportunities" title="Find Your" accent="Area of Service" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((op) => (
              <div key={op.title} className="card-surface p-7 hover:shadow-card-hover hover:border-gold/30 transition-all">
                <div className="text-3xl mb-4">{op.emoji}</div>
                <h3 className="font-display text-xl font-semibold text-ink mb-1">{op.title}</h3>
                <p className="font-body text-gold-ink text-xs tracking-wider mb-3">{op.commitment}</p>
                <div className="w-5 h-px bg-gold/30 mb-3" />
                <p className="font-body text-ink/75 text-sm leading-relaxed">{op.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ButtonLink variant="primary" href="/contact">Register as a volunteer</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
