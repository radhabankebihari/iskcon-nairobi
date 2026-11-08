// Deploy this script from the client-owned spreadsheet as a Web app:
// Execute as: Me; Who has access: Anyone. Never expose its URL in browser code.
// Script properties: SPREADSHEET_ID, WEBSITE_SHARED_SECRET, optional NOTIFICATION_EMAIL.

// Raise this whenever the actions below change. The website refuses push
// writes to an older script (see BACKEND_VERSION_FOR_PUSH in
// src/lib/appsScriptBridge.ts), so a stale deployment fails loudly instead of
// quietly storing duplicate rows.
// 2: one row per device, delivery receipts, and run claims.
const BACKEND_VERSION = 2;

const HEADERS = {
  'Contact Us': ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Subject', 'Message'],
  'Guest House Enquiries': ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Subject', 'Message'],
  'Kirtan Safari Registrations': ['Timestamp', 'Full Name', 'Email', 'Phone Number', 'Days Attending', 'No. of People', 'How They Heard About Us', 'Wants Future Updates'],
  'Kirtan Safari 2027 Interest': ['Timestamp', 'Name', 'Email', 'WhatsApp Number', 'City or Country', 'Consent'],
  WebsiteAnalytics: ['Timestamp', 'Event', 'Path', 'City'],
  PushSubscriptions: ['Created At', 'Endpoint', 'P256DH', 'Auth', 'User Agent', 'Calendar Enabled', 'Noticeboard Enabled', 'Device ID'],
  PushDeliveryLog: ['Event ID', 'Sent At', 'Attempted', 'Delivered', 'Failed', 'Pruned'],
  PushDeliveryReceipts: ['Event ID', 'Device Key', 'Sent At'],
  PushRunClaims: ['Event ID', 'Run ID', 'Claimed At'],
};

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > 16384) throw new Error('Missing or oversized request');

    const envelope = JSON.parse(raw);
    const secret = PropertiesService.getScriptProperties().getProperty('WEBSITE_SHARED_SECRET');
    if (!secret || secret.length < 32 || typeof envelope.payload !== 'string' ||
        !/^[0-9a-f]{64}$/.test(envelope.signature || '')) {
      throw new Error('Invalid bridge credentials');
    }

    const expected = Utilities.computeHmacSha256Signature(envelope.payload, secret)
      .map(function(byte) { return ('0' + (byte & 255).toString(16)).slice(-2); }).join('');
    if (!sameSignature(expected, envelope.signature)) throw new Error('Invalid signature');

    const request = JSON.parse(envelope.payload);
    if (!Number.isFinite(request.timestamp) ||
        Math.abs(Date.now() - request.timestamp) > 5 * 60 * 1000 ||
        !/^[0-9a-f]{32}$/.test(request.nonce || '')) {
      throw new Error('Expired or invalid request');
    }

    const cache = CacheService.getScriptCache();
    if (cache.get(request.nonce)) throw new Error('Repeated request');
    cache.put(request.nonce, 'used', 360);

    // Forms and analytics only append a row, which is safe without a lock.
    // Push actions read and rewrite rows, so they run one at a time. Keeping
    // page-view analytics out of the lock stops them delaying push saves.
    if (String(request.action || '').indexOf('push.') !== 0) {
      return jsonResponse({ success: true, version: BACKEND_VERSION, data: performAction(request.action, request.data || {}) });
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      return jsonResponse({ success: true, version: BACKEND_VERSION, data: performAction(request.action, request.data || {}) });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error('Website bridge request failed: ' + error);
    return jsonResponse({ success: false, version: BACKEND_VERSION, error: 'The request could not be processed.' });
  }
}

function sameSignature(left, right) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return difference === 0;
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

// Opened once per request; a push save otherwise opens the spreadsheet several times.
let openedSpreadsheet = null;

function spreadsheet() {
  if (openedSpreadsheet) return openedSpreadsheet;
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('SPREADSHEET_ID is missing');
  openedSpreadsheet = SpreadsheetApp.openById(id);
  return openedSpreadsheet;
}

