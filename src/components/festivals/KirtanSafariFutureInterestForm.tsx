"use client";

import FormMessage from "@/components/ui/FormMessage";
import { isValidEmail } from "@/lib/formValidation";
import { FormEvent, useState } from "react";

type Fields = { fullName: string; email: string; phone: string; city: string; consent: boolean; website: string };
const initialFields: Fields = { fullName: "", email: "", phone: "", city: "", consent: false, website: "" };

export default function KirtanSafariFutureInterestForm() {
  const [fields, setFields] = useState(initialFields);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fields.fullName.trim() || !fields.email.trim() || !fields.phone.trim() || !fields.city.trim() || !fields.consent) {
      setStatus("error");
      setMessage("Please complete every field and confirm that you would like future festival updates.");
      return;
    }
    if (!isValidEmail(fields.email)) {
      setStatus("error");
      setMessage("Please check your email address.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/kirtan-safari-future-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) throw new Error(result?.message ?? "Your request could not be submitted.");
      setStatus("success");
      setMessage("Thank you. We will share news of the next Kirtan Safari when it is announced.");
      setFields(initialFields);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please check your connection and try again.");
    }
  }

  return (
    <form className="ks-interest-form" onSubmit={submit} noValidate>
      <div className="ks-interest-fields">
        <label><span>Name</span><input required maxLength={120} autoComplete="name" value={fields.fullName} onChange={(event) => setFields({ ...fields, fullName: event.target.value })} /></label>
        <label><span>Email</span><input required maxLength={180} type="email" autoComplete="email" value={fields.email} onChange={(event) => setFields({ ...fields, email: event.target.value })} /></label>
        <label><span>WhatsApp number</span><input required maxLength={40} inputMode="tel" autoComplete="tel" value={fields.phone} onChange={(event) => setFields({ ...fields, phone: event.target.value })} /></label>
        <label><span>City or country</span><input required maxLength={100} autoComplete="address-level2" value={fields.city} onChange={(event) => setFields({ ...fields, city: event.target.value })} /></label>
        <label className="ks-interest-consent"><input type="checkbox" checked={fields.consent} onChange={(event) => setFields({ ...fields, consent: event.target.checked })} /><span>I would like to receive news about future Kirtan Safari editions.</span></label>
        <label className="ks-interest-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={(event) => setFields({ ...fields, website: event.target.value })} /></label>
      </div>
      <FormMessage status={status} message={message} className="mt-3" />
      <button type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Submitting..." : "Receive Future Updates"}</button>
      <style jsx>{`
        .ks-interest-fields { display:grid; gap:.8rem; grid-template-columns:repeat(2,minmax(0,1fr)); }
        label { display:grid; gap:.4rem; }
        label>span { color:#67544a; font:800 0.75rem/1 var(--font-body,sans-serif); letter-spacing:.12em; text-transform:uppercase; }
        input { background:#fffdf8; border:1px solid rgba(67,48,39,.22); color:#30231d; font:500 .9rem/1.3 var(--font-body,sans-serif); min-height:46px; padding:.75rem; width:100%; }
        .ks-interest-consent { align-items:flex-start; display:flex; gap:.65rem; grid-column:1/-1; }
        .ks-interest-consent input { accent-color:var(--color-festival-red); flex:none; min-height:0; width:1rem; }
        .ks-interest-consent span { font-size:0.75rem; line-height:1.45; text-transform:none; }
        .ks-interest-honeypot { left:-9999px; position:absolute; }
        button { background:var(--color-festival-red); border:0; color:white; cursor:pointer; font:800 0.75rem/1 var(--font-body,sans-serif); letter-spacing:.13em; margin-top:1rem; min-height:46px; padding:.9rem 1.2rem; text-transform:uppercase; }
        button:disabled { cursor:wait; opacity:.6; }
        @media(max-width:640px){ .ks-interest-fields{grid-template-columns:1fr;} }
      `}</style>
    </form>
  );
}
