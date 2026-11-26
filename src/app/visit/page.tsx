import PageHero from "@/components/ui/PageHero";
import { templeInfo, templeSchedule, templeScheduleGroups } from "@/data/site";
import { MapPin, Clock, Phone, AlertCircle, ChevronDown } from "lucide-react";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata = withSeo({
  title: "Temple Timings and Directions",
  description: "Plan a visit to ISKCON Nairobi in Parklands. Find daily temple timings, directions, worship highlights and what to expect on your first visit.",
  openGraph: { images: [{ url: "/images/iskcon-nairobi-aerial.jpg", width: 1920, height: 1280, alt: "ISKCON Nairobi temple from above" }] },
  twitter: { images: ["/images/iskcon-nairobi-aerial.jpg"] },
}, "/visit");

// The moments most visitors come for. The full ritual schedule stays one tap away.
const keyMoments = [
  "Mangala Arati",
  "Deity Greeting",
  "Srimad-Bhagavatam Class",
  "Raj Bhoga Arati",
  "Sandhya Arati",
].flatMap((event) => templeSchedule.filter((item) => item.event === event));

export default function VisitPage() {
  return (
    <>
      <PageHero
        title="Visit the"
        titleAccent="Temple"
        subtitle="Plan Your Visit"
        description="The temple is open daily to all visitors. Come as you are - no prior experience needed."
        image="/images/iskcon-nairobi-aerial.jpg"
        facts={["Open daily: 4:30 AM-1:00 PM and 4:20-8:30 PM", "Hare Krishna Close, Parklands", "Everyone welcome"]}
        className="sm:min-h-[500px]"
      />

      <section className="pt-section-sm pb-section bg-temple-bg">
        <div className="content-width section-padding">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="mb-12">
                <span className="eyebrow block mb-4">First Time Visiting?</span>
                <h2 className="font-display text-2xl text-ink mb-6">What to Expect</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { title: "Dress modestly", desc: "Visitors are welcome in modest attire. Shawls and simple coverings are often available at the entrance." },
                    { title: "Remove footwear", desc: "Shoes are removed before entering the temple hall. Follow the temple signs or ask a volunteer." },
                    { title: "Prasadam is free", desc: "Sanctified vegetarian food is distributed after many temple programmes." },
                    { title: "Photography", desc: "Photography is permitted in most areas. Please ask before photographing during arati or classes." },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <span className="gold-dot mt-2 flex-shrink-0" />
                      <div>
                        <p className="font-body font-semibold text-ink text-sm mb-1">{item.title}</p>
                        <p className="font-body text-ink/75 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <span id="schedule" className="block scroll-mt-32" aria-hidden="true" />
              <SectionHeading eyebrow="Daily Programmes" title="Temple Schedule" eyebrowClassName="eyebrow block mb-4" titleClassName="section-title mb-8" />
              <ul className="divide-y divide-temple-sand border border-temple-sand bg-white">
                {keyMoments.map((item) => (
                  <li key={item.event} className="flex items-center gap-5 px-5 py-4">
                    <span className="w-24 flex-shrink-0 font-body text-sm font-semibold text-gold-ink">{item.time}</span>
                    <span className="font-display text-lg text-ink">{item.event}</span>
                  </li>
                ))}
              </ul>

              <details className="group mt-6 border border-temple-sand bg-white/50">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 font-body text-sm font-semibold text-ink">
                  Show the full daily schedule
                  <ChevronDown size={18} aria-hidden="true" className="text-primary transition-transform group-open:rotate-180" />
                </summary>
                <div className="space-y-6 border-t border-temple-sand p-4 sm:p-5">
                  {templeScheduleGroups.map((group) => (
                    <div key={group.title} className="border border-temple-sand bg-white/50">
                      <div className="border-b border-temple-sand p-4">
                        <p className="font-display text-ink text-xl">{group.title}</p>
                        <p className="font-body text-gold-ink text-xs font-semibold tracking-widest uppercase mt-1">{group.timeRange}</p>
                      </div>
                      <div className="divide-y divide-temple-sand">
                        {group.items.map((item) => (
                          <div key={`${group.title}-${item.time}-${item.event}`} className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-5">
                              <span className="font-body text-gold-ink font-semibold text-sm w-24 flex-shrink-0">{item.time}</span>
                              <span className="font-display text-ink text-lg">{item.event}</span>
                            </div>
                            <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gold/40" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>

            </div>

            <div className="space-y-6 max-lg:order-first">
              <div className="bg-temple-cream p-8 border border-temple-sand">
                <h2 className="font-display text-xl font-semibold text-ink mb-6">Find Us</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-body font-medium text-ink text-sm">Address</p>
                      <p className="font-body text-ink/75 text-sm mt-0.5 leading-relaxed">
                        {templeInfo.addressLines.map((line) => (
                          <span key={line}>{line}<br /></span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-body font-medium text-ink text-sm">Opening Hours</p>
                      <p className="font-body text-ink/75 text-sm mt-0.5 whitespace-pre-line">{templeInfo.hours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="text-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-body font-medium text-ink text-sm">Phone</p>
                      <a href={`tel:${templeInfo.phoneHref}`} className="font-body text-gold-ink text-sm hover:underline">{templeInfo.phoneDisplay}</a>
                    </div>
                  </div>
                </div>
                <a
                  href={templeInfo.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center mt-6"
                >
                  Open in Google Maps
                </a>
              </div>

              <div className="flex gap-3 bg-gold/10 border border-gold/20 p-4">
                <AlertCircle size={16} className="text-gold flex-shrink-0 mt-0.5" />
                <p className="font-body text-ink/75 text-xs leading-relaxed">
                  {templeInfo.note}
                </p>
              </div>

              <div className="bg-temple-brown p-6">
                <p className="font-display text-gold text-lg mb-2">Staying Longer?</p>
                <p className="font-body text-white/60 text-sm leading-relaxed mb-4">
                  Contact the temple about guest accommodation, retreats, and extended spiritual visits.
                </p>
                <ButtonLink variant="ghost" href="/guest-house" className="w-full justify-center">
                  View the guest house
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
