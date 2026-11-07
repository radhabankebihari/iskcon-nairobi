import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Globe2, HeartHandshake } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function LeadershipSection() {
  return (
    <section id="guidance-vision" className="relative scroll-mt-24 overflow-hidden bg-temple-brown pt-10 pb-section text-sand sm:pt-[clamp(2rem,4vw,4rem)] sm:pb-[clamp(2rem,4vw,4rem)]">
      <div className="absolute inset-0">
        <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
          src="/images/prabhupada/prabhupada-golden-gate-kirtan.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.26]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dusk via-dusk/92 to-dusk/64" />
        <div className="absolute inset-0 bg-gradient-to-t from-dusk via-transparent to-black/30" />
      </div>

      <div className="relative z-10 content-width section-padding">
        <div className="mb-12 grid gap-10 lg:grid-cols-[0.94fr_0.86fr] lg:items-center">
          <div>
            <SectionHeading accentTone="gold" eyebrow="Guidance & Vision" title="Srila Prabhupada" accent="and Africa's doorway" eyebrowClassName="eyebrow block mb-4 text-gold" titleClassName="section-title-light" />
            <div className="relative mt-6 lg:hidden">
              <div className="relative overflow-hidden border border-gold/20 bg-dusk/92 p-3 shadow-card-hover">
                <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                  src="/images/prabhupada/srila-prabhupada-seated-smiling.jpg"
                  alt="Srila Prabhupada"
                  className="mx-auto aspect-[736/937] max-h-[520px] w-full object-contain opacity-95"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dusk/78 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                  <p className="font-body text-xs uppercase tracking-[0.16em] text-gold">Founder-Acarya</p>
                </div>
              </div>
            </div>
            <p className="font-editorial text-sand/86 text-2xl leading-relaxed mt-5 sm:text-3xl">
              Srila Prabhupada is not a historical footnote for ISKCON Nairobi. He is the source of its existence, its books, its kirtan, its Deities, and its Africa-facing mission.
            </p>
            <p className="mt-5 font-body text-sm leading-relaxed text-sand/75 max-w-xl">
              Public histories of the African mission record that after recovering in Mombasa, Prabhupada returned to Nairobi and launched the African preaching campaign from here. His vision was for Nairobi to become a welcoming centre where people throughout Kenya could encounter Krishna consciousness through worship, learning, prasadam, and service.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link
                href="/srila-prabhupada"
                className="group border border-gold/35 bg-gold/12 p-4 transition-all hover:-translate-y-0.5 hover:border-gold hover:bg-gold/18"
              >
                <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  Founder-Acarya
                </span>
                <span className="mt-2 flex items-center justify-between gap-4 font-display text-xl leading-tight text-white">
                  Nairobi Legacy
                  <ArrowRight className="shrink-0 text-gold transition-transform group-hover:translate-x-1" size={16} />
                </span>
                <span className="mt-2 block font-body text-xs leading-relaxed text-sand/75">
                  Read how Srila Prabhupada placed Nairobi within ISKCON's African mission.
                </span>
              </Link>

              <Link
                href="/leadership"
                className="group border border-sand/18 bg-white/[0.06] p-4 transition-all hover:-translate-y-0.5 hover:border-gold/70 hover:bg-white/[0.09]"
              >
                <span className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  Service Structure
                </span>
                <span className="mt-2 flex items-center justify-between gap-4 font-display text-xl leading-tight text-white">
                  Meet the Leaders
                  <ArrowRight className="shrink-0 text-gold transition-transform group-hover:translate-x-1" size={16} />
                </span>
                <span className="mt-2 block font-body text-xs leading-relaxed text-sand/75">
                  See the devotees guiding departments, education, worship, kirtan, and outreach.
                </span>
              </Link>
            </div>
          </div>

          <div className="relative max-lg:hidden">
            <div className="absolute -inset-4 border border-gold/20 max-sm:hidden" />
            <div className="relative overflow-hidden border border-gold/20 bg-dusk/92 p-4 shadow-card-hover">
              <Image width={1600} height={1200} sizes="(max-width: 768px) 100vw, 50vw"
                src="/images/prabhupada/srila-prabhupada-seated-smiling.jpg"
                alt="Srila Prabhupada"
                className="mx-auto aspect-[736/937] max-h-[720px] w-full object-contain opacity-95"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dusk/78 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                <p className="font-body text-xs uppercase tracking-[0.16em] text-gold">Founder-Acarya</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-9 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Globe2, label: "African mission", value: "Nairobi as the launch point for preaching across Africa" },
            { icon: BookOpen, label: "Living foundation", value: "His books as the standard for study and training" },
            { icon: HeartHandshake, label: "Nairobi instruction", value: "A spiritual home welcoming people throughout Kenya" },
          ].map((item) => (
            <div key={item.label} className="border border-gold/15 bg-white/5 p-5 shadow-card backdrop-blur-sm">
              <item.icon className="mb-3 text-gold" size={21} />
              <p className="font-body text-xs uppercase tracking-[0.14em] text-gold font-semibold">{item.label}</p>
              <p className="mt-2 font-display text-lg leading-tight text-white">{item.value}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
