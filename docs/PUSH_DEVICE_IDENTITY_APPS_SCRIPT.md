# Push device identity in the Apps Script backend

Calendar reminders reach each device once. The rules live in `src/lib/pushDevices.ts` (tested in `src/lib/pushDevices.test.ts` and `src/lib/calendarPush.test.ts`) and are mirrored in `scripts/google-sheets/website-backend.gs`. Keep the two in step. This file describes the storage contract.

## Sheet layout

`PushSubscriptions` gains column H, **Device ID**. Older rows leave it empty; nothing needs backfilling.

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Updated at | Endpoint | p256dh | auth | User agent | Calendar on | Noticeboard on | Device ID |

Two new tabs:

- `PushDeliveryReceipts`: Event ID, Device Key, Sent At. One row per reminder per device.
- `PushRunClaims`: Event ID, Run ID, Claimed At. Only needed if runs can overlap; with `LockService` (below) it can be dropped.

`PushDeliveryLog` is unchanged: one row per event once every device has it.

## Actions

### `push.upsert`
Input adds `deviceId` (v4 UUID, optional) and `previousEndpoint` (optional, already validated by the Next.js route). Behaviour, inside the script lock:

1. A row belongs to this device if its endpoint equals `endpoint`, its Device ID equals `deviceId`, or its endpoint equals `previousEndpoint`.
2. Preferences: the value sent wins. Otherwise take it from the row with the same endpoint, then the `previousEndpoint` row, then the newest row with the same Device ID. Otherwise false.
3. Device ID: the one sent, else the one already on the same-endpoint row.
4. Write into the lowest owned row. Delete the other owned rows from the bottom up. With no owned row, append.
5. Return `{ created: true }` only when no row was owned.

### `push.remove`
Input adds `deviceId` (optional). Delete every row whose endpoint matches, or whose Device ID matches when given, from the bottom up.

### `push.list`
Include `deviceId` (column H) in each record. Sending picks one row per device (`selectRecipients`): the Device ID key, or the endpoint for rows without one, keeping the newest by Updated At.

### `push.deliveredDevices` (new)
Input `{ eventId }`. Return `{ keys: string[] }` from `PushDeliveryReceipts` column B for that event.

### `push.recordReceipts` (new)
Input `{ eventId, keys: string[] }`. Append one receipt row per key in a single `setValues` call. Return `{ recorded: keys.length }`.

### `push.claimRun` (new)
Input `{ eventId, runId }`. With `LockService.getScriptLock()` held, look for a claim for the event from another run within the last 10 minutes. If one exists, return `{ claimed: false }`. Otherwise append the claim and return `{ claimed: true }`. The script lock makes this atomic, which is stronger than the append-and-read-back election the Sheets API version needs.

## Device key format

`device:<device id>` for rows with a Device ID, `endpoint:<first 32 hex characters of SHA-256(endpoint)>` otherwise. Receipts store this key, so it must match `deviceKey()` in `src/lib/pushDevices.ts` exactly. In Apps Script: `Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, endpoint)`, converted to lower-case hex.

## Bridge changes in Next.js

- `SheetAction` adds `push.deliveredDevices`, `push.recordReceipts`, `push.claimRun`.
- `src/lib/pushSubscriptions.ts` passes `deviceId` and `previousEndpoint` through `push.upsert`, and `deviceId` through `push.remove`. It should also export `listPushRows()` returning `StoredPushRow[]`, which `calendarPush.ts` uses.
- `src/lib/calendarPushDelivery.ts` implements `listDeliveredDeviceKeys`, `recordDeviceReceipts` and `claimEventRun` with the three new actions.
- The cron route, `calendarPush.ts`, the API routes, the client and the service worker need no changes.