function sheetFor(name) {
  const book = spreadsheet();
  let sheet = book.getSheetByName(name);
  if (!sheet) sheet = book.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function plain(value, limit) {
  return typeof value === 'string' ? value.replace(/[<>]/g, '').trim().slice(0, limit) : '';
}

function cell(value, limit) {
  const text = plain(value, limit);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function validEmail(email) {
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function required(value, name) {
  if (!value) throw new Error(name + ' is required');
  return value;
}

function performAction(action, data) {
  switch (action) {
    case 'contact.submit': return submitContact(data);
    case 'kirtan.register': return registerKirtan(data);
    case 'kirtan.interest': return recordKirtanInterest(data);
    case 'analytics.record': return recordAnalytics(data);
    case 'push.list': return { records: listPushRecords() };
    case 'push.count': return { count: countPushDevices() };
    case 'push.upsert': return upsertPush(data);
    case 'push.remove': return removePush(data);
    case 'push.deliveryExists': return deliveryExists(data);
    case 'push.recordDelivery': return recordDelivery(data);
    case 'push.deliveredDevices': return deliveredDevices(data);
    case 'push.recordReceipts': return recordReceipts(data);
    case 'push.claimRun': return claimRun(data);
    default: throw new Error('Unknown action');
  }
}

function submitContact(data) {
  const type = data.formType === 'guest-house-enquiry' ? 'guest-house-enquiry' : 'contact-us';
  const name = required(plain(data.firstName, 60), 'Name');
  const email = required(plain(data.email, 120), 'Email');
  const subject = required(plain(data.subject, 80), 'Subject');
  const message = required(plain(data.message, 1200), 'Message');
  if (!validEmail(email)) throw new Error('Invalid email');

  const sheet = sheetFor(type === 'guest-house-enquiry' ? 'Guest House Enquiries' : 'Contact Us');
  sheet.appendRow([new Date(), cell(name, 60), cell(data.lastName, 60), cell(email, 120),
    cell(data.phone, 40), cell(subject, 80), cell(message, 1200)]);

  const recipient = PropertiesService.getScriptProperties().getProperty('NOTIFICATION_EMAIL');
  if (recipient) {
    try {
      MailApp.sendEmail({
        to: recipient,
        subject: 'New website enquiry: ' + subject,
        replyTo: email,
        name: 'ISKCON Nairobi website',
        body: ['A new enquiry was saved to the spreadsheet.', '',
          'Type: ' + type, 'Name: ' + name + ' ' + plain(data.lastName, 60),
          'Email: ' + email, 'Phone: ' + plain(data.phone, 40), '', message].join('\n'),
      });
    } catch (error) {
      // The row is already saved; an email failure must not invite a duplicate submission.
      console.error('Enquiry email failed: ' + error);
    }
  }
  return { recorded: true };
}

function registerKirtan(data) {
  const name = required(plain(data.fullName, 120), 'Name');
  const phone = required(plain(data.phone, 40), 'Phone');
  const email = plain(data.email, 160);
  if (!validEmail(email)) throw new Error('Invalid email');
  if (!Array.isArray(data.days) || data.days.length === 0) throw new Error('Days are required');
  const days = data.days.map(function(day) { return cell(day, 80); }).join(', ');
  sheetFor('Kirtan Safari Registrations').appendRow([new Date(), cell(name, 120), cell(email, 160),
    cell(phone, 40), days, Number(data.peopleCount) || 1, cell(data.hearAbout, 80),
    data.wantsUpdates === 'Yes' ? 'Yes' : 'No']);
  return { recorded: true };
}

function recordKirtanInterest(data) {
  const name = required(plain(data.fullName, 120), 'Name');
  const email = required(plain(data.email, 180), 'Email');
  if (!validEmail(email) || data.consent !== true) throw new Error('Invalid interest request');
  sheetFor('Kirtan Safari 2027 Interest').appendRow([new Date(), cell(name, 120),
    cell(email, 180), cell(data.phone, 40), cell(data.city, 100), 'Yes']);
  return { recorded: true };
}

function recordAnalytics(data) {
  const allowed = ['page_view', 'app_installed', 'install_prompt_accepted', 'install_prompt_dismissed'];
  const event = plain(data.event, 40);
  const path = plain(data.path, 260);
  if (allowed.indexOf(event) < 0 || path.charAt(0) !== '/') throw new Error('Invalid analytics event');
  sheetFor('WebsiteAnalytics').appendRow([new Date(), cell(event, 40), cell(path, 260), cell(data.city, 120)]);
  return { recorded: true };
}

// Push subscriptions keep one row per device. Each browser sends a random
// v4 device ID (column H); a renewed subscription names the endpoint it
// replaces. These rules mirror src/lib/pushDevices.ts.
const DEVICE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

function pushRows() {
  const rows = sheetFor('PushSubscriptions').getDataRange().getDisplayValues();
  const result = [];
  rows.forEach(function(row, index) {
    const endpoint = row[1] || '';
    if (endpoint.indexOf('https://') !== 0 || !row[2] || !row[3]) return;
    result.push({
      rowNumber: index + 1, createdAt: row[0] || '', endpoint: endpoint,
      p256dh: row[2], auth: row[3], userAgent: row[4] || '',
      calendarEnabled: row[5] === 'TRUE', noticeboardEnabled: row[6] === 'TRUE',
      deviceId: DEVICE_ID_PATTERN.test(row[7] || '') ? row[7] : '',
    });
  });
  return result;
}

function listPushRecords() {
  return pushRows().map(function(row) {
    return {
      createdAt: row.createdAt, endpoint: row.endpoint,
      keys: { p256dh: row.p256dh, auth: row.auth }, userAgent: row.userAgent,
      calendarEnabled: row.calendarEnabled, noticeboardEnabled: row.noticeboardEnabled,
      deviceId: row.deviceId,
    };
  });
}

function countPushDevices() {
  const devices = {};
  pushRows().forEach(function(row) { devices[row.deviceId || row.endpoint] = true; });
  return Object.keys(devices).length;
}

function validEndpoint(value) {
  const endpoint = plain(value, 500);
  return endpoint.indexOf('https://') === 0 ? endpoint : '';
}

function upsertPush(data) {
  const endpoint = required(validEndpoint(data.endpoint), 'Endpoint');
  if (!/^[A-Za-z0-9_-]{1,120}$/.test(data.p256dh || '') ||
      !/^[A-Za-z0-9_-]{1,64}$/.test(data.auth || '')) throw new Error('Invalid subscription');
  const deviceId = DEVICE_ID_PATTERN.test(data.deviceId || '') ? data.deviceId : '';
  const previous = validEndpoint(data.previousEndpoint);

  const rows = pushRows();
  const sameEndpoint = rows.filter(function(row) { return row.endpoint === endpoint; });
  const sameDevice = deviceId ? rows.filter(function(row) { return row.deviceId === deviceId; }) : [];
  const replaced = previous ? rows.filter(function(row) { return row.endpoint === previous; }) : [];

  const owned = {};
  sameEndpoint.concat(sameDevice, replaced).forEach(function(row) { owned[row.rowNumber] = row; });
  const ownedRows = Object.keys(owned).map(function(key) { return owned[key]; })
    .sort(function(a, b) { return a.rowNumber - b.rowNumber; });

  // Preferences: sent values win, then this endpoint, the replaced endpoint, then the device's newest row.
  const newestDevice = sameDevice.slice().sort(function(a, b) {
    return (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0) || b.rowNumber - a.rowNumber;
  })[0];
  const inherited = sameEndpoint[0] || replaced[0] || newestDevice;
  const calendar = typeof data.calendarEnabled === 'boolean' ? data.calendarEnabled : Boolean(inherited && inherited.calendarEnabled);
  const noticeboard = typeof data.noticeboardEnabled === 'boolean' ? data.noticeboardEnabled : Boolean(inherited && inherited.noticeboardEnabled);
  const storedDeviceId = deviceId || (sameEndpoint.filter(function(row) { return row.deviceId; })[0] || {}).deviceId || '';

  const values = [new Date().toISOString(), endpoint, data.p256dh, data.auth, cell(data.userAgent, 200), calendar, noticeboard, storedDeviceId];
  const sheet = sheetFor('PushSubscriptions');
  if (!ownedRows.length) {
    sheet.appendRow(values);
    return { created: true };
  }

  sheet.getRange(ownedRows[0].rowNumber, 1, 1, values.length).setValues([values]);
  // Every other owned row sits below the first; delete from the bottom so row numbers stay valid.
  ownedRows.slice(1).map(function(row) { return row.rowNumber; })
    .sort(function(a, b) { return b - a; })
    .forEach(function(rowNumber) { sheet.deleteRow(rowNumber); });
  return { created: false };
}

function removePush(data) {
  const endpoint = required(validEndpoint(data.endpoint), 'Endpoint');
  const deviceId = DEVICE_ID_PATTERN.test(data.deviceId || '') ? data.deviceId : '';
  const sheet = sheetFor('PushSubscriptions');
  const doomed = pushRows()
    .filter(function(row) { return row.endpoint === endpoint || (deviceId && row.deviceId === deviceId); })
    .map(function(row) { return row.rowNumber; })
    .sort(function(a, b) { return b - a; });
  doomed.forEach(function(rowNumber) { sheet.deleteRow(rowNumber); });
  return { removed: doomed.length > 0 };
}

function deliveryExists(data) {
  const eventId = required(plain(data.eventId, 160), 'Event ID');
  const ids = sheetFor('PushDeliveryLog').getRange('A:A').getDisplayValues();
  return { exists: ids.some(function(row) { return row[0] === eventId; }) };
}

function recordDelivery(data) {
  const eventId = required(plain(data.eventId, 160), 'Event ID');
  const sheet = sheetFor('PushDeliveryLog');
  sheet.appendRow([cell(eventId, 160), new Date(), Number(data.attempted) || 0,
    Number(data.delivered) || 0, Number(data.failed) || 0, Number(data.pruned) || 0]);
  return { recorded: true };
}

// Receipts: one row per reminder per device, so a rerun only reaches devices
// that missed it. Keys look like device:<id> or endpoint:<hash>.
function deliveredDevices(data) {
  const eventId = required(plain(data.eventId, 160), 'Event ID');
  const rows = sheetFor('PushDeliveryReceipts').getDataRange().getDisplayValues();
  const keys = [];
  rows.forEach(function(row) { if (row[0] === eventId && row[1]) keys.push(row[1]); });
  return { keys: keys };
}

function recordReceipts(data) {
  const eventId = required(plain(data.eventId, 160), 'Event ID');
  const keys = (Array.isArray(data.keys) ? data.keys : [])
    .map(function(key) { return plain(key, 80); })
    .filter(function(key) { return /^(device|endpoint):[0-9a-f-]{8,64}$/.test(key); });
  if (!keys.length) return { recorded: 0 };
  const sheet = sheetFor('PushDeliveryReceipts');
  const sentAt = new Date().toISOString();
  sheet.getRange(sheet.getLastRow() + 1, 1, keys.length, 3)
    .setValues(keys.map(function(key) { return [cell(eventId, 160), key, sentAt]; }));
  return { recorded: keys.length };
}

// Runs under the script lock in doPost, so checking and claiming cannot interleave.
function claimRun(data) {
  const eventId = required(plain(data.eventId, 160), 'Event ID');
  const runId = required(plain(data.runId, 64), 'Run ID');
  const windowMs = Math.min(Math.max(Number(data.windowMs) || 600000, 60000), 3600000);
  const sheet = sheetFor('PushRunClaims');
  const now = Date.now();
  const active = sheet.getDataRange().getDisplayValues().some(function(row) {
    const at = Date.parse(row[2]);
    return row[0] === eventId && row[1] !== runId && at && now - at < windowMs;
  });
  if (active) return { claimed: false };
  sheet.appendRow([cell(eventId, 160), runId, new Date(now).toISOString()]);
  return { claimed: true };
}
