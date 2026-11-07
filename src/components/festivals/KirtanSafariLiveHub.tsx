"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Camera,
  Clock3,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Radio,
  Utensils,
  Video,
} from "lucide-react";
import { kirtanSafariConfig, type FestivalDay } from "@/data/kirtanSafari";
import {
  formatFestivalDate,
  formatFestivalTime,
} from "@/lib/kirtanSafariState";
import { useKirtanSafariState } from "@/hooks/useKirtanSafariState";
import { KirtanSafariRegistrationButton } from "@/components/sections/KirtanSafariRegistrationModal";

function Countdown({ milliseconds }: { milliseconds: number }) {
  const seconds = Math.floor(milliseconds / 1000);
  const values = [
    [Math.floor(seconds / 86400), "Days"],
    [Math.floor((seconds % 86400) / 3600), "Hours"],
    [Math.floor((seconds % 3600) / 60), "Minutes"],
    [seconds % 60, "Seconds"],
  ] as const;

  return (
    <div className="ks-live-countdown" aria-label="Time until Adivas begins">
      {values.map(([value, label]) => (
        <div key={label}>
          <strong suppressHydrationWarning>{String(value).padStart(2, "0")}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function StreamPanel({ isOnline }: { isOnline: boolean }) {
  const { videoId, status, channelUrl } = kirtanSafariConfig.livestream;
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const panel = document.querySelector("[data-kirtan-stream]");
    if (!panel || !("IntersectionObserver" in window)) {
      const fallback = window.setTimeout(() => setNearViewport(true), 0);
      return () => window.clearTimeout(fallback);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "280px" }
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  const effectiveStatus = isOnline ? status : "offline";
  const canEmbed = Boolean(videoId && nearViewport && effectiveStatus !== "offline");
  const heading =
    effectiveStatus === "live"
      ? "Watch Kirtan Safari live"
      : effectiveStatus === "ended"
        ? "Watch the recorded kirtan"
        : effectiveStatus === "offline"
          ? "The broadcast is temporarily unavailable"
          : "The live broadcast will appear here";

  return (
    <section id="kirtan-stream" className="ks-stream-panel" data-kirtan-stream aria-labelledby="ks-stream-title">
      <div className="ks-stream-frame">
        {canEmbed ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
            title="Kirtan Safari 2026 livestream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div className="ks-stream-placeholder">
            <Video aria-hidden="true" />
            <div>
              <p>{effectiveStatus === "live" ? "Live broadcast" : "Festival broadcast"}</p>
              <h3 id="ks-stream-title">{heading}</h3>
              <span>
                {effectiveStatus === "offline"
                  ? "Please try again shortly or continue on the Kirtan Safari YouTube channel."
                  : "The player will activate when the confirmed YouTube broadcast is connected."}
              </span>
            </div>
          </div>
        )}
      </div>
      <a href={channelUrl} target="_blank" rel="noopener noreferrer" className="ks-inline-action">
        Open Kirtan Safari on YouTube <ExternalLink size={14} aria-hidden="true" />
      </a>
    </section>
  );
}

export default function KirtanSafariLiveHub() {
  const router = useRouter();
  const state = useKirtanSafariState();
  const initialDay = state.currentDayIndex >= 0 ? state.currentDayIndex : 0;
  const [selectedDayIndex, setSelectedDayIndex] = useState(initialDay);
  const [selectionTouched, setSelectionTouched] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateConnection = () => setIsOnline(navigator.onLine);
    updateConnection();
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  useEffect(() => {
    if (state.phase === "concluded") {
      router.refresh();
    }
  }, [router, state.phase]);

  const effectiveSelectedDayIndex =
    selectionTouched || state.currentDayIndex < 0
      ? selectedDayIndex
      : state.currentDayIndex;
  const selectedDay = kirtanSafariConfig.days[effectiveSelectedDayIndex] as FestivalDay;
  const isCurrentSelection = state.currentDay?.id === selectedDay.id;
  const nowLabel = state.currentItem?.title ?? "Follow the programme and announcements at the temple";
  const nextLabel =
    state.nextItem?.title ??
    state.currentDay?.fallbackNext ??
    (state.nextDay
      ? `${state.nextDay.theme} begins ${formatFestivalTime(state.nextDay.startsAt)}`
      : "The festival continues through the holy name");
  const later = state.laterItems.slice(0, 3);
  const isPreEvent = state.phase === "countdown";
  const isBetweenDays = state.phase === "between-days";

  const phaseCopy = useMemo(() => {
    if (isPreEvent) {
      return {
        eyebrow: "Festival desk",
        title: "Adivas Opens the Kirtan Mood",
        detail: "The live festival experience begins at 6:00 PM Nairobi time on Thursday 27 August.",
      };
    }
    if (isBetweenDays) {
      return {
        eyebrow: "Festival continues",
        title: "Today’s Programme Has Concluded",
        detail: state.nextDay
          ? `The next listed programme is ${state.nextDay.theme} at ${formatFestivalTime(state.nextDay.startsAt)}.`
          : "Return for the next programme update.",
      };
    }
    return {
      eyebrow: "Festival live",
      title: state.currentDay?.theme ?? "Kirtan Safari 2026",
      detail: state.currentDay
        ? `${formatFestivalDate(state.now)} · Day ${state.currentDayIndex + 1} of ${kirtanSafariConfig.days.length}`
        : "The festival programme is underway.",
    };
  }, [isBetweenDays, isPreEvent, state]);

  return (
    <section id="live" className="ks-live-hub" aria-labelledby="ks-live-heading">
      <div className="content-width section-padding ks-live-inner">
        <div className="ks-live-heading-row">
          <div>
            <p className="ks-live-eyebrow">
              {!isPreEvent && !isBetweenDays ? <span className="ks-live-dot" aria-hidden="true" /> : null}
              {phaseCopy.eyebrow}
            </p>
            <h2 id="ks-live-heading">{phaseCopy.title}</h2>
            <p>{phaseCopy.detail}</p>
          </div>
          {isPreEvent ? <Countdown milliseconds={state.startsInMs} /> : null}
        </div>

        {!isPreEvent ? (
          <div className="ks-status-grid" aria-label="Current festival status">
            <article className="ks-status-primary">
              <span>Now</span>
              <strong>{isBetweenDays ? "Between festival days" : nowLabel}</strong>
              {!isBetweenDays && state.currentItem?.detail ? <p>{state.currentItem.detail}</p> : null}
            </article>
            <article>
              <span>Coming next</span>
              <strong>{isBetweenDays && state.nextDay ? state.nextDay.theme : nextLabel}</strong>
              {isBetweenDays && state.nextDay ? <p>{formatFestivalTime(state.nextDay.startsAt)}</p> : null}
            </article>
            <article>
              <span>Later today</span>
              {later.length ? (
                <ul>
                  {later.map((item) => (
                    <li key={item.id}>{item.startsAt ? formatFestivalTime(item.startsAt) : item.timeLabel} · {item.title}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  {isBetweenDays
                    ? "Today’s programme has concluded. We continue tomorrow."
                    : state.currentDay?.fallbackNext ?? "Follow temple announcements for any additional details."}
                </p>
              )}
            </article>
          </div>
        ) : null}

        <div className="ks-live-actions">
          <KirtanSafariRegistrationButton className="ks-live-primary">
            {isPreEvent ? "Register Free" : isBetweenDays ? "Join Us Tomorrow" : "Join Us Today"}
          </KirtanSafariRegistrationButton>
          <a href={kirtanSafariConfig.links.directions} target="_blank" rel="noopener noreferrer" className="ks-live-secondary">
            <Navigation size={16} aria-hidden="true" /> Get directions
          </a>
          <a href={kirtanSafariConfig.links.instagram} target="_blank" rel="noopener noreferrer" className="ks-live-icon">
            <Camera size={17} aria-hidden="true" /> Instagram
          </a>
          <a href={kirtanSafariConfig.links.youtube} target="_blank" rel="noopener noreferrer" className="ks-live-icon">
            <Video size={17} aria-hidden="true" /> YouTube
          </a>
          {kirtanSafariConfig.livestream.enabled && kirtanSafariConfig.livestream.videoId && kirtanSafariConfig.livestream.status === "live" ? (
            <a href="#kirtan-stream" className="ks-live-icon">
              <Radio size={17} aria-hidden="true" /> Watch Live
            </a>
          ) : null}
        </div>

        {!isOnline ? (
          <p className="ks-offline-notice" role="status">
            You are viewing the saved festival programme. Live video and current updates will resume when your connection returns.
          </p>
        ) : null}

        {/* The player is controlled from kirtanSafariConfig so future festival
            broadcasts can be activated or retired without changing this layout. */}
        {kirtanSafariConfig.livestream.enabled ? <StreamPanel isOnline={isOnline} /> : null}

        <div className="ks-day-tabs" aria-label="Kirtan Safari programme days">
          {kirtanSafariConfig.days.map((day, index) => {
            const isCurrent = state.currentDay?.id === day.id;
            const isPast = new Date(day.endsAt).getTime() <= state.now.getTime();
            return (
              <button
                key={day.id}
                type="button"
                aria-pressed={effectiveSelectedDayIndex === index}
                className={effectiveSelectedDayIndex === index ? "is-selected" : ""}
                onClick={() => {
                  setSelectionTouched(true);
                  setSelectedDayIndex(index);
                }}
              >
                <span>{day.shortLabel}</span>
                <strong>{day.theme}</strong>
                <small>{isCurrent ? "Current day" : isPast ? "Completed" : "Programme"}</small>
              </button>
            );
          })}
        </div>

        <div className="ks-selected-programme">
          <div>
            <p>{isCurrentSelection ? "Current day programme" : "Festival programme"}</p>
            <h3>{selectedDay.label}</h3>
          </div>
          <ol>
            {selectedDay.programme.map((item) => (
              <li key={item.id}>
                <time dateTime={item.startsAt}>{item.timeLabel ?? (item.startsAt ? formatFestivalTime(item.startsAt) : "Time to be announced")}</time>
                <span>{item.title}</span>
              </li>
            ))}
          </ol>
          <a href="#schedule" className="ks-inline-action">
            View the complete four-day programme <CalendarDays size={14} aria-hidden="true" />
          </a>
        </div>

        <aside className="ks-practical" aria-labelledby="ks-practical-title">
          <div>
            <p>Before you arrive</p>
            <h3 id="ks-practical-title">Festival Practical Information</h3>
          </div>
          <div className="ks-practical-grid">
            {kirtanSafariConfig.practicalInformation.map((item, index) => {
              const Icon = [MapPin, Utensils, Camera, Clock3, Phone][index] ?? Radio;
              const content = <><Icon size={16} aria-hidden="true" /><span><strong>{item.label}</strong>{item.value}</span></>;
              return "href" in item && item.href ? <a key={item.label} href={item.href}>{content}</a> : <div key={item.label}>{content}</div>;
            })}
          </div>
        </aside>
      </div>

      <style jsx>{`
        .ks-live-hub { background: #06180e; border-top: 1px solid rgba(214,156,43,.24); color: white; padding: clamp(3rem,7vw,5.5rem) 0; position: relative; }
        .ks-live-inner { display: grid; gap: clamp(1.2rem,3vw,2rem); }
        .ks-live-heading-row { align-items: end; display: flex; gap: 2rem; justify-content: space-between; }
        .ks-live-heading-row > div:first-child { max-width: 720px; }
        .ks-live-eyebrow,.ks-selected-programme>div>p,.ks-practical>div>p { align-items:center; color:var(--color-festival-gold); display:flex; font:800 0.75rem/1 var(--font-body,sans-serif); gap:.55rem; letter-spacing:.19em; margin:0 0 .75rem; text-transform:uppercase; }
        .ks-live-dot { animation: ks-live-pulse 1.8s ease-in-out infinite; background:#ef5b45; border-radius:50%; box-shadow:0 0 0 .3rem rgba(239,91,69,.13); height:.48rem; width:.48rem; }
        h2 { color:#fff; font:700 clamp(2rem,5vw,4rem)/1.02 var(--font-display,serif); margin:0 0 .75rem; }
        .ks-live-heading-row p:last-child { color:rgba(255,255,255,.64); font:400 .92rem/1.7 var(--font-body,sans-serif); margin:0; }
        .ks-live-countdown { display:grid; flex:0 0 min(440px,42%); grid-template-columns:repeat(4,1fr); }
        .ks-live-countdown div { border-left:1px solid rgba(214,156,43,.24); padding:.65rem .85rem; text-align:center; }
        .ks-live-countdown strong { color:var(--color-festival-gold); display:block; font:700 clamp(1.45rem,3vw,2.4rem)/1 var(--font-display,serif); }
        .ks-live-countdown span { color:rgba(255,255,255,.42); font:700 0.75rem/1 var(--font-body,sans-serif); letter-spacing:.12em; text-transform:uppercase; }
        .ks-status-grid { display:grid; grid-template-columns:1.2fr 1fr 1fr; }
        .ks-status-grid article { background:rgba(255,255,255,.035); border:1px solid rgba(214,156,43,.16); min-height:9.5rem; padding:1.25rem; }
        .ks-status-grid .ks-status-primary { background:linear-gradient(135deg,rgba(214,156,43,.18),rgba(255,255,255,.025)); border-color:rgba(214,156,43,.38); }
        .ks-status-grid span { color:var(--color-festival-gold); display:block; font:800 0.75rem/1 var(--font-body,sans-serif); letter-spacing:.17em; margin-bottom:.8rem; text-transform:uppercase; }
        .ks-status-grid strong { color:#fff; display:block; font:700 1.12rem/1.3 var(--font-display,serif); }
        .ks-status-grid p,.ks-status-grid li { color:rgba(255,255,255,.56); font:400 .76rem/1.55 var(--font-body,sans-serif); }
        .ks-status-grid ul { list-style:none; margin:.4rem 0 0; padding:0; }
        .ks-live-actions { align-items:center; display:flex; flex-wrap:wrap; gap:.7rem; }
        .ks-live-secondary,.ks-live-icon { align-items:center; border:0; cursor:pointer; display:inline-flex; font:800 0.75rem/1 var(--font-body,sans-serif); gap:.45rem; justify-content:center; letter-spacing:.13em; min-height:44px; padding:.85rem 1.15rem; text-decoration:none; text-transform:uppercase; }
        .ks-live-secondary { background:#bf3f32; color:white; }
        .ks-live-icon { border:1px solid rgba(246,226,177,.22); color:var(--color-festival-cream); }
        .ks-stream-panel { display:grid; gap:.75rem; }
        .ks-stream-frame { aspect-ratio:16/9; background:#030b07; border:1px solid rgba(214,156,43,.28); overflow:hidden; width:100%; }
        .ks-stream-frame iframe { border:0; height:100%; width:100%; }
        .ks-stream-placeholder { align-items:center; background:radial-gradient(circle at 68% 35%,rgba(214,156,43,.15),transparent 34%),linear-gradient(135deg,#0e2b18,#05120a); display:flex; gap:1.25rem; height:100%; justify-content:center; padding:clamp(1.2rem,5vw,3rem); text-align:left; }
        .ks-stream-placeholder>svg { color:var(--color-festival-gold); height:clamp(2.5rem,6vw,5rem); width:clamp(2.5rem,6vw,5rem); }
        .ks-stream-placeholder p { color:var(--color-festival-gold); font:800 0.75rem/1 var(--font-body,sans-serif); letter-spacing:.16em; margin:0 0 .55rem; text-transform:uppercase; }
        .ks-stream-placeholder h3 { color:white; font:700 clamp(1.4rem,3vw,2.4rem)/1.1 var(--font-display,serif); margin:0 0 .55rem; }
        .ks-stream-placeholder span { color:rgba(255,255,255,.56); font:400 .82rem/1.55 var(--font-body,sans-serif); }
        .ks-inline-action { align-items:center; color:var(--color-festival-gold); display:inline-flex; font:700 0.75rem/1.4 var(--font-body,sans-serif); gap:.4rem; justify-self:start; text-decoration:none; }
        .ks-offline-notice { background:rgba(214,156,43,.12); border-left:3px solid var(--color-festival-gold); color:var(--color-festival-cream); font:600 .75rem/1.55 var(--font-body,sans-serif); margin:0; padding:.8rem 1rem; }
        .ks-day-tabs { display:grid; grid-template-columns:repeat(4,1fr); gap:.65rem; }
        .ks-day-tabs button { background:rgba(255,255,255,.03); border:1px solid rgba(246,226,177,.14); color:white; cursor:pointer; min-height:7.5rem; padding:1rem; text-align:left; }
        .ks-day-tabs button.is-selected { background:rgba(214,156,43,.14); border-color:var(--color-festival-gold); }
        .ks-day-tabs span,.ks-day-tabs small { color:rgba(255,255,255,.46); display:block; font:700 0.75rem/1.3 var(--font-body,sans-serif); letter-spacing:.1em; text-transform:uppercase; }
        .ks-day-tabs strong { display:block; font:700 1rem/1.2 var(--font-display,serif); margin:.45rem 0 .75rem; }
        .ks-day-tabs .is-selected small { color:var(--color-festival-gold); }
        .ks-selected-programme { align-items:start; background:#0b2415; border:1px solid rgba(214,156,43,.2); display:grid; gap:1.5rem; grid-template-columns:minmax(180px,.65fr) minmax(280px,1.35fr); padding:clamp(1.2rem,3vw,2rem); }
        .ks-selected-programme h3,.ks-practical h3 { color:white; font:700 clamp(1.35rem,3vw,2rem)/1.1 var(--font-display,serif); margin:0; }
        .ks-selected-programme ol { display:grid; gap:.6rem; list-style:none; margin:0; padding:0; }
        .ks-selected-programme li { align-items:baseline; border-bottom:1px solid rgba(255,255,255,.07); display:grid; gap:1rem; grid-template-columns:6rem 1fr; padding:0 0 .55rem; }
        .ks-selected-programme time { color:var(--color-festival-gold); font:700 0.75rem/1.4 var(--font-body,sans-serif); }
        .ks-selected-programme li span { color:rgba(255,255,255,.76); font:500 .86rem/1.4 var(--font-body,sans-serif); }
        .ks-selected-programme>a { grid-column:2; }
        .ks-practical { background:#f4e4bc; color:#30231d; display:grid; gap:1.5rem; grid-template-columns:minmax(190px,.6fr) 1.4fr; padding:clamp(1.25rem,4vw,2.5rem); }
        .ks-practical h3 { color:#30231d; }
        .ks-practical-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
        .ks-practical-grid>div,.ks-practical-grid>a { align-items:flex-start; border-left:1px solid rgba(58,42,36,.18); color:inherit; display:flex; gap:.65rem; padding:.75rem 1rem; text-decoration:none; }
        .ks-practical-grid svg { color:#bf3f32; flex:none; }
        .ks-practical-grid span { display:grid; font:400 0.75rem/1.45 var(--font-body,sans-serif); gap:.18rem; }
        .ks-practical-grid strong { font-size:0.75rem; letter-spacing:.1em; text-transform:uppercase; }
        @keyframes ks-live-pulse { 50% { opacity:.45; transform:scale(.85); } }
        @media (prefers-reduced-motion:reduce) { .ks-live-dot { animation:none; } }
        @media (max-width:800px) {
          .ks-live-heading-row { align-items:stretch; flex-direction:column; gap:1.2rem; }
          .ks-live-countdown { flex:auto; width:100%; }
          .ks-status-grid { grid-template-columns:1fr; }
          .ks-status-grid article { min-height:0; }
          .ks-day-tabs { display:flex; margin-inline:calc(var(--page-pad,1.25rem) * -1); overflow-x:auto; padding:0 var(--page-pad,1.25rem) .4rem; scroll-snap-type:x mandatory; }
          .ks-day-tabs button { flex:0 0 min(72vw,230px); min-height:6.5rem; scroll-snap-align:start; }
          .ks-selected-programme,.ks-practical { grid-template-columns:1fr; }
          .ks-selected-programme>a { grid-column:1; }
          .ks-practical-grid { grid-template-columns:1fr; }
          .ks-practical-grid>div,.ks-practical-grid>a { border-left:0; border-top:1px solid rgba(58,42,36,.14); padding-inline:0; }
          .ks-live-secondary { flex:1 1 calc(50% - .4rem); }
          .ks-live-icon { flex:1 1 calc(50% - .4rem); }
        }
        @media (max-width:430px) {
          .ks-live-hub { padding:2.6rem 0; }
          .ks-live-countdown div { padding:.55rem .2rem; }
          .ks-stream-placeholder { align-items:flex-start; flex-direction:column; justify-content:center; }
          .ks-live-secondary { flex-basis:100%; }
        }
      `}</style>
    </section>
  );
}
