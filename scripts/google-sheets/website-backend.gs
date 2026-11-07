// Deploy this script from the client-owned spreadsheet as a Web app:
// Execute as: Me; Who has access: Anyone. Never expose its URL in browser code.
// Script properties: SPREADSHEET_ID, WEBSITE_SHARED_SECRET, optional NOTIFICATION_EMAIL.

const HEADERS = {
  'Contact Us': ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Subject', 'Message'],
  'Guest House Enquiries': ['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Subject', 'Message'],
  'Kirtan Safari Registrations': ['Timestamp', 'Full Name', 'Email', 'Phone Number', 'Days Attending', 'No. of People', 'How They Heard About Us', 'Wants Future Updates'],
  'Kirtan Safari 2027 Interest': ['Timestamp', 'Name', 'Email', 'WhatsApp Number', 'City or Country', 'Consent'],
  WebsiteAnalytics: ['Timestamp', 'Event', 'Path', 'City'],
  PushSubscriptions: ['Created At', 'Endpoint', 'P256DH', 'Auth', 'User Agent', 'Calendar Enabled', 'Noticeboard Enabled'],
  PushDeliveryLog: ['Event ID', 'Sent At', 'Attempted', 'Delivered', 'Failed', 'Pruned'],
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

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const cache = CacheService.getScriptCache();
      if (cache.get(request.nonce)) throw new Error('Repeated request');
      cache.put(request.nonce, 'used', 360);
      return jsonResponse({ success: true, data: performAction(request.action, request.data || {}) });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error('Website bridge request failed: ' + error);
    return jsonResponse({ success: false, error: 'The request could not be processed.' });
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

function spreadsheet() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('SPREADSHEET_ID is missing');
  return SpreadsheetApp.openById(id);
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
    case 'push.count': return { count: listPushRecords().length };
    case 'push.upsert': return upsertPush(data);
    case 'push.remove': return removePush(data);
    case 'push.deliveryExists': return deliveryExists(data);
    case 'push.recordDelivery': return recordDelivery(data);
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

function listPushRecords() {
  const rows = sheetFor('PushSubscriptions').getDataRange().getDisplayValues();
  const records = [];
  rows.forEach(function(row) {
    const endpoint = row[1] || '';
    if (endpoint.indexOf('https://') !== 0 || !row[2] || !row[3]) return;
    records.push({
      createdAt: row[0] || '', endpoint: endpoint,
      keys: { p256dh: row[2], auth: row[3] }, userAgent: row[4] || '',
      calendarEnabled: row[5] === 'TRUE', noticeboardEnabled: row[6] === 'TRUE',
    });
  });
  return records;
}

function upsertPush(data) {
  const endpoint = required(plain(data.endpoint, 500), 'Endpoint');
  if (endpoint.indexOf('https://') !== 0 || !/^[A-Za-z0-9_-]{1,120}$/.test(data.p256dh || '') ||
      !/^[A-Za-z0-9_-]{1,64}$/.test(data.auth || '')) throw new Error('Invalid subscription');
  const sheet = sheetFor('PushSubscriptions');
  const rows = sheet.getDataRange().getDisplayValues();
  let index = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][1] === endpoint) { index = i; break; }
  }
  const previous = index >= 0 ? rows[index] : [];
  const calendar = typeof data.calendarEnabled === 'boolean' ? data.calendarEnabled : previous[5] === 'TRUE';
  const noticeboard = typeof data.noticeboardEnabled === 'boolean' ? data.noticeboardEnabled : previous[6] === 'TRUE';
  const values = [new Date(), endpoint, data.p256dh, data.auth, cell(data.userAgent, 200), calendar, noticeboard];
  if (index >= 0) sheet.getRange(index + 1, 1, 1, values.length).setValues([values]);
  else sheet.appendRow(values);
  return { created: index < 0 };
}

function removePush(data) {
  const endpoint = required(plain(data.endpoint, 500), 'Endpoint');
  const sheet = sheetFor('PushSubscriptions');
  const rows = sheet.getDataRange().getDisplayValues();
  let removed = false;
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i][1] === endpoint) { sheet.deleteRow(i + 1); removed = true; }
  }
  return { removed: removed };
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
