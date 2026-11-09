"use client";

import FormMessage from "@/components/ui/FormMessage";
import { isValidEmail } from "@/lib/formValidation";
import { FormEvent, useMemo, useState } from "react";

const attendanceDays = [
  "Thursday 27 August - Adivas",
  "Friday 28 August",
  "Saturday 29 August",
  "Sunday 30 August",
];

const hearAboutOptions = [
  "Temple announcement",
  "WhatsApp",
  "Instagram",
  "YouTube",
  "Friend or family",
  "Website",
  "Other",
];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  days: string[];
  peopleCount: string;
  hearAbout: string;
  wantsUpdates: boolean;
  website: string;
};

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  days: [],
  peopleCount: "1",
  hearAbout: "",
  wantsUpdates: true,
  website: "",
};

function cleanText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export default function KirtanSafariRegistrationForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const selectedDaysText = useMemo(
    () => (form.days.length ? form.days.join(", ") : "Select at least one day"),
    [form.days]
  );

  const updateField = (field: keyof FormState, value: string | boolean | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleDay = (day: string) => {
    setForm((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((item) => item !== day)
        : [...current.days, day],
    }));
  };

  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.website) {
      setStatus("success");
      setMessage("Thank you. Your registration has been received.");
      return;
    }

    if (!form.fullName.trim() || !form.phone.trim() || !form.days.length) {
      setStatus("error");
      setMessage("Please add your name, phone number, and at least one day you plan to attend.");
      return;
    }

    if (form.email.trim() && !isValidEmail(form.email)) {
      setStatus("error");
      setMessage("Please check your email address.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    const payload = {
      fullName: cleanText(form.fullName),
      email: cleanText(form.email),
      phone: cleanText(form.phone),
      days: form.days,
      peopleCount: cleanText(form.peopleCount),
      hearAbout: cleanText(form.hearAbout),
      wantsUpdates: form.wantsUpdates ? "Yes" : "No",
    };

    try {
      const response = await fetch("/api/kirtan-safari-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(result?.message || "Registration failed");
      }

      setStatus("success");
      setMessage("Thank you. Your Kirtan Safari registration has been received.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not submit the form. Please check your connection and try again."
      );
    }
  };

  return (
    <form onSubmit={submitRegistration} className="ks-registration-form" noValidate>
      <div className="ks-registration-grid">
        <label className="ks-field">
          <span>Full Name</span>
          <input
            value={form.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            autoComplete="name"
            maxLength={120}
            required
          />
        </label>

        <label className="ks-field">
          <span>Phone Number</span>
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            required
          />
        </label>

        <label className="ks-field">
          <span>Email (optional)</span>
          <input
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            inputMode="email"
            type="email"
            maxLength={160}
          />
        </label>

        <label className="ks-field">
          <span>Number of people (optional)</span>
          <input
            value={form.peopleCount}
            onChange={(event) => updateField("peopleCount", event.target.value)}
            inputMode="numeric"
            maxLength={3}
          />
        </label>

        <label className="ks-field ks-field-wide">
          <span>How did you hear about us? (optional)</span>
          <select
            value={form.hearAbout}
            onChange={(event) => updateField("hearAbout", event.target.value)}
          >
            <option value="">Select one</option>
            {hearAboutOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="ks-field ks-field-wide">
          <span>Days Attending</span>
          <div className="ks-days" aria-label={selectedDaysText}>
            {attendanceDays.map((day) => (
              <label key={day} className="ks-day-option">
                <input
                  type="checkbox"
                  checked={form.days.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="ks-updates ks-field-wide">
          <input
            type="checkbox"
            checked={form.wantsUpdates}
            onChange={(event) => updateField("wantsUpdates", event.target.checked)}
          />
          <span>Send me future Kirtan Safari and temple updates.</span>
        </label>

        <label className="ks-hidden-field" aria-hidden="true">
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

      <FormMessage status={status} message={message} tone="dark" className="mt-4" />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="ks-submit"
      >
        {status === "submitting" ? "Submitting..." : "Submit Registration"}
      </button>

      <style jsx>{`
        .ks-registration-form {
          background: rgba(246, 226, 177, 0.08);
          border: 1px solid rgba(214, 156, 43, 0.28);
          padding: clamp(1rem, 3vw, 1.75rem);
        }

        .ks-registration-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.9rem;
        }

        .ks-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .ks-field-wide {
          grid-column: 1 / -1;
        }

        .ks-field span,
        .ks-updates span {
          color: rgba(246, 226, 177, 0.78);
          font-family: var(--font-body, sans-serif);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ks-field input,
        .ks-field select {
          width: 100%;
          border: 1px solid rgba(246, 226, 177, 0.18);
          background: rgba(7, 28, 16, 0.74);
          color: #fff;
          font-family: var(--font-body, sans-serif);
          font-size: 1rem;
          padding: 0.85rem 0.9rem;
        }

        .ks-field input:focus,
        .ks-field select:focus {
          border-color: rgba(214, 156, 43, 0.75);
        }

        .ks-days {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.65rem;
        }

        .ks-day-option,
        .ks-updates {
          align-items: center;
          border: 1px solid rgba(246, 226, 177, 0.16);
          background: rgba(7, 28, 16, 0.58);
          cursor: pointer;
          display: flex;
          gap: 0.55rem;
          padding: 0.75rem;
        }

        .ks-day-option input,
        .ks-updates input {
          accent-color: var(--color-festival-gold);
          flex: 0 0 auto;
          height: 1rem;
          margin: 0;
          padding: 0;
          width: 1rem;
        }

        .ks-day-option span,
        .ks-updates span {
          color: rgba(255, 255, 255, 0.74);
          display: block;
          flex: 1 1 auto;
          font-size: 0.75rem;
          letter-spacing: 0.04em;
          line-height: 1.35;
          text-transform: none;
        }

        .ks-hidden-field {
          display: none;
        }

        .ks-submit {
          align-items: center;
          background: var(--color-festival-gold);
          border: 0;
          color: var(--color-festival-ink);
          cursor: pointer;
          display: inline-flex;
          font-family: var(--font-body, sans-serif);
          font-size: 0.75rem;
          font-weight: 800;
          justify-content: center;
          letter-spacing: 0.18em;
          margin-top: 1.2rem;
          padding: 1rem 1.4rem;
          text-transform: uppercase;
          width: 100%;
        }

        .ks-submit:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        @media (max-width: 640px) {
          .ks-registration-grid,
          .ks-days {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}
