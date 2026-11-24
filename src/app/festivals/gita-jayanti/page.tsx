import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Clock3, Gift, MapPin } from "lucide-react";
import SharePageButton from "@/components/ui/SharePageButton";
import StructuredPageData from "@/components/seo/StructuredPageData";
import { withSeo } from "@/lib/seo";

export const metadata = withSeo({
  title: "Gita Jayanti 2026",
  description: "Celebrate Gita Jayanti at ISKCON Nairobi on Sunday 20 December 2026. Complete Bhagavad-gita recitation begins at 10:30 AM, followed by prasadam.",
}, "/festivals/gita-jayanti");

export default function GitaJayantiPage() {
  return (
    <>
      <StructuredPageData
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Festivals", path: "/festivals" }, { name: "Gita Jayanti", path: "/festivals/gita-jayanti" }]}
        event={{ name: "Gita Jayanti", description: "Complete Bhagavad-gita recitation followed by prasadam at ISKCON Nairobi.", startDate: "2026-12-20", path: "/festivals/gita-jayanti" }}
      />
      <section className="relative min-h-[580px] overflow-hidden bg-dusk text-white sm:min-h-[700px]">
        <Image src="/images/book-marathon/bhagavad-gita-hero-desktop-composed.webp" alt="" fill priority sizes="100vw" className="hidden object-cover object-top sm:block" />
        <Image src="/images/book-marathon/bhagavad-gita-hero-mobile-composed.webp" alt="" fill priority sizes="100vw" className="object-cover sm:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-dusk/90 via-dusk/65 to-dusk/15 max-sm:bg-gradient-to-b max-sm:from-dusk/25 max-sm:via-dusk/35 max-sm:to-dusk/95" />
        <div className="relative z-10 mx-auto flex min-h-[580px] max-w-7xl flex-col justify-end px-6 pb-14 pt-32 sm:min-h-[700px] sm:px-10 sm:pb-20 lg:px-16">
          <span className="eyebrow mb-4 block text-gold">Sunday 20 December 2026</span>
          <h1 className="max-w-2xl font-display text-4xl leading-tight sm:text-6xl">Gita Jayanti</h1>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-white/85 sm:text-lg">
            Celebrate the day Lord Krishna spoke the Bhagavad-gita. Join us for a complete recitation of the Gita, followed by prasadam.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 font-body text-sm font-semibold text-white/90">
            <span className="inline-flex items-center gap-2"><Clock3 size={17} className="text-gold" aria-hidden="true" />10:30 AM</span>
            <span className="inline-flex items-center gap-2"><MapPin size={17} className="text-gold" aria-hidden="true" />ISKCON Nairobi</span>
          </div>
          <div className="mt-4"><SharePageButton title="Gita Jayanti at ISKCON Nairobi" label="Share this celebration" /></div>
        </div>
      </section>

      <section className="bg-temple-bg py-14 sm:py-20">
        <div className="content-width section-padding grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="eyebrow mb-4 block">The celebration</span>
            <h2 className="section-title max-w-xl">A day to hear the Gita together</h2>
            <p className="mt-5 max-w-xl font-body leading-relaxed text-ink/75">
              Gita Jayanti honours the moment Lord Krishna spoke the Bhagavad-gita to Arjuna. At the temple, devotees and guests will gather to recite the complete Gita and share prasadam afterward. Everyone is welcome to join.
            </p>
            <Link href="/visit" className="mt-7 inline-flex items-center gap-2 font-body text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-dark">
              Plan your visit <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-px border border-temple-sand bg-temple-sand sm:grid-cols-3">
            {[
              { icon: CalendarDays, label: "Date", value: "Sunday 20 December" },
              { icon: BookOpen, label: "Programme", value: "Complete Gita recitation" },
              { icon: Clock3, label: "Begins", value: "10:30 AM" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white px-6 py-7">
                <Icon size={22} className="text-primary" aria-hidden="true" />
                <p className="mt-5 font-body text-xs font-semibold uppercase text-ink/60">{label}</p>
                <p className="mt-2 font-display text-xl leading-snug text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="content-width section-padding grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="eyebrow mb-4 block">Give the gift of the Gita</span>
            <h2 className="section-title max-w-xl">Sponsor a Bhagavad-gita</h2>
            <p className="mt-5 max-w-xl font-body leading-relaxed text-ink/75">
              Help place Bhagavad-gita As It Is in someone&apos;s hands. The temple&apos;s Gita Jayanti sponsorship is KSh 500 per copy.
            </p>
            <div className="mt-7 border-l-2 border-gold pl-5 font-body text-sm leading-relaxed text-ink/80">
              <p><strong>M-Pesa Paybill:</strong> 4081881</p>
              <p><strong>Account:</strong> BBT</p>
              <p className="mt-2">For sponsorship enquiries: <a href="tel:+254753419194" className="font-semibold text-primary underline underline-offset-4">0753 419 194</a></p>
            </div>
          </div>
          <div className="flex items-center gap-5 border-t border-gold/40 py-8 lg:border-l lg:border-t-0 lg:pl-10">
            <Gift size={36} className="shrink-0 text-primary" aria-hidden="true" />
            <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">One book can begin a lifelong conversation.</p>
          </div>
        </div>
      </section>
    </>
  );
}
