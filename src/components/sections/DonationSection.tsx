import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { templeGiving } from "@/data/site";

// A single invitation to give. The causes, payment steps, and cause pages live
// on /donate, so the homepage only makes the case and points there.
export default function DonationSection() {
  return (
    <section
      aria-labelledby="support-heading"
      className="relative isolate overflow-hidden py-16 sm:py-[clamp(4rem,8vw,6.5rem)]"
    >
      <Image
        src="/images/donate/main-altar-offering.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-dusk/95 via-dusk/85 to-dusk/55" />

      <div className="content-width section-padding">
        <div className="max-w-2xl">
          <span className="eyebrow mb-3 block text-gold">Make a Difference</span>
          <h2 id="support-heading" className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Support the Mission
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-sand/85 sm:text-lg">
            Your gift keeps the temple&apos;s daily worship going and helps share prasadam, care for the cows at Thika,
            mentor students, and open our festivals to all of Nairobi.
          </p>

          <p className="mt-6 inline-flex items-start gap-2.5 border border-white/20 bg-white/10 px-4 py-2.5 font-body text-sm text-sand">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
            <span>
              <span className="whitespace-nowrap">Give by M-Pesa:</span>{" "}
              <span className="whitespace-nowrap font-semibold text-white">Paybill {templeGiving.mpesaPaybill}</span>,{" "}
              <span className="whitespace-nowrap font-semibold text-white">account {templeGiving.mpesaAccount}</span>
            </span>
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/donate" className="btn-primary justify-center" data-donation-cta>
              <Heart size={16} aria-hidden="true" /> Give to the temple
            </Link>
            <Link
              href="/donate#causes"
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/40 px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              See where gifts go <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
