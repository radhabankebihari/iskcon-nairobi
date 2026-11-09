"use client";

import FormMessage from "@/components/ui/FormMessage";
import { isValidEmail } from "@/lib/formValidation";
import { FormEvent, useEffect, useState } from "react";
import { guestRooms } from "@/data/site";

type FormState = {
  fullName: string;
  email: string;
  arrival: string;
  departure: string;
  message: string;
  website: string;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  arrival: "",
  departure: "",
  message: "",
  website: "",
};

function cleanText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

const inputClass =
  "w-full bg-white/10 border border-white/15 text-white placeholder-white/30 font-body text-sm px-4 py-3 focus:border-gold";

export default function GuestHouseEnquiryForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // A room chosen from a room card arrives as ?room=; only known room names are used.
  useEffect(() => {
    const room = new URLSearchParams(window.location.search).get("room");
    if (!room || !guestRooms.some((item) => item.name === room)) return;
    const timer = window.setTimeout(() => {
      setForm((current) => (current.message ? current : { ...current, message: `I'd like to ask about the ${room}.` }));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitEnquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.website) {
      setStatus("success");
      setMessage("Thank you. Your enquiry has been sent.");
      return;
    }

    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setMessage("Please add your name, email address, and a message.");
      return;
    }

    if (!isValidEmail(form.email)) {
      setStatus("error");
      setMessage("Please check your email address.");
      return;
    }

    if (form.arrival && form.departure && form.departure < form.arrival) {
      setStatus("error");
      setMessage("Please choose a departure date after your arrival date.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const details = [
      form.arrival ? `Arrival: ${form.arrival}` : "",
      form.departure ? `Departure: ${form.departure}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const payload = {
      firstName: cleanText(form.fullName),
      email: cleanText(form.email),
      subject: "Guest House Booking",
      message: [details, cleanText(form.message)].filter(Boolean).join("\n\n"),
      formType: "guest-house-enquiry",
      website: cleanText(form.website),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(result?.message || "Your enquiry could not be sent.");
      }

      setStatus("success");
      setMessage("Thank you. Your enquiry has been received and we will get back to you shortly.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not send your enquiry. Please check your connection and try again."
      );
    }
  };

  return (
    <form onSubmit={submitEnquiry} className="bg-white/5 border border-white/10 p-8 space-y-4" noValidate>
      <div>
        <label htmlFor="guest-house-field-1" className="font-body text-white/70 text-xs uppercase tracking-wider block mb-1.5">Full Name</label>
        <input id="guest-house-field-1"
          value={form.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          type="text"
          placeholder="Your name"
          autoComplete="name"
          maxLength={100}
          pattern="[^<>{}]*"
          required
          title="Please do not include code, angle brackets, or markup."
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="guest-house-field-2" className="font-body text-white/70 text-xs uppercase tracking-wider block mb-1.5">Email Address</label>
        <input id="guest-house-field-2"
          value={form.email}
          onChange={(event) => updateField("email", event.target.value)}
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          maxLength={120}
          required
          className={inputClass}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="guest-house-field-3" className="font-body text-white/70 text-xs uppercase tracking-wider block mb-1.5">Arrival Date (optional)</label>
          <input id="guest-house-field-3"
            value={form.arrival}
            onChange={(event) => updateField("arrival", event.target.value)}
            type="date"
            autoComplete="off"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="guest-house-field-4" className="font-body text-white/70 text-xs uppercase tracking-wider block mb-1.5">Departure Date (optional)</label>
          <input id="guest-house-field-4"
            value={form.departure}
            onChange={(event) => updateField("departure", event.target.value)}
            type="date"
            autoComplete="off"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="guest-house-field-5" className="font-body text-white/70 text-xs uppercase tracking-wider block mb-1.5">Message</label>
        <textarea id="guest-house-field-5"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          rows={3}
          placeholder="Room preference, special requirements..."
          maxLength={800}
          required
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) => updateField("website", event.target.value)}
          />
        </label>
      </div>

      <FormMessage status={status} message={message} tone="dark" />

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full justify-center text-xs mt-2">
        {status === "submitting" ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
