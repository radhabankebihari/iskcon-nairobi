import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/sections/ContactForm";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import { socialLinks, templeInfo } from "@/data/site";
import { withSeo } from "@/lib/seo";

export const metadata = withSeo({
  title: "Contact",
  description: "Get in touch with ISKCON Nairobi. Temple address, phone, email, and enquiry form.",
}, "/contact");

const whatsapp = socialLinks.find((link) => link.name === "WhatsApp");

export default function ContactPage() {
  const contactItems = [
    { icon: <MapPin size={16} />, label: "Address", value: templeInfo.addressLines.join("\n"), href: templeInfo.mapUrl },
    { icon: <Phone size={16} />, label: "Phone", value: templeInfo.phoneDisplay, href: `tel:${templeInfo.phoneHref}` },
    { icon: <Mail size={16} />, label: "Email", value: templeInfo.email, href: `mailto:${templeInfo.email}` },
    { icon: <Clock size={16} />, label: "Temple Hours", value: templeInfo.hours },
  ];

  return (
    <>
      <PageHero
        title="Get in"
        titleAccent="Touch"
        subtitle="Contact Us"
        variant="compact"
      />

      <section className="py-section bg-temple-bg">
        <div className="content-width section-padding">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <span className="eyebrow block mb-4">Temple Contact</span>
                <h2 className="section-title text-2xl mb-6">We'd love to hear from you</h2>
                {/* The quickest routes first; the form is for anything that can wait. */}
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <a href={`tel:${templeInfo.phoneHref}`} className="btn-primary justify-center">
                    <Phone size={16} aria-hidden="true" /> Call the temple
                  </a>
                  {whatsapp && (
                    <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn-outline justify-center">
                      <MessageSquare size={16} aria-hidden="true" /> WhatsApp
                    </a>
                  )}
                  <a href={templeInfo.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline justify-center">
                    <MapPin size={16} aria-hidden="true" /> Directions
                  </a>
                </div>
              </div>
              {contactItems.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="text-gold mt-0.5 flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-body text-xs font-semibold uppercase tracking-wider text-ink/75 mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="tap-target block font-body text-ink/75 text-sm whitespace-pre-line leading-relaxed transition-colors hover:text-primary hover:underline"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-body text-ink/75 text-sm whitespace-pre-line leading-relaxed">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 bg-temple-cream border border-temple-sand p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare size={20} className="text-gold" />
                <h3 className="font-display text-2xl font-semibold text-ink">Send a message</h3>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
