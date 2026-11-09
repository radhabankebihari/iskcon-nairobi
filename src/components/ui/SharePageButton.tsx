"use client";

import { useEffect, useState } from "react";
import { Check, Share2 } from "lucide-react";

type SharePageButtonProps = {
  title: string;
  text?: string;
  label?: string;
  tone?: "dark" | "light";
};

export default function SharePageButton({ title, text, label = "Share", tone = "dark" }: SharePageButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2500);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function sharePage() {
    const url = window.location.href.split("#")[0];
    setStatus("idle");

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      const message = [title, text, url].filter(Boolean).join(" ");
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      setStatus("error");
    }
  }

  const feedback = status === "copied" ? "Link copied" : status === "error" ? "Copy failed" : "";

  return (
    <button
      type="button"
      data-testid="share-page"
      onClick={sharePage}
      className={`-mx-1 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm px-1 font-body text-xs font-semibold uppercase tracking-[0.18em] underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${tone === "dark" ? "text-gold-light hover:text-white" : "text-primary hover:text-primary-dark"}`}
      aria-label={status === "idle" ? label : feedback}
    >
      {status === "copied" ? <Check size={15} aria-hidden="true" /> : <Share2 size={15} aria-hidden="true" />}
      <span>{status === "idle" ? label : feedback}</span>
      <span role="status" aria-live="polite" className="sr-only">{feedback}</span>
    </button>
  );
}
