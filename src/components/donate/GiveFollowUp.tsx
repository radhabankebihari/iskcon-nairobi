import { Mail, MessageCircle, Phone } from "lucide-react";
import { templeInfo } from "@/data/site";
import { generalCause, receiptMessageLink, type GivingCause } from "@/components/donate/givingCauses";

/** Simple ways for a donor to reach the temple office after giving. */
export default function GiveFollowUp({ cause = generalCause, className = "" }: { cause?: GivingCause; className?: string }) {
  const whatsapp = receiptMessageLink(cause);

  return (
    <div className={className}>
      <h3 className="font-display text-xl font-semibold text-ink">Contact the temple</h3>
      <p className="mt-1.5 font-body text-sm leading-relaxed text-ink/75">
        For a receipt, or to say which cause your gift is for.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        {whatsapp && (
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </a>
        )}
        <a href={`tel:${templeInfo.phoneHref}`} className="btn-outline justify-center">
          <Phone size={16} aria-hidden="true" /> Call
        </a>
        <a
          href={`mailto:${templeInfo.email}?subject=${encodeURIComponent(`Donation: ${cause.title}`)}`}
          className="btn-outline justify-center"
        >
          <Mail size={16} aria-hidden="true" /> Email
        </a>
      </div>
    </div>
  );
}
