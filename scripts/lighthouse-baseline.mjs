// Records mobile and desktop Lighthouse scores for launch pages against a local production
// build. Run `npm run build` first. Results are the median of three runs per page
// and are written to docs/baselines/ so each release can be compared with the last.
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const port = 3033;
const runs = Number(process.env.LIGHTHOUSE_RUNS || 3);
const routes = ["/", "/festivals", "/festivals/kartik", "/donate", "/visit"];
const profiles = process.env.LIGHTHOUSE_PROFILES?.split(",") ?? ["mobile", "desktop"];
const lighthouse = "lighthouse@12.8.2";

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Server did not start at ${url}`);
}

function runLighthouse(url, outputPath, profile) {
  const args = [
    "-y",
    lighthouse,
    url,
    "--quiet",
    "--output=json",
    `--output-path=${outputPath}`,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--chrome-flags=--headless=new --no-sandbox",
    ...(profile === "desktop" ? ["--preset=desktop"] : []),
  ];
  const result = spawnSync("npx", args, {
    env: { ...process.env, CHROME_PATH: chromium.executablePath() },
    shell: process.platform === "win32",
    stdio: "ignore",
  });
  if (result.status !== 0) throw new Error(`Lighthouse failed for ${url}`);
  return JSON.parse(readFileSync(outputPath, "utf8"));
}

// Analytics is switched off so baseline runs never reach the visitor sheet.
const server = spawn("npx", ["next", "start", "-p", String(port)], {
  env: { ...process.env, ANALYTICS_DISABLED: "true" },
  shell: process.platform === "win32",
  stdio: "ignore",
});
const workDir = mkdtempSync(path.join(tmpdir(), "lighthouse-"));
const results = {};

try {
  await waitForServer(`http://localhost:${port}`);

  for (const profile of profiles) {
    results[profile] = {};
    for (const route of routes) {
    const reports = [];
    for (let run = 0; run < runs; run += 1) {
      const outputPath = path.join(workDir, `report-${run}.json`);
      reports.push(runLighthouse(`http://localhost:${port}${route}`, outputPath, profile));
    }

    const score = (id) => Math.round(median(reports.map((r) => r.categories[id].score)) * 100);
    const metric = (id) => median(reports.map((r) => r.audits[id].numericValue));

    results[profile][route] = {
      performance: score("performance"),
      accessibility: score("accessibility"),
      bestPractices: score("best-practices"),
      seo: score("seo"),
      lcpSeconds: Number((metric("largest-contentful-paint") / 1000).toFixed(1)),
      fcpSeconds: Number((metric("first-contentful-paint") / 1000).toFixed(1)),
      totalBlockingMs: Math.round(metric("total-blocking-time")),
      layoutShift: Number(metric("cumulative-layout-shift").toFixed(3)),
      pageWeightKb: Math.round(metric("total-byte-weight") / 1024),
      properlySizedImages: reports.every((r) => r.audits["uses-responsive-images"]?.score !== 0),
    };
    console.log(profile, route, results[profile][route]);
    }
  }
} finally {
  rmSync(workDir, { recursive: true, force: true });
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    server.kill();
  }
}

const date = new Date().toISOString().slice(0, 10);
mkdirSync("docs/baselines", { recursive: true });
writeFileSync(
  process.env.LIGHTHOUSE_OUTPUT || `docs/baselines/lighthouse-${date}.json`,
  `${JSON.stringify({ date, lighthouse, profiles, runs, results }, null, 2)}\n`
);
