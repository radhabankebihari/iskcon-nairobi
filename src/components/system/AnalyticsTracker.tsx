"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type AnalyticsEvent =
  | "page_view"
  | "app_installed"
  | "install_prompt_accepted"
  | "install_prompt_dismissed";

export function trackAnalyticsEvent(event: AnalyticsEvent) {
  const body = JSON.stringify({
    event,
    path: window.location.pathname,
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/analytics", blob)) return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedUrl = useRef("");

  useEffect(() => {
    const url = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (lastTrackedUrl.current === url) return;
    lastTrackedUrl.current = url;

    window.setTimeout(() => trackAnalyticsEvent("page_view"), 0);
  }, [pathname]);

  useEffect(() => {
    const onAppInstalled = () => {
      trackAnalyticsEvent("app_installed");
    };

    window.addEventListener("appinstalled", onAppInstalled);
    return () => window.removeEventListener("appinstalled", onAppInstalled);
  }, []);

  return null;
}
