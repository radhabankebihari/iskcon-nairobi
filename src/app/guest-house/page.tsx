import PageHero from "@/components/ui/PageHero";
import GuestHouseEnquiryForm from "@/components/sections/GuestHouseEnquiryForm";
import { guestRooms, templeInfo } from "@/data/site";
import Link from "next/link";
import { Wifi, Shield, Coffee, MapPin, Phone, Mail } from "lucide-react";
import { withSeo } from "@/lib/seo";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = withSeo({
  title: "Guest House",
  description: "Stay at ISKCON Nairobi's on-campus guest house. Serene, affordable accommodation with access to all temple programmes.",
  robots: { index: false, follow: false },
}, "/guest-house");

const facilities = [
  { icon: <Wifi size={18} />, label: "Free WiFi", desc: "High-speed internet across the campus" },
  { icon: <Coffee size={18} />, label: "Prasadam Meals", desc: "Fresh vegetarian meals available through temple programmes" },
  { icon: <Shield size={18} />, label: "24hr Security", desc: "Gated campus with round-the-clock security" },
  { icon: <MapPin size={18} />, label: "Temple Location", desc: "Hare Krishna Close, Nairobi" },
];

export default function GuestHousePage() {
  return (
    <>
      <PageHero
        title="Guest House"
        titleAccent="& Retreat Stay"
        subtitle="Spiritual Hospitality"
        description="Rest, retreat, and reconnect at ISKCON Nairobi's temple accommodation - simple rooms with access to daily temple programmes."
        image="/images/iskcon-thika-farm-2022.jpg"
        facts={["On the temple campus", "Vegetarian prasadam", "Free WiFi"]}
        height="md"
        className="sm:min-h-[500px]"
      />

      {/* Intro */}
      <section className="py-section bg-temple-bg sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading eyebrow="Why Stay With Us" title="A Temple Stay" accent="Unlike Any Other" eyebrowClassName="eyebrow block mb-4" titleClassName="section-title mb-6" />
              <div className="space-y-4 font-body text-ink/75 leading-relaxed">
                <p>Staying at ISKCON Nairobi's guest house means waking to the sound of conches and bells at 4:30 A.M., attending Mangala Arati as the city sleeps, and experiencing the full rhythm of a devotional community.</p>
                <p>Whether you are a visiting devotee, a spiritual seeker, or a researcher interested in Vaishnava life, the guest house offers a rare opportunity to experience authentic Krishna conscious community living.</p>
                <p>All rooms include access to the temple, prasadam timings, temple access, and retreat arrangements before travelling.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {facilities.map((f) => (
                <div key={f.label} className="bg-temple-cream p-6 border border-temple-sand hover:border-gold/30 transition-colors">
                  <div className="text-gold mb-3">{f.icon}</div>
                  <h4 className="font-display text-ink font-semibold mb-1">{f.label}</h4>
                  <p className="font-body text-ink/75 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-section bg-temple-cream sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="text-center mb-12">
            <SectionHeading eyebrow="Accommodation" title="Our Rooms" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {guestRooms.map((room) => (
              <div key={room.name} className="card-surface hover:shadow-card-hover hover:border-gold/30 transition-all overflow-hidden group">
                <div className="p-7">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-display text-xl font-semibold text-ink">{room.name}</h3>
                  </div>
                  <p className="font-body text-ink/75 text-xs mb-3">{room.capacity}</p>
                  <p className="font-body text-ink/75 text-sm leading-relaxed mb-5">{room.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {room.amenities.map((a) => (
                      <span key={a} className="font-body text-xs text-gold-ink bg-gold/10 px-2 py-1">{a}</span>
                    ))}
                  </div>
                  <Link
                    href={`/guest-house?room=${encodeURIComponent(room.name)}#enquire`}
                    className="min-h-11 block text-center bg-temple-brown text-white font-body text-sm font-semibold py-3 hover:bg-gold hover:text-ink transition-colors"
                  >
                    Enquire about this room
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking enquiry */}
      <section id="enquire" className="scroll-mt-28 py-section bg-temple-brown sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
        <div className="content-width section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="eyebrow text-gold block mb-4">Book Your Stay</span>
              <h2 className="font-display text-display-md text-temple-cream mb-4">
                Enquire About<br /><em className="not-italic font-normal">Availability</em>
              </h2>
              <p className="font-body text-white/60 leading-relaxed mb-6">
                Contact us with your preferred dates and room type. We respond within 24 hours.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={14} className="text-gold" />
                  <a href={`tel:${templeInfo.phoneHref}`} className="tap-target font-body text-white/60 text-sm hover:text-gold transition-colors">{templeInfo.phoneDisplay}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-gold" />
                  <a href={`mailto:${templeInfo.email}?subject=Guest%20House%20Enquiry`} className="tap-target font-body text-white/60 text-sm hover:text-gold transition-colors">{templeInfo.email}</a>
                </div>
              </div>
            </div>
            <GuestHouseEnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}

