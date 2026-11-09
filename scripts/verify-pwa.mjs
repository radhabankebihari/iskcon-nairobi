import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];

async function requireFile(relativePath) {
  try {
    const details = await stat(path.join(root, relativePath));
    if (!details.isFile() || details.size === 0) failures.push(`${relativePath} is empty`);
  } catch {
    failures.push(`${relativePath} is missing`);
  }
}

async function requirePngSize(relativePath, expectedSize) {
  try {
    const png = await readFile(path.join(root, relativePath));
    const signature = png.subarray(0, 8).toString("hex");
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    if (signature !== "89504e470d0a1a0a" || width !== expectedSize || height !== expectedSize) {
      failures.push(`${relativePath} must be a ${expectedSize}x${expectedSize} PNG`);
    }
  } catch {
    failures.push(`${relativePath} is missing or unreadable`);
  }
}

await Promise.all([
  "public/sw.js",
  "src/app/offline/page.tsx",
  "src/app/manifest.ts",
  "docs/PWA_GUIDE.md",
  "docs/APP_VERSIONS.md",
  "public/app-version.json",
].map(requireFile));
await Promise.all([
  requirePngSize("public/brand/maskable-icon-192.png", 192),
  requirePngSize("public/brand/maskable-icon-512.png", 512),
]);

const [manifest, worker, config, packageSource, releaseSource] = await Promise.all([
  readFile(path.join(root, "src/app/manifest.ts"), "utf8"),
  readFile(path.join(root, "public/sw.js"), "utf8"),
  readFile(path.join(root, "next.config.ts"), "utf8"),
  readFile(path.join(root, "package.json"), "utf8"),
  readFile(path.join(root, "public/app-version.json"), "utf8"),
]);

const packageMetadata = JSON.parse(packageSource);
const releaseMetadata = JSON.parse(releaseSource);

const assertions = [
  [!manifest.includes("orientation:"), "manifest must allow portrait and landscape rotation"],
  [manifest.includes("maskable-icon-192.png") && manifest.includes("maskable-icon-512.png"), "manifest must include both maskable icons"],
  [manifest.includes('purpose: "maskable"'), "manifest must declare maskable icon purpose"],
  [worker.includes('const OFFLINE_URL = "/offline"'), "worker must define the offline fallback"],
  [worker.includes('requestUrl.pathname.startsWith("/api/")'), "worker must bypass APIs"],
  [worker.includes('request.method !== "GET"'), "worker must bypass non-GET requests"],
  [worker.includes('type === "SKIP_WAITING"'), "worker must support explicit updates"],
  [worker.includes("self.skipWaiting()"), "worker updates must activate automatically"],
  [worker.includes('const UPDATE_MODE = "silent"') || worker.includes('const UPDATE_MODE = "prompt"'), "worker must declare its release update mode"],
  [config.includes('source: "/app-version.json"') && config.includes("must-revalidate"), "release manifest must be revalidated by browsers"],
  [packageMetadata.version === releaseMetadata.version, "package and public release versions must match"],
  [
    worker.includes(`const UPDATE_MODE = "${releaseMetadata.updateMode}"`),
    "worker and public release update modes must match",
  ],
  [
    ["silent", "prompt"].includes(releaseMetadata.updateMode),
    "release update mode must be silent or prompt",
  ],
  [worker.includes('self.addEventListener("notificationclick"'), "worker must handle notification deep links"],
  [config.includes('source: "/sw.js"') && config.includes("no-store"), "worker must not be cached by browsers"],
];

for (const [passed, message] of assertions) {
  if (!passed) failures.push(message);
}

if (failures.length) {
  console.error("PWA verification failed:\n- " + failures.join("\n- "));
  process.exitCode = 1;
} else {
  console.log("PWA verification passed: offline, cache, updates, rotation, and Android icons are configured.");
}
