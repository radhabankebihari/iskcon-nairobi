"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Mail, MessageCircle, Phone, Smartphone } from "lucide-react";
import { socialLinks, templeGiving, templeInfo } from "@/data/site";
import { causeName, generalCause, type GivingCause } from "@/components/donate/givingCauses";

const whatsapp = socialLinks.find((link) => link.name === "WhatsApp");

function receiptMessageLink(cause: GivingCause) {
  if (!whatsapp) return null;
  const message =
    `Hare Krishna. I have given to ${causeName(cause)} by M-Pesa ` +
    `(Paybill ${templeGiving.mpesaPaybill}, account ${templeGiving.mpesaAccount}). ` +
    "Please send me a receipt. My name is ";
  return `${whatsapp.href}?text=${encodeURIComponent(message)}`;
}

function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the value stays visible to type in.
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 border border-white/15 bg-white/[0.06] px-4 py-3">
      <div className="min-w-0">
        <p className="font-body text-xs text-sand/75">{label}</p>
        <p className="font-display text-2xl font-semibold tracking-wide text-white sm:text-3xl">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="flex min-h-11 shrink-0 items-center gap-2 border border-gold/50 px-3 font-body text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-dusk"
        aria-label={`Copy ${label.toLowerCase()} ${value}`}
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

/**
 * How to give by M-Pesa: the Paybill steps with copyable numbers, then a
 * WhatsApp message that names the cause and asks for a receipt. Every cause
 * uses the same Paybill account, so the cause travels in that message.
 */
export default function MpesaPayCard({ cause = generalCause, className = "" }: { cause?: GivingCause; className?: string }) {
  const receiptLink = receiptMessageLink(cause);

  return (
    <aside id="give-mpesa" aria-labelledby="mpesa-heading" className={`scroll-mt-28 bg-dusk p-5 text-sand shadow-card-hover sm:p-7 ${className}`}>
      <h2 id="mpesa-heading" className="font-display text-2xl font-semibold text-white">
        Give with M-Pesa
      </h2>
      <p className="mt-1 font-body text-sm text-sand/75">
        Giving to <span className="font-semibold text-white">{causeName(cause)}</span>
      </p>

      <p className="mt-5 flex gap-3 font-body text-sm leading-relaxed text-sand/85">
        <Smartphone size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
        <span>
          Open M-Pesa, choose <strong className="text-white">Lipa na M-Pesa</strong>, then{" "}
          <strong className="text-white">Pay Bill</strong>.
        </span>
      </p>
      <div className="mt-4 grid gap-2.5">
        <CopyValue label="Business number" value={templeGiving.mpesaPaybill} />
        <CopyValue label="Account number" value={templeGiving.mpesaAccount} />
      </div>
      <p className="mt-3 font-body text-sm text-sand/75">Enter your amount and M-Pesa PIN to confirm.</p>

      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="font-body text-sm leading-relaxed text-sand/75">
          Then send a quick message so your gift reaches {causeName(cause)} and you receive a receipt.
        </p>
        {receiptLink && (
          <a href={receiptLink} target="_blank" rel="noopener noreferrer" className="btn-primary mt-4 w-full justify-center">
            <MessageCircle size={16} aria-hidden="true" /> Message us on WhatsApp
          </a>
        )}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <a
            href={`tel:${templeInfo.phoneHref}`}
            className="flex min-h-11 items-center justify-center gap-2 border border-white/20 font-body text-sm font-semibold text-sand transition-colors hover:border-white/50"
          >
            <Phone size={15} aria-hidden="true" /> Call
          </a>
          <a
            href={`mailto:${templeInfo.email}?subject=${encodeURIComponent(`Donation: ${cause.title}`)}`}
            className="flex min-h-11 items-center justify-center gap-2 border border-white/20 font-body text-sm font-semibold text-sand transition-colors hover:border-white/50"
          >
            <Mail size={15} aria-hidden="true" /> Email
          </a>
        </div>
      </div>
    </aside>
  );
}
