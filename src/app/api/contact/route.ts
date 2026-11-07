import { NextRequest, NextResponse } from "next/server";
import {
  publicApiErrorResponse,
  readLimitedJson,
  validatePublicJsonRequest,
} from "@/lib/apiSecurity";
import { asPlainText } from "@/lib/security";
import { callAppsScript } from "@/lib/appsScriptBridge";

export const runtime = "nodejs";
const maxRequestBytes = 16 * 1024;

type ContactPayload = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  formType?: unknown;
  website?: unknown;
};

export async function POST(request: NextRequest) {
  try {
    const blocked = validatePublicJsonRequest(request, {
      key: "contact",
      limit: 8,
      windowMs: 10 * 60 * 1000,
      maxBytes: maxRequestBytes,
    });
    if (blocked) return blocked;

    const payload = await readLimitedJson<ContactPayload>(request, maxRequestBytes);

    if (asPlainText(payload.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const firstName = asPlainText(payload.firstName, 60);
    const lastName = asPlainText(payload.lastName, 60);
    const email = asPlainText(payload.email, 120);
    const phone = asPlainText(payload.phone, 40);
    const subject = asPlainText(payload.subject, 80);
    const message = asPlainText(payload.message, 1200);
    const formType = asPlainText(payload.formType, 80);

    if (!firstName || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Please add your name, email address, subject, and message." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    if (phone && !/^[+0-9 ()-]{7,24}$/.test(phone)) {
      return NextResponse.json({ message: "Please enter a valid phone number." }, { status: 400 });
    }

    await callAppsScript("contact.submit", {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      formType: formType === "guest-house-enquiry" || subject === "Guest House Booking"
        ? "guest-house-enquiry"
        : "contact-us",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const publicError = publicApiErrorResponse(error);
    if (publicError) return publicError;

    console.error("Contact form submission failed", error);
    return NextResponse.json(
      { message: "Your message could not be sent. Please try again shortly." },
      { status: 500 }
    );
  }
}
