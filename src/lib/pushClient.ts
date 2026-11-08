"use client";

import { getDeviceId, readSyncState, writeSyncState } from "@/lib/pushDeviceStore";
import { needsPushSync, previousEndpointFor } from "@/lib/pushSyncPolicy";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

export const PUSH_FEATURE_KEYS = [
  "iskcon-calendar-notifications",
  "iskcon-noticeboard-notifications",
];

export function urlBase64ToUint8Array(
  base64String: string
): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function arrayBufferToBase64Url(buffer: ArrayBuffer | null): string {
  if (!buffer) {
    return "";
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function subscriptionToJson(subscription: PushSubscription) {
  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64Url(subscription.getKey("p256dh")),
      auth: arrayBufferToBase64Url(subscription.getKey("auth")),
    },
  };
}

function preferences() {
  return {
    calendar: window.localStorage.getItem("iskcon-calendar-notifications") === "enabled",
    noticeboard: window.localStorage.getItem("iskcon-noticeboard-notifications") === "enabled",
  };
}

async function currentSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

/** A subscription made with an older server key can never be delivered to. */
function usesCurrentServerKey(subscription: PushSubscription) {
  const key = subscription.options?.applicationServerKey;
  if (!key || !VAPID_PUBLIC_KEY) return true;

  const current = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
  const existing = new Uint8Array(key);
  return existing.length === current.length && existing.every((byte, index) => byte === current[index]);
}

async function subscribeToPush(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    if (!VAPID_PUBLIC_KEY) {
      return null;
    }

    return await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  } catch {
    return null;
  }
}

async function syncNow(subscription: PushSubscription): Promise<boolean> {
  try {
    const current = { endpoint: subscription.endpoint, ...preferences() };
    const last = await readSyncState();
    if (!needsPushSync(last, current, Date.now())) return true;

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: subscriptionToJson(subscription),
        deviceId: await getDeviceId(),
        previousEndpoint: previousEndpointFor(last, subscription.endpoint),
        preferences: { calendar: current.calendar, noticeboard: current.noticeboard },
      }),
    });

    if (!response.ok) return false;
    await writeSyncState({ ...current, syncedAt: Date.now() });
    return true;
  } catch {
    return false;
  }
}

// Several components ask for a sync as the page loads. Calls run one after
// another; once the first has saved its state, the rest find nothing changed
// and send nothing. A preference change made meanwhile is still sent, because
// it runs after the earlier call and sees the difference.
let syncInFlight: Promise<boolean> | null = null;

/**
 * Tell the server about this device's subscription, but only when something
 * changed: a new endpoint, new preferences, or a week since the last sync.
 */
async function registerWithServer(subscription: PushSubscription): Promise<boolean> {
  while (syncInFlight) {
    await syncInFlight;
  }

  const run = syncNow(subscription);
  syncInFlight = run;
  try {
    return await run;
  } finally {
    syncInFlight = null;
  }
}

export async function syncPushPreferences(
  registration: ServiceWorkerRegistration | null
): Promise<void> {
  if (!registration) return;

  const subscription = await currentSubscription(registration);
  if (subscription) {
    await registerWithServer(subscription);
  }
}

/**
 * Subscribe this device and save it on the server. Returns null when either
 * step fails, so callers never report notifications as on when they are not.
 */
export async function enablePushOnDevice(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  let existing = await currentSubscription(registration);

  if (existing && !usesCurrentServerKey(existing)) {
    // The server key changed; this subscription can no longer receive anything.
    try {
      await existing.unsubscribe();
    } catch {
      // A fresh subscription below replaces it either way.
    }
    existing = null;
  }

  if (existing) {
    return (await registerWithServer(existing)) ? existing : null;
  }

  const created = await subscribeToPush(registration);

  if (created) {
    // The device's earlier endpoint, if any, is sent as previousEndpoint and replaced.
    return (await registerWithServer(created)) ? created : null;
  }

  return null;
}

export async function disablePushOnDevice(
  registration: ServiceWorkerRegistration | null
): Promise<void> {
  if (!registration) {
    return;
  }

  const subscription = await currentSubscription(registration);
  const last = await readSyncState();
  const endpoint = subscription?.endpoint || last?.endpoint;

  if (subscription) {
    try {
      await subscription.unsubscribe();
    } catch {
      // ignore
    }
  }

  if (!endpoint) {
    return;
  }

  try {
    const response = await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, deviceId: await getDeviceId() }),
    });
    if (response.ok) {
      await writeSyncState(null);
    }
  } catch {
    // ignore
  }
}

export function keepDevicePushSubscribed(disabledKey: string): boolean {
  return PUSH_FEATURE_KEYS.some(
    (key) => key !== disabledKey && window.localStorage.getItem(key) === "enabled"
  );
}
