/**
 * When a device needs to tell the server about its push subscription.
 *
 * Several parts of the page ask for a sync on every load (the reminder manager,
 * the reminder button, the noticeboard button). Without this rule each page view
 * would write to the subscription store, and a quick browse would hit the API's
 * rate limit. A sync is only needed when something changed, or once a week as a
 * heartbeat so a lost row is restored.
 */
export type PushSyncState = {
  endpoint: string;
  calendar: boolean;
  noticeboard: boolean;
  /** Milliseconds since the epoch of the last successful sync. */
  syncedAt: number;
};

export const PUSH_RESYNC_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

export function needsPushSync(
  last: PushSyncState | null,
  current: Omit<PushSyncState, "syncedAt">,
  now: number
) {
  if (!last) return true;
  if (last.endpoint !== current.endpoint) return true;
  if (last.calendar !== current.calendar || last.noticeboard !== current.noticeboard) return true;
  // A clock moved backwards also counts as stale.
  return now - last.syncedAt >= PUSH_RESYNC_INTERVAL_MS || now < last.syncedAt;
}

/** The endpoint the server should replace, when the browser renewed the subscription. */
export function previousEndpointFor(last: PushSyncState | null, endpoint: string) {
  return last && last.endpoint && last.endpoint !== endpoint ? last.endpoint : undefined;
}
