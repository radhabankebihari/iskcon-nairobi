"use client";

import type { PushSyncState } from "@/lib/pushSyncPolicy";

/**
 * Device identity and last push sync, kept in IndexedDB so the service worker
 * can read them too. public/sw.js opens the same database, store, and keys;
 * keep the two in step.
 */
const DB_NAME = "iskcon-push";
const DB_VERSION = 1;
const STORE = "kv";
const DEVICE_ID_KEY = "deviceId";
const SYNC_KEY = "sync";
// A copy for browsers where IndexedDB is unavailable, such as some private modes.
const DEVICE_ID_FALLBACK_KEY = "iskcon-push-device-id";

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) {
          request.result.createObjectStore(STORE);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function read<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  if (!db) return undefined;
  try {
    return await new Promise<T | undefined>((resolve) => {
      const request = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => resolve(undefined);
    });
  } finally {
    db.close();
  }
}

async function write(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  if (!db) return;
  try {
    await new Promise<void>((resolve) => {
      const transaction = db.transaction(STORE, "readwrite");
      if (value === undefined) transaction.objectStore(STORE).delete(key);
      else transaction.objectStore(STORE).put(value, key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
      transaction.onabort = () => resolve();
    });
  } finally {
    db.close();
  }
}

function newDeviceId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // RFC 4122 version 4 from secure random bytes.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

const DEVICE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

let deviceIdPromise: Promise<string> | null = null;

/** This browser's stable device ID, created once and shared with the service worker. */
export function getDeviceId(): Promise<string> {
  deviceIdPromise ??= (async () => {
    const stored = await read<string>(DEVICE_ID_KEY);
    let fallback: string | null = null;
    try {
      fallback = window.localStorage.getItem(DEVICE_ID_FALLBACK_KEY);
    } catch {
      // Storage can be blocked; IndexedDB alone is enough.
    }

    const id = [stored, fallback].find((value) => value && DEVICE_ID_PATTERN.test(value)) || newDeviceId();
    if (stored !== id) await write(DEVICE_ID_KEY, id);
    try {
      if (fallback !== id) window.localStorage.setItem(DEVICE_ID_FALLBACK_KEY, id);
    } catch {
      // Ignore; see above.
    }
    return id;
  })();
  return deviceIdPromise;
}

export async function readSyncState(): Promise<PushSyncState | null> {
  const state = await read<PushSyncState>(SYNC_KEY);
  return state && typeof state.endpoint === "string" ? state : null;
}

export function writeSyncState(state: PushSyncState | null) {
  return write(SYNC_KEY, state ?? undefined);
}
