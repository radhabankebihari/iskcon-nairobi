"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { socialLinks } from "@/data/site";

const whatsappLink = socialLinks.find((link) => link.name === "WhatsApp");

export default function WhatsAppWidget() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!whatsappLink) {
    return null;
  }

  return (
    <a
      href={whatsappLink.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with ISKCON Nairobi on WhatsApp"
      className={cn(
        "group fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full border border-gold/25 bg-dusk py-1.5 pl-1.5 pr-1.5 shadow-card transition-all duration-500 hover:border-gold/50 hover:shadow-card-hover max-[900px]:bottom-3 max-[900px]:right-3 max-sm:border-0 max-sm:bg-transparent max-sm:p-0",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      )}
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform duration-300 group-hover:scale-105 max-[900px]:h-10 max-[900px]:w-10">
        <svg viewBox="0 0 24 24" className="h-6 w-6 max-[900px]:h-5 max-[900px]:w-5" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span
          className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-dusk bg-[#25D366]"
          aria-hidden="true"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-[pulse_2.4s_ease-in-out_infinite]" />
        </span>
      </span>
    </a>
  );
}
