"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTempleStatus } from "@/lib/templeStatus";
import { useKirtanSafariState } from "@/hooks/useKirtanSafariState";

/** Fired once the header has finished animating and its resting height is saved. */
export const HEADER_SETTLED_EVENT = "site-header-settled";

interface TempleStatusBarProps {
  visible: boolean;
}

export default function TempleStatusBar({ visible }: TempleStatusBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  // Pages are prerendered at build time, so the clock is only read after
  // hydration. Reading it during render makes this text differ from the saved HTML.
  const [now, setNow] = useState<Date | null>(null);
  const status = useMemo(() => (now ? getTempleStatus(now) : null), [now]);
  const festivalState = useKirtanSafariState();
  const festivalActive = festivalState.phase === "live" || festivalState.phase === "between-days";
  const festivalConcluded = festivalState.phase === "concluded";
  const festivalHref = festivalConcluded ? "/festivals" : "/festivals/kirtan-safari#live";
  const FestivalIcon = festivalActive ? Radio : CalendarDays;

  useEffect(() => {
    const hydrationRefresh = window.setTimeout(() => setNow(new Date()), 0);
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => {
      window.clearTimeout(hydrationRefresh);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const header = document.querySelector<HTMLElement>(".site-nav");

    const syncChromeHeight = () => {
      const solid = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-solid-header-height"));
      const live = header?.getBoundingClientRect().height ?? Infinity;
      const headerHeight = Math.min(live, Number.isFinite(solid) ? solid : Infinity);
      const totalHeight =
        (Number.isFinite(headerHeight) ? headerHeight : bar.offsetTop) +
        (visible ? bar.offsetHeight : 0);

      document.documentElement.style.setProperty("--site-chrome-height", `${totalHeight}px`);
    };

    syncChromeHeight();

    // Runs only when the header or this bar changes size, instead of on every frame.
    // Border boxes, because the header also shrinks through its padding.
    const observer = new ResizeObserver(syncChromeHeight);
    observer.observe(bar, { box: "border-box" });
    if (header) observer.observe(header, { box: "border-box" });
    window.addEventListener(HEADER_SETTLED_EVENT, syncChromeHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener(HEADER_SETTLED_EVENT, syncChromeHeight);
    };
  }, [visible, status]);

  return (
    <div
      ref={barRef}
      className={cn(
        "fixed left-0 right-0 z-[49] border-b border-gold/30 bg-[#f4dfad]/95 text-ink shadow-[0_10px_28px_rgba(64,34,17,0.13)] backdrop-blur-[14px] transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0 pointer-events-none"
      )}
      style={{ top: "min(var(--site-header-height, 63px), var(--site-solid-header-height, 63px))" }}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="content-width section-padding">
        <div className="flex min-h-11 items-center justify-between gap-3 py-2 max-[900px]:min-h-9 max-[900px]:gap-2 max-[900px]:py-1">
          <div className="flex min-w-0 items-center gap-3 font-body text-xs max-[900px]:flex-1 max-[900px]:gap-1.5">
            <span
              className={cn(
                "h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_16px_currentColor] max-[900px]:h-2 max-[900px]:w-2",
                status?.isOpen ? "bg-emerald-600 text-emerald-600" : "bg-sunset text-sunset"
              )}
              aria-hidden="true"
            />
            <span className="shrink-0 font-semibold uppercase tracking-[0.16em] text-ink max-[900px]:text-xs max-[900px]:tracking-[0.09em]">
              {status?.primaryText}
            </span>
            <span className="h-3 w-px shrink-0 bg-gold/40 max-[900px]:hidden" />
            <span className="truncate text-ink/75 max-[900px]:text-xs">
              <span className="max-[900px]:hidden">{status?.detailText}</span>
              <span className="hidden max-[900px]:inline">{status?.detailText}</span>
            </span>
          </div>

          <div className="flex min-w-0 items-center justify-end gap-3 font-body text-xs max-[900px]:shrink-0 max-[900px]:gap-2">
            <span className="hidden min-w-0 items-center gap-1.5 text-ink/75 lg:flex">
              <Clock3 size={13} className="shrink-0 text-sunset" />
              <span className="truncate">{status && `Next: ${status.nextProgramme}`}</span>
            </span>
            <Link
              href={festivalHref}
              className="tap-target inline-flex shrink-0 items-center gap-1.5 border border-sunset/35 bg-sunset/10 px-3 py-1.5 text-sm font-semibold text-sunset-ink transition-colors hover:border-sunset/60 hover:bg-sunset/15 max-[900px]:gap-1 max-[900px]:px-1.5 max-[900px]:py-1 max-[900px]:text-xs max-[900px]:"
            >
              <FestivalIcon size={13} className="shrink-0 max-[900px]:h-3 max-[900px]:w-3" />
              <span className="max-[900px]:hidden">
                {festivalConcluded
                  ? "Festivals"
                  : festivalActive
                    ? "Kirtan Safari Live"
                      : "Kirtan Safari 2026"}
              </span>
              <span className="hidden max-[900px]:inline">
                {festivalConcluded ? "Festivals" : festivalActive ? "Kirtan Safari Live" : "Kirtan Safari"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
