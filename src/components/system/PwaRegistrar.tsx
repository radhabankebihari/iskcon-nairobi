"use client";

import { useEffect, useRef, useState } from "react";
import { RefreshCw, Sparkles, WifiOff, X } from "lucide-react";

type NetworkInformation = EventTarget & {
  effectiveType?: string;
  saveData?: boolean;
};

type ReleaseInfo = {
  version: string;
  name: string;
  publishedAt: string;
  updateMode: "silent" | "prompt";
  summary: string;
  highlights: string[];
};

type PromptedUpdate = {
  worker: ServiceWorker;
  release: ReleaseInfo;
};

const CURRENT_APP_VERSION = "1.0.0";
const VERSION_STORAGE_KEY = "iskcon-nairobi-app-version";
const UPDATE_INTERVAL_MS = 60 * 60 * 1000;

function isSlowConnection() {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return Boolean(
    navigator.onLine &&
      connection &&
      (connection.saveData || ["slow-2g", "2g"].includes(connection.effectiveType || ""))
  );
}

async function getLatestRelease(): Promise<ReleaseInfo | null> {
  try {
    const response = await fetch(`/app-version.json?t=${Date.now()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return (await response.json()) as ReleaseInfo;
  } catch {
    return null;
  }
}

export default function PwaRegistrar() {
  const [isOffline, setIsOffline] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [showSlowNotice, setShowSlowNotice] = useState(true);
  const [promptedUpdate, setPromptedUpdate] = useState<PromptedUpdate | null>(null);
  const refreshing = useRef(false);
  const refreshPending = useRef(false);
  const activatingVersion = useRef<string | null>(null);

  useEffect(() => {
    const updateConnectionState = () => {
      setIsOffline(!navigator.onLine);
      setIsSlow(isSlowConnection());
    };

    queueMicrotask(updateConnectionState);

    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    window.addEventListener("online", updateConnectionState);
    window.addEventListener("offline", updateConnectionState);
    connection?.addEventListener("change", updateConnectionState);

    return () => {
      window.removeEventListener("online", updateConnectionState);
      window.removeEventListener("offline", updateConnectionState);
      connection?.removeEventListener("change", updateConnectionState);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Development must always render the current source instead of a cached PWA shell.
    if (process.env.NODE_ENV !== "production") {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister()))
        );
      return;
    }

    const canRegister =
      window.location.protocol === "https:" || window.location.hostname === "localhost";
    if (!canRegister) return;

    if (!window.localStorage.getItem(VERSION_STORAGE_KEY)) {
      window.localStorage.setItem(VERSION_STORAGE_KEY, CURRENT_APP_VERSION);
    }

    let updateTimer: number | undefined;
    let registration: ServiceWorkerRegistration | undefined;

    const activateWorker = (worker: ServiceWorker, version?: string) => {
      activatingVersion.current = version || null;
      worker.postMessage({ type: "SKIP_WAITING" });
    };

    const processWaitingWorker = async (worker: ServiceWorker | null) => {
      if (!worker) return;

      const release = await getLatestRelease();
      const installedVersion =
        window.localStorage.getItem(VERSION_STORAGE_KEY) || CURRENT_APP_VERSION;

      if (
        release &&
        release.updateMode === "prompt" &&
        release.version !== installedVersion
      ) {
        setPromptedUpdate({ worker, release });
        return;
      }

      activateWorker(worker, release?.version);
    };

    const watchRegistration = (nextRegistration: ServiceWorkerRegistration) => {
      registration = nextRegistration;
      void processWaitingWorker(nextRegistration.waiting);

      nextRegistration.addEventListener("updatefound", () => {
        const installing = nextRegistration.installing;
        if (!installing) return;

        installing.addEventListener("statechange", () => {
          if (installing.state === "installed") {
            void processWaitingWorker(nextRegistration.waiting || installing);
          }
        });
      });

      updateTimer = window.setInterval(() => {
        if (navigator.onLine) void nextRegistration.update();
      }, UPDATE_INTERVAL_MS);
    };

    const registerServiceWorker = () => {
      void navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then(watchRegistration)
        .catch(() => {
          // The website remains usable when service workers are unavailable.
        });
    };

    const isEditing = () =>
      Boolean(
        document.activeElement?.matches(
          "input, textarea, select, [contenteditable='true']"
        )
      );

    const reloadWhenSafe = () => {
      if (refreshing.current) return;

      if (document.visibilityState !== "visible" || isEditing()) {
        refreshPending.current = true;
        return;
      }

      if (activatingVersion.current) {
        window.localStorage.setItem(VERSION_STORAGE_KEY, activatingVersion.current);
      }
      refreshing.current = true;
      window.location.reload();
    };

    const checkWhenVisible = () => {
      if (document.visibilityState !== "visible" || !navigator.onLine) return;

      if (refreshPending.current) {
        reloadWhenSafe();
        return;
      }

      if (registration?.waiting) {
        void processWaitingWorker(registration.waiting);
      } else {
        void registration?.update();
      }
    };

    document.addEventListener("visibilitychange", checkWhenVisible);
    navigator.serviceWorker.addEventListener("controllerchange", reloadWhenSafe);

    if (document.readyState === "complete") {
      registerServiceWorker();
    } else {
      window.addEventListener("load", registerServiceWorker, { once: true });
    }

    return () => {
      if (updateTimer) window.clearInterval(updateTimer);
      document.removeEventListener("visibilitychange", checkWhenVisible);
      navigator.serviceWorker.removeEventListener("controllerchange", reloadWhenSafe);
      window.removeEventListener("load", registerServiceWorker);
    };
  }, []);

  const installPromptedUpdate = () => {
    if (!promptedUpdate) return;
    activatingVersion.current = promptedUpdate.release.version;
    promptedUpdate.worker.postMessage({ type: "SKIP_WAITING" });
    setPromptedUpdate(null);
  };

  if (promptedUpdate) {
    return (
      <aside
        role="dialog"
        aria-labelledby="app-update-title"
        aria-describedby="app-update-summary"
        className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-[95] mx-auto max-w-md border border-gold/40 bg-dusk p-5 text-sand shadow-card-hover sm:inset-x-auto sm:right-6 sm:mx-0"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-gold text-dusk">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-body text-xs font-bold uppercase tracking-[0.16em] text-gold">
              Version {promptedUpdate.release.version}
            </p>
            <h2 id="app-update-title" className="mt-1 font-display text-xl font-semibold text-white">
              {promptedUpdate.release.name}
            </h2>
            <p id="app-update-summary" className="mt-2 font-body text-sm leading-relaxed text-sand/75">
              {promptedUpdate.release.summary}
            </p>
            {promptedUpdate.release.highlights.length > 0 && (
              <ul className="mt-3 space-y-1 font-body text-xs leading-relaxed text-sand/75">
                {promptedUpdate.release.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight}>• {highlight}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPromptedUpdate(null)}
            className="min-h-11 border border-sand/25 px-4 font-body text-xs font-bold uppercase tracking-[0.12em] text-sand transition-colors hover:border-sand/50"
          >
            Later
          </button>
          <button
            type="button"
            onClick={installPromptedUpdate}
            className="flex min-h-11 items-center justify-center gap-2 bg-gold px-4 font-body text-sm font-bold text-dusk transition-colors hover:bg-gold-light"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Update now
          </button>
        </div>
      </aside>
    );
  }

  if (isOffline || (isSlow && showSlowNotice)) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed left-1/2 top-[calc(env(safe-area-inset-top)+5.25rem)] z-[90] flex w-[min(92vw,30rem)] -translate-x-1/2 items-center gap-3 border border-acacia/40 bg-[#24382a] px-4 py-3 text-sand shadow-card-hover"
      >
        <WifiOff className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        <p className="min-w-0 flex-1 font-body text-xs leading-snug">
          {isOffline
            ? "You are offline. Saved pages remain available."
            : "Connection is slow. Saved content will be used when available."}
        </p>
        {!isOffline && (
          <button
            type="button"
            onClick={() => setShowSlowNotice(false)}
            aria-label="Dismiss connection notice"
            className="flex h-8 w-8 shrink-0 items-center justify-center text-sand/75 transition-colors hover:text-sand"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }

  return null;
}
