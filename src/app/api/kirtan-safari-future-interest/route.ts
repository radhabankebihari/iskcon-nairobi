import { NextRequest, NextResponse } from "next/server";
import { publicApiErrorResponse, readLimitedJson, validatePublicJsonRequest } from "@/lib/apiSecurity";
import { asPlainText } from "@/lib/security";
import { callAppsScript } from "@/lib/appsScriptBridge";

export const runtime = "nodejs";
const maxRequestBytes = 10 * 1024;

type Payload = { fullName?: unknown; email?: unknown; phone?: unknown; city?: unknown; consent?: unknown; website?: unknown };

export async function POST(request: NextRequest) {
  try {
    const blocked = validatePublicJsonRequest(request, { key: "kirtan-safari-future-interest", limit: 5, windowMs: 10 * 60 * 1000, maxBytes: maxRequestBytes });
    if (blocked) return blocked;
    const payload = await readLimitedJson<Payload>(request, maxRequestBytes);
    if (asPlainText(payload.website, 200)) return NextResponse.json({ ok: true });
    const fullName = asPlainText(payload.fullName, 120);
    const email = asPlainText(payload.email, 180).toLowerCase();
    const phone = asPlainText(payload.phone, 40);
    const city = asPlainText(payload.city, 100);
    const consent = payload.consent === true;
    if (!fullName || !email || !phone || !city || !consent) return NextResponse.json({ message: "Please complete all fields and confirm your consent." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    if (!/^[+0-9 ()-]{7,24}$/.test(phone)) return NextResponse.json({ message: "Please enter a valid WhatsApp number." }, { status: 400 });
    await callAppsScript("kirtan.interest", { fullName, email, phone, city, consent });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const publicError = publicApiErrorResponse(error);
    if (publicError) return publicError;
    console.error("Kirtan Safari future-interest submission failed", error);
    return NextResponse.json({ message: "Your request could not be submitted. Please try again shortly." }, { status: 500 });
  }
}
