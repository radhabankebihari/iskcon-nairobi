import { createECDH } from "node:crypto";
import { callAppsScript } from "@/lib/appsScriptBridge";

export type PushKeyCheck = { ok: boolean; message: string };

/**
 * Checks the push keys the reminder job signs with, without revealing them:
 * all three are set, the private key belongs to the public key, the public key
 * is the one browsers subscribed with, and the subject is a valid contact.
 */
export function checkPushKeys(env: Record<string, string | undefined> = process.env): PushKeyCheck {
  const publicKey = env.VAPID_PUBLIC_KEY?.trim();
  const privateKey = env.VAPID_PRIVATE_KEY?.trim();
  const subject = env.VAPID_SUBJECT?.trim();
  const browserKey = env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();

  const missing = [
    !publicKey && "VAPID_PUBLIC_KEY",
    !privateKey && "VAPID_PRIVATE_KEY",
    !subject && "VAPID_SUBJECT",
  ].filter(Boolean);
  if (missing.length) return { ok: false, message: `Missing: ${missing.join(", ")}` };

  try {
    const ecdh = createECDH("prime256v1");
    ecdh.setPrivateKey(Buffer.from(privateKey!, "base64url"));
    if (ecdh.getPublicKey().toString("base64url") !== publicKey) {
      return { ok: false, message: "VAPID_PRIVATE_KEY does not belong to VAPID_PUBLIC_KEY" };
    }
  } catch {
    return { ok: false, message: "VAPID_PRIVATE_KEY is not a valid key" };
  }

  if (browserKey && browserKey !== publicKey) {
    return { ok: false, message: "VAPID_PUBLIC_KEY differs from NEXT_PUBLIC_VAPID_PUBLIC_KEY" };
  }
  if (!/^(mailto:\S+@\S+|https:\/\/\S+)$/.test(subject!)) {
    return { ok: false, message: "VAPID_SUBJECT must be mailto:… or https://…" };
  }
  return { ok: true, message: `OK (${publicKey!.slice(0, 8)}…, ${subject})` };
}

export type CronRunRecord = {
  nairobiDate: string;
  result: "ok" | "sent" | "partial-failure" | "error";
  pushKeys: string;
  devices: number;
  due: string;
  details: string;
};

/** Writes one row to the Sheet's "Cron Runs" tab. Never throws: logging must not break the job. */
export async function recordCronRun(record: CronRunRecord) {
  try {
    await callAppsScript("cron.recordRun", record);
  } catch (error) {
    console.error("Could not record the cron run in the Sheet", error);
  }
}
