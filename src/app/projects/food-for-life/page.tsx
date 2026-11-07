import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "Food For Life",
  description: "Distributing thousands of free prasādam meals monthly to students, street children, and vulnerable families across Nairobi.",
}, "/projects/food-for-life");

export default function FoodForLifePage() {
  return (
    <>
      <PageHero
        title="Food For"
        titleAccent="Life"
        subtitle="Prasādam Distribution"
        description="Thousands of free sanctified meals distributed every month across Nairobi - driven by compassion, sustained by community."
        image="/images/food-for-life/prasadam-students.jpg"
        height="md"
        className="sm:min-h-[500px]"
      />

      {/* Impact numbers */}
      <section className="bg-temple-brown py-12 section-padding">
        <div className="content-width">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { v: "10,000+", l: "Meals per Month" },
              { v: "12+", l: "Distribution Points" },
              { v: "10+", l: "Years Running" },
              { v: "500+", l: "Volunteers" },
            ].map(s => (
              <div key={s.l}>
                <p className="font-display text-gold text-4xl font-bold">{s.v}</p>
                <p className="font-body text-white/70 text-xs uppercase tracking-widest mt-2">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-section bg-temple-bg sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeading eyebrow="The Mission" title="No One Should" accent="Go Hungry" eyebrowClassName="eyebrow block mb-4" titleClassName="section-title mb-6" />
              <div className="space-y-4 font-body text-ink/75 leading-relaxed">
                <p>Food For Life began with a simple principle from Śrīla Prabhupāda: "No one within ten miles of a temple should go hungry." In Nairobi, we take that mandate seriously.</p>
                <p>Every day, our volunteers prepare fresh vegetarian prasādam in the temple kitchen and distribute it to street children, school students, and families in Kibera, Mathare, and beyond.</p>
                <p>The food is more than nutrition - it is sanctified, prepared with devotion, and offered to the Lord before distribution. Recipients receive not just sustenance but the mercy of prasādam.</p>
              </div>
              <ButtonLink variant="primary" href="/donate/food" className="mt-8 inline-flex">
                Fund a Meal Programme
              </ButtonLink>
            </div>
            <div>
              <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw" src="/images/food-for-life/prasadam-students.jpg" alt="Food distribution" className="w-full aspect-card object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Distribution areas */}
      <section className="py-section bg-temple-cream sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="text-center mb-12">
            <SectionHeading eyebrow="Where We Serve" title="Distribution Areas" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {["Kibera", "Mathare", "Korogocho", "Mukuru", "City Centre", "Juja", "Thika", "Westlands", "South B", "South C", "Karen", "Eastleigh"].map((area) => (
              <div key={area} className="flex items-center gap-3 bg-white p-4 border border-temple-sand">
                <span className="gold-dot flex-shrink-0" />
                <span className="font-body text-ink/75 text-sm">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-16 bg-primary-dark text-center section-padding">
        <h2 className="font-display text-display-md text-white mb-4">Volunteer With Us</h2>
        <p className="font-body text-white/80 mb-8 max-w-md mx-auto">Join our Food For Life team - cooking, distributing, fundraising, or driving. Every hour of service makes a direct impact.</p>
        <ButtonLink variant="ghost" href="/contact">Become a volunteer</ButtonLink>
      </section>
    </>
  );
}
