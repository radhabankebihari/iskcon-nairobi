"use client";

import { useEffect, useState } from "react";
import { BellRing, CalendarDays, ShieldCheck } from "lucide-react";
import { calendarNotificationEvents } from "@/lib/calendarNotifications";
import {
  disablePushOnDevice,
  enablePushOnDevice,
  keepDevicePushSubscribed,
  syncPushPreferences,
} from "@/lib/pushClient";

const OPT_IN_KEY = "iskcon-calendar-notifications";

type PermissionState = NotificationPermission | "unsupported";

export default function CalendarNotificationOptIn() {
  const [permission, setPermission] = useState<PermissionState>("default");
  const [enabled, setEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const [upcomingEvents, setUpcomingEvents] = useState(() =>
    calendarNotificationEvents.slice(0, 3)
  );

  useEffect(() => {
    queueMicrotask(() => {
      const now = Date.now();
      setUpcomingEvents(
        calendarNotificationEvents
          .filter((event) => Date.parse(event.startsAt) >= now)
          .slice(0, 3)
      );

      if (!("Notification" in window) || !("serviceWorker" in navigator)) {
        setPermission("unsupported");
        return;
      }

      setPermission(Notification.permission);
      setEnabled(window.localStorage.getItem(OPT_IN_KEY) === "enabled");
    });
  }, []);

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

  const enableReminders = async () => {
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
        setEnabled(true);
        window.dispatchEvent(new Event("iskcon-calendar-notifications-changed"));

        const registration = await navigator.serviceWorker.ready;
        if (!(await enablePushOnDevice(registration))) {
          // The server did not save the subscription, so reminders are not really on.
          window.localStorage.removeItem(OPT_IN_KEY);
          setEnabled(false);
          window.dispatchEvent(new Event("iskcon-calendar-notifications-changed"));
          setSaveFailed(true);
          return;
        }
        await registration.showNotification("Calendar reminders enabled", {
          body: "You will receive reminders for Ekadashi and major ISKCON Nairobi festivals on this device.",
          tag: "iskcon-calendar-reminders-enabled",
          icon: "/brand/icon-192.png",
          badge: "/brand/icon-192.png",
          data: {
            url: "/festivals",
          },
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const disableReminders = async () => {
    window.localStorage.removeItem(OPT_IN_KEY);
    setEnabled(false);
    window.dispatchEvent(new Event("iskcon-calendar-notifications-changed"));

    if (!keepDevicePushSubscribed(OPT_IN_KEY)) {
      const registration = await navigator.serviceWorker.getRegistration();
      await disablePushOnDevice(registration ?? null);
    } else {
      const registration = await navigator.serviceWorker.getRegistration();
      await syncPushPreferences(registration ?? null);
    }
  };

  const buttonLabel = (() => {
    if (permission === "unsupported") {
      return "Not supported here";
    }

    if (permission === "denied") {
      return "Notifications blocked";
    }

    if (enabled) {
      return "Reminders enabled";
    }

    return isSaving ? "Enabling..." : "Enable reminders";
  })();

  return (
    <section className="mb-12 border border-gold/25 bg-white shadow-card">
      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-5 sm:p-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center bg-primary text-gold">
              <BellRing size={20} />
            </span>
            <div>
              <span className="eyebrow block">Calendar reminders</span>
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                Ekadashi and festival notifications
              </h2>
            </div>
          </div>

          <p className="max-w-2xl font-body text-sm leading-relaxed text-ink/75">
            Enable reminders to receive push notifications for Ekadashi and major ISKCON Nairobi festivals.
          </p>

          {permission !== "denied" && permission !== "unsupported" && (
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={enableReminders}
              disabled={enabled || isSaving}
              className="inline-flex min-h-11 items-center gap-2 bg-primary px-5 py-3 font-body text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-ink/30"
            >
              <BellRing size={15} />
              {buttonLabel}
            </button>

            {enabled && (
              <button
                type="button"
                onClick={disableReminders}
                className="inline-flex min-h-11 items-center gap-2 border border-temple-sand px-5 py-3 font-body text-sm font-bold text-ink transition hover:border-primary/40"
              >
                Turn off
              </button>
            )}
          </div>
          )}

          {saveFailed && (
            <p role="alert" className="mt-4 font-body text-sm leading-relaxed text-primary">
              Notifications could not be turned on right now. Please try again shortly.
            </p>
          )}

          {permission === "denied" && (
            <p className="mt-4 font-body text-sm leading-relaxed text-ink/75">
              Notifications are turned off for this site in your browser. You can allow them in your browser&apos;s site
              settings, or simply check this calendar.
            </p>
          )}

          {permission === "unsupported" && (
            <p className="mt-4 font-body text-sm leading-relaxed text-ink/75">
              This browser can&apos;t show reminders. The calendar below lists every date.
            </p>
          )}
        </div>

        <div className="border-t border-temple-sand bg-temple-cream/70 p-5 sm:p-7 lg:border-l lg:border-t-0">
          <div className="mb-4 flex items-center gap-2 font-body text-xs font-bold uppercase tracking-[0.16em] text-gold-ink">
            <CalendarDays size={14} />
            Next reminders
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex gap-3 card-surface p-3">
                <div className="min-w-14 text-center">
                  <p className="font-body text-xs font-bold uppercase tracking-[0.08em] text-primary">{event.dateLabel}</p>
                  <p className="font-body text-xs font-bold uppercase tracking-[0.12em] text-gold-ink">{event.type}</p>
                </div>
                <p className="font-body text-xs leading-relaxed text-ink/75">{event.event}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 font-body text-xs leading-relaxed text-ink/75">
            <ShieldCheck size={14} className="mt-0.5 shrink-0 text-gold" />
            <span>No account is created. You can turn reminders off here any time.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
