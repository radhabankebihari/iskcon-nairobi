import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | ISKCON Nairobi" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[78svh] overflow-hidden bg-dusk text-temple-cream">
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/sunset-route.webp')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-b from-dusk/60 via-dusk/85 to-dusk"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-dusk/90 via-dusk/55 to-transparent"
        aria-hidden="true"
      />

      <section className="content-width section-padding flex w-full items-end pb-14 pt-36 sm:items-center sm:pb-20 sm:pt-44 lg:pt-36">
        <div className="grid w-full items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-3xl">
            <p className="eyebrow mb-5 text-gold">Page not found</p>
            <p
              className="font-display text-[clamp(5.5rem,26vw,12rem)] font-semibold leading-[0.7] text-white/10"
              aria-hidden="true"
            >
              404
            </p>
            <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.5rem,10vw,5.5rem)] font-semibold leading-[0.96] text-white text-shadow">
              This path ends here.
            </h1>
            <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-white/72 sm:text-lg">
              The page may have moved, but the temple doors remain open. Choose a path below to continue.
            </p>

            <nav aria-label="Page recovery options" className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink variant="primary" href="/" className="gap-2">
                <ArrowLeft size={17} aria-hidden="true" />
                Return home
              </ButtonLink>
              <ButtonLink variant="ghost" href="/visit" className="gap-2">
                <MapPin size={17} aria-hidden="true" />
                Plan a visit
              </ButtonLink>
              <ButtonLink variant="ghost" href="/festivals" className="gap-2">
                <CalendarDays size={17} aria-hidden="true" />
                View Festivals
              </ButtonLink>
            </nav>
          </div>

          <div className="hidden border-l border-gold/35 pl-6 text-right lg:block" aria-hidden="true">
            <p className="font-display text-xl italic text-temple-cream/80">Hare Krishna Temple</p>
            <p className="mt-2 font-body text-xs uppercase tracking-[0.16em] text-gold">
              Sri Sri Radha Bankebihari
            </p>
            <p className="mt-1 font-body text-xs text-white/70">Nairobi, Kenya</p>
          </div>
        </div>
      </section>
    </div>
  );
}
