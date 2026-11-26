import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, Mail, MapPin, MessageCircle, Phone, Play } from "lucide-react";
import { templeInfo, templeScheduleGroups, navigation, socialLinks } from "@/data/site";
import BrandLogo from "@/components/ui/BrandLogo";

function SocialIcon({ name, label }: { name: string; label: string }) {
  if (name === "Instagram") {
    return <Camera size={16} />;
  }

  if (name === "YouTube") {
    return <Play size={16} fill="currentColor" />;
  }

  if (name === "WhatsApp") {
    return <MessageCircle size={16} />;
  }

  if (name === "Facebook") {
    return <span className="font-body text-base font-black leading-none">f</span>;
  }

  return <span className="font-body text-xs font-bold">{label}</span>;
}

export default function Footer() {
  const whatsappLink = socialLinks.find((link) => link.name === "WhatsApp");

  return (
    <footer className="bg-dusk">
      <div className="content-width section-padding py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-6 block w-fit pr-6 text-sand transition-colors hover:text-white">
              <BrandLogo className="h-16 w-[172px]" />
            </Link>
            <p className="font-body text-white/70 text-sm leading-relaxed mb-6 max-w-xs">
              Sri Sri Radha Bankebihari Temple: a home for worship, kirtan, learning, and prasadam in Nairobi, open to everyone.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, name }) => {
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="flex h-11 w-11 items-center justify-center border border-white/10 text-white/70 transition-colors hover:border-primary/50 hover:text-gold-light"
                  >
                    <SocialIcon name={name} label={label} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-body text-white font-semibold text-xs tracking-[0.15em] uppercase mb-5">Explore</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="tap-target font-body text-white/70 text-sm hover:text-gold-light transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-white font-semibold text-xs tracking-[0.15em] uppercase mb-5">
              Visiting Hours
            </h4>
            {/* Two lines instead of the full ritual schedule, which lives on the Visit page. */}
            <ul className="space-y-3">
              {templeScheduleGroups.map((group) => (
                <li key={group.title}>
                  <p className="font-body text-gold text-xs font-semibold uppercase tracking-[0.14em]">
                    {group.title.startsWith("Morning") ? "Morning" : "Evening"}
                  </p>
                  <p className="mt-1 font-body text-sm text-white/80">{group.timeRange}</p>
                </li>
              ))}
            </ul>
            <Link href="/visit#schedule" className="text-link tap-target mt-5 text-gold-light">
              Full daily schedule <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div>
            <h4 className="font-body text-white font-semibold text-xs tracking-[0.15em] uppercase mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="font-body text-white/70 text-sm leading-relaxed">
                  {templeInfo.addressLines.map((line) => (
                    <span key={line}>{line}<br /></span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <a href={`tel:${templeInfo.phoneHref}`} className="tap-target font-body text-white/70 text-sm hover:text-gold-light transition-colors">
                  {templeInfo.phoneDisplay}
                </a>
              </li>
              {whatsappLink && (
                <li className="flex items-center gap-3">
                  <MessageCircle size={14} className="text-gold flex-shrink-0" />
                  <a href={whatsappLink.href} target="_blank" rel="noopener noreferrer" className="tap-target font-body text-white/70 text-sm hover:text-gold-light transition-colors">
                    WhatsApp {templeInfo.phoneDisplay}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-gold flex-shrink-0" />
                <a href={`mailto:${templeInfo.email}`} className="tap-target font-body text-white/70 text-sm hover:text-gold-light transition-colors">
                  {templeInfo.email}
                </a>
              </li>
            </ul>

            <a
              href={templeInfo.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex items-center gap-2 mt-5 font-body text-sm text-gold-light font-semibold border-b border-primary/30 pb-0.5 hover:border-primary transition-colors"
            >
              Get directions
            </a>
          </div>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="content-width section-padding pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-center font-body text-white/70 text-xs sm:text-left">
            © {new Date().getFullYear()} ISKCON Nairobi. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-end">
            <Link href="/privacy" className="tap-target font-body text-white/70 text-xs hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="tap-target font-body text-white/70 text-xs hover:text-white transition-colors">Terms and Conditions</Link>
            <a
              href="https://esthrema.com"
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target group inline-flex items-center gap-2 border-l border-white/10 pl-4 font-body text-white/70 text-xs transition-colors hover:text-white"
              aria-label="Powered by Esthrema"
            >
              <span>Powered by</span>
              <Image
                src="/images/esthrema-logo.png"
                alt="Esthrema"
                width={85}
                height={32}
                sizes="85px"
                className="h-8 w-auto opacity-80 transition-opacity group-hover:opacity-100"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
