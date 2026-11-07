import { NextRequest, NextResponse } from "next/server";
import {
  publicApiErrorResponse,
  readLimitedJson,
  validatePublicJsonRequest,
} from "@/lib/apiSecurity";
import { asPlainText } from "@/lib/security";
import { callAppsScript } from "@/lib/appsScriptBridge";

export const runtime = "nodejs";
const maxRequestBytes = 12 * 1024;

type RegistrationPayload = {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  days?: unknown;
  peopleCount?: unknown;
  hearAbout?: unknown;
  wantsUpdates?: unknown;
  website?: unknown;
};

const attendanceDays = new Set([
  "Thursday 27 August - Adivas",
  "Friday 28 August",
  "Saturday 29 August",
  "Sunday 30 August",
]);

export async function POST(request: NextRequest) {
  try {
    const blocked = validatePublicJsonRequest(request, {
      key: "kirtan-registration",
      limit: 6,
      windowMs: 10 * 60 * 1000,
      maxBytes: maxRequestBytes,
    });
    if (blocked) return blocked;

    const payload = await readLimitedJson<RegistrationPayload>(request, maxRequestBytes);

    if (asPlainText(payload.website, 200)) {
      return NextResponse.json({ ok: true });
    }

    const fullName = asPlainText(payload.fullName, 120);
    const email = asPlainText(payload.email, 160);
    const phone = asPlainText(payload.phone, 40);
    const peopleCountText = asPlainText(payload.peopleCount, 3);
    const hearAbout = asPlainText(payload.hearAbout, 80);
    const wantsUpdates = payload.wantsUpdates === "Yes" || payload.wantsUpdates === true ? "Yes" : "No";
    const selectedDays = Array.isArray(payload.days)
      ? payload.days
          .filter((day): day is string => typeof day === "string" && attendanceDays.has(day))
          .slice(0, attendanceDays.size)
      : [];

    const peopleCount = Number.parseInt(peopleCountText, 10);
    const validPeopleCount = Number.isFinite(peopleCount)
      ? Math.min(Math.max(peopleCount, 1), 999)
      : 1;

    if (!fullName || !phone || selectedDays.length === 0) {
      return NextResponse.json(
        { message: "Please add your name, phone number, and at least one day you plan to attend." },
        { status: 400 }
      );
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    if (!/^[+0-9 ()-]{7,24}$/.test(phone)) {
      return NextResponse.json({ message: "Please enter a valid phone number." }, { status: 400 });
    }

    await callAppsScript("kirtan.register", {
      fullName,
      email,
      phone,
      days: selectedDays,
      peopleCount: validPeopleCount,
      hearAbout,
      wantsUpdates,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const publicError = publicApiErrorResponse(error);
    if (publicError) return publicError;

    console.error("Kirtan Safari registration failed", error);
    return NextResponse.json(
      { message: "Registration could not be submitted. Please try again shortly." },
      { status: 500 }
    );
  }
}
