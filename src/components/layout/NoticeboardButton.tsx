"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, BellRing, ChevronRight, X } from "lucide-react";
import { getSiteNotices, type SiteNotice } from "@/data/notices";
import { cn } from "@/lib/utils";
import { markCurrentNoticesAsSent } from "@/components/system/NoticeNotificationManager";
import {
  disablePushOnDevice,
  enablePushOnDevice,
  keepDevicePushSubscribed,
  syncPushPreferences,
} from "@/lib/pushClient";
import { useKirtanSafariState } from "@/hooks/useKirtanSafariState";

const OPT_IN_KEY = "iskcon-noticeboard-notifications";
const READ_KEY = "iskcon-noticeboard-read";

type PermissionState = NotificationPermission | "unsupported";

function readMap(key: string) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function markNoticesRead(notices: SiteNotice[]) {
  const read = readMap(READ_KEY);
  const now = new Date().toISOString();

  notices.forEach((notice) => {
    read[notice.id] = read[notice.id] ?? now;
  });

  window.localStorage.setItem(READ_KEY, JSON.stringify(read));
}

type NoticeboardButtonProps = {
  statusBarVisible?: boolean;
};

export default function NoticeboardButton({ statusBarVisible = false }: NoticeboardButtonProps) {
  const festivalState = useKirtanSafariState();
  const notices = useMemo(
    () => getSiteNotices(festivalState),
    [festivalState]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<PermissionState>("default");
  const [enabled, setEnabled] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        setPermission("unsupported");
      } else {
        setPermission(Notification.permission);
        setEnabled(window.localStorage.getItem(OPT_IN_KEY) === "enabled");
      }

      const read = readMap(READ_KEY);
      setHasUnread(notices.some((notice) => !read[notice.id]));
    });
    return () => {
      cancelled = true;
    };
  }, [notices]);

  useEffect(() => {
    if (!enabled || permission !== "granted") {
      return undefined;
    }

    let cancelled = false;

    void navigator.serviceWorker.ready.then((registration) => {
      if (!cancelled) {
        void enablePushOnDevice(registration);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [enabled, permission]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);

    if (nextOpen) {
      markNoticesRead(notices);
      setHasUnread(false);
    }
  };

  const enableAlerts = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }

    setIsSaving(true);
    setSaveFailed(false);

    try {
      await navigator.serviceWorker.register("/sw.js");
      const result =
        Notification.permission === "granted"
          ? "granted"
          : await Notification.requestPermission();

      setPermission(result);

      if (result === "granted") {
        window.localStorage.setItem(OPT_IN_KEY, "enabled");
        markCurrentNoticesAsSent(notices);
        setEnabled(true);
        window.dispatchEvent(new Event("iskcon-noticeboard-notifications-changed"));

        const registration = await navigator.serviceWorker.ready;
        if (!(await enablePushOnDevice(registration))) {
          // The server did not save the subscription, so alerts are not really on.
          window.localStorage.removeItem(OPT_IN_KEY);
          setEnabled(false);
          window.dispatchEvent(new Event("iskcon-noticeboard-notifications-changed"));
          setSaveFailed(true);
          return;
        }
        await registration.showNotification("Noticeboard alerts enabled", {
          body: "New ISKCON Nairobi notices will notify this device.",
          tag: "iskcon-noticeboard-enabled",
          icon: "/brand/icon-192.png",
          badge: "/brand/icon-192.png",
          data: {
            url: "/",
          },
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const disableAlerts = async () => {
    window.localStorage.removeItem(OPT_IN_KEY);
    setEnabled(false);
    window.dispatchEvent(new Event("iskcon-noticeboard-notifications-changed"));

    if (!keepDevicePushSubscribed(OPT_IN_KEY)) {
      const registration = await navigator.serviceWorker.getRegistration();
      await disablePushOnDevice(registration ?? null);
    } else {
      const registration = await navigator.serviceWorker.getRegistration();
      await syncPushPreferences(registration ?? null);
    }
  };

  const alertsUnavailable = permission === "unsupported" || permission === "denied";
  const alertStatus = (() => {
    if (permission === "unsupported") return "This browser cannot show notifications.";
    if (permission === "denied") return "Notifications are blocked for this site. Allow them in your browser's site settings to turn alerts on.";
    if (isSaving) return enabled ? "Turning alerts off..." : "Turning alerts on...";
    if (saveFailed) return "Notifications could not be turned on right now. Please try again shortly.";
    if (enabled) return "On for this device. Tap the switch to turn alerts off.";
    return "Off. Tap the switch to get a notification when the temple posts a new notice.";
  })();

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-label="Open temple noticeboard"
        className={cn(
          "relative inline-flex h-11 w-11 items-center justify-center rounded-full border-0 bg-transparent text-gold drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-all hover:scale-105 hover:text-sand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
          isOpen && "text-sand"
        )}
      >
        <Bell size={18} className="max-[900px]:h-4 max-[900px]:w-4" />
        {hasUnread && (
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-sunset ring-2 ring-dusk" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "fixed left-3 right-3 z-[90] border border-gold/25 bg-[#fffaf0] text-ink shadow-[0_26px_80px_rgba(24,14,6,0.28)] sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+0.85rem)] sm:w-[420px]",
            statusBarVisible
              ? "top-[var(--site-chrome-height,112px)]"
              : "top-[var(--site-header-height,76px)]"
          )}
        >
          <div className="border-b border-temple-sand bg-dusk px-4 py-4 text-sand">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center bg-gold/15 text-gold">
                  <BellRing size={18} />
                </span>
                <div>
                  <p className="font-body text-xs font-bold uppercase tracking-[0.18em] text-gold">Temple noticeboard</p>
                  <h2 className="mt-1 font-display text-xl font-semibold leading-tight">Latest visitor updates</h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sand/75 transition hover:text-white"
                aria-label="Close noticeboard"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="max-h-[min(68vh,520px)] overflow-y-auto">
            <div className="space-y-3 p-4">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={notice.href}
                  onClick={() => setIsOpen(false)}
                  className="group block card-surface p-4 transition hover:border-gold/45 hover:shadow-card"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "font-body text-xs font-bold uppercase tracking-[0.15em]",
                        notice.priority === "high" ? "text-sunset" : "text-gold"
                      )}
                    >
                      {notice.tag}
                    </span>
                    <span className="font-body text-xs font-semibold uppercase tracking-[0.11em] text-ink/75">
                      {notice.dateLabel}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold leading-snug text-ink">{notice.title}</h3>
                      <p className="mt-2 font-body text-xs leading-relaxed text-ink/75">{notice.body}</p>
                    </div>
                    <ChevronRight size={16} className="mt-1 shrink-0 text-gold transition group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="border-t border-temple-sand bg-temple-cream/70 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p id="notice-alerts-label" className="font-body text-sm font-semibold text-ink">
                    New notice alerts
                  </p>
                  <p id="notice-alerts-status" aria-live="polite" className="mt-0.5 font-body text-xs leading-relaxed text-ink/75">
                    {alertStatus}
                  </p>
                </div>
                {/* A switch reads as on/off at a glance, and the same control turns alerts back off. */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={enabled}
                  aria-labelledby="notice-alerts-label"
                  aria-describedby="notice-alerts-status"
                  data-notice-alerts-switch
                  onClick={enabled ? disableAlerts : enableAlerts}
                  disabled={isSaving || alertsUnavailable}
                  className="group inline-flex min-h-11 shrink-0 items-center gap-2.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className={cn("w-7 text-right font-body text-xs font-bold uppercase tracking-wide", enabled ? "text-primary" : "text-ink/75")}>
                    {enabled ? "On" : "Off"}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative h-7 w-12 rounded-full border transition-colors group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-gold",
                      enabled ? "border-primary bg-primary" : "border-ink/30 bg-ink/15"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-0.5 h-[22px] w-[22px] rounded-full bg-white shadow transition-transform",
                        enabled ? "translate-x-[22px]" : "translate-x-0.5"
                      )}
                    />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
