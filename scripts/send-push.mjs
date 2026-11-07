import webpush from "web-push";
import { createHmac, randomBytes } from "node:crypto";

function arg(name) {
  const flag = `--${name}`;
  const index = process.argv.indexOf(flag);

  if (index === -1) {
    return undefined;
  }

  const value = process.argv[index + 1];
  return value && !value.startsWith("--") ? value : undefined;
}

// Same signed envelope as src/lib/appsScriptBridge.ts for this standalone Node command.
async function callBridge(action, data) {
  const rawUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
  if (!rawUrl || !secret || secret.length < 32) {
    throw new Error("Missing GOOGLE_APPS_SCRIPT_URL or GOOGLE_APPS_SCRIPT_SECRET.");
  }
  const url = new URL(rawUrl);
  if (url.origin !== "https://script.google.com" ||
      !/^\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url.pathname) || url.search) {
    throw new Error("Invalid Apps Script URL.");
  }
  const payload = JSON.stringify({ timestamp: Date.now(), nonce: randomBytes(16).toString("hex"), action, data });
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  const response = await fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload, signature }), signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Sheets bridge returned HTTP ${response.status}.`);
  const result = await response.json();
  if (result?.success !== true) throw new Error(`Sheets bridge rejected ${action}.`);
  return result.data;
}

async function main() {
  const title = arg("title");
  const body = arg("body");

  if (!title || !body) {
    console.error(
      'Usage: npm run send-push -- --confirm --title "..." --body "..." [--url /festivals] [--tag reminder] [--renotify true] [--icon ...] [--badge ...] [--ttl 86400]\nPreview with: npm run send-push -- --dry-run --title "..." --body "..."'
    );
    process.exit(2);
  }

  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  const vapidSubject = process.env.VAPID_SUBJECT;
  const confirmed = process.argv.includes("--confirm");
  const dryRun = process.argv.includes("--dry-run");

  if (!vapidPublicKey || !vapidPrivateKey || !vapidSubject) {
    console.error(
      "Missing VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, or VAPID_SUBJECT. Check your env file."
    );
    process.exit(2);
  }

  if (!confirmed && !dryRun) {
    console.error("Refusing to broadcast without --confirm. Use --dry-run to preview.");
    process.exit(2);
  }

  const payload = {
    title,
    body,
    url: normalizeNotificationPath(arg("url") || "/"),
    tag: arg("tag") || "iskcon-nairobi-reminder",
    renotify: arg("renotify") === "true",
  };

  const icon = arg("icon");
  const badge = arg("badge");

  if (icon) {
    payload.icon = icon;
  }

  if (badge) {
    payload.badge = badge;
  }

  const ttl = Number(arg("ttl") || 86400);

  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

  const { records: rows } = await callBridge("push.list", {});
  if (!Array.isArray(rows)) throw new Error("Invalid push subscription response.");
  let sent = 0;
  let pruned = 0;
  let skippedDuplicate = 0;
  const failed = [];
  // One send per device: a renewed device can briefly have two rows that
  // share its device ID; rows without one are matched by endpoint.
  const seenDevices = new Set();

  for (let i = 0; i < rows.length; i += 1) {
    const { endpoint, keys, deviceId } = rows[i];
    const p256dh = keys?.p256dh;
    const authKey = keys?.auth;

    if (
      typeof endpoint !== "string" ||
      !endpoint.startsWith("https://") ||
      !p256dh ||
      !authKey
    ) {
      continue;
    }

    const deviceKey = typeof deviceId === "string" && deviceId ? `device:${deviceId}` : `endpoint:${endpoint}`;
    if (seenDevices.has(deviceKey) || seenDevices.has(`endpoint:${endpoint}`)) {
      skippedDuplicate += 1;
      continue;
    }
    seenDevices.add(deviceKey);
    seenDevices.add(`endpoint:${endpoint}`);

    const subscription = {
      endpoint,
      keys: { p256dh, auth: authKey },
    };

    try {
      if (dryRun) {
        console.log(`dry run ${i + 1}/${rows.length}: ${endpoint.slice(0, 60)}...`);
        continue;
      }

      await webpush.sendNotification(subscription, JSON.stringify(payload), {
        TTL: ttl,
      });
      sent += 1;
      console.log(`sent ${i + 1}/${rows.length}: ${endpoint.slice(0, 60)}...`);
    } catch (error) {
      const status = error?.statusCode || error?.status || 0;

      if (status === 404 || status === 410) {
        pruned += 1;
        await callBridge("push.remove", { endpoint });
        console.log(`pruned (${status}): ${endpoint.slice(0, 60)}...`);
        continue;
      }

      failed.push({ endpoint, status, message: error?.message || String(error) });
      console.error(`failed ${i + 1}/${rows.length}: ${endpoint.slice(0, 60)}... (${status})`);
    }
  }

  console.log(
    `\nSummary: ${sent} sent, ${failed.length} failed, ${pruned} pruned, ${skippedDuplicate} duplicates skipped, ${rows.length} rows checked.`
  );

  if (failed.length > 0) {
    console.error(JSON.stringify(failed, null, 2));
    process.exitCode = 1;
  }
}

function normalizeNotificationPath(value) {
  try {
    const url = new URL(value, "https://iskconnairobi.esthrema.com");
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return "/";
  }
}

main().catch((error) => {
  console.error("Broadcast failed:", error);
  process.exit(1);
});
