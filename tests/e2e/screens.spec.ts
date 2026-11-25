import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { blockApiWrites, publicRoutes } from "./helpers";
import { screens } from "./screens";

// The screen guard. Every public page is opened at every size in screens.ts and
// measured against the rules in docs/RENDERING_RULES.md (R1 to R10).
//
// Like the accessibility check, it is a ratchet: problems that existed when the
// guard was added are recorded in screens-baseline.json, and a test fails only
// when a page gets worse. After a repair, run `npm run test:screens:update` and
// check that the baseline diff only removes entries.
const baselinePath = "tests/e2e/screens-baseline.json";
type Counts = Record<string, number>;
type Baseline = Record<string, Counts>;

function readBaseline(): Baseline {
  return existsSync(baselinePath) ? JSON.parse(readFileSync(baselinePath, "utf8")) : {};
}

function writeBaselineEntry(key: string, counts: Counts) {
  const baseline = readBaseline();
  if (Object.keys(counts).length) baseline[key] = counts;
  else delete baseline[key];
  const sorted = Object.fromEntries(Object.entries(baseline).sort());
  writeFileSync(baselinePath, `${JSON.stringify(sorted, null, 2)}\n`);
}

// Runs in the page. Returns problem descriptions keyed by rule.
function measure(touch: boolean) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const found: Record<string, string[]> = {};
  const add = (rule: string, detail: string) => (found[rule] ??= []).push(detail);
  const label = (el: Element) =>
    (el.getAttribute("aria-label") || el.textContent || el.tagName).trim().replace(/\s+/g, " ").slice(0, 40);

  const shown = (el: Element) => {
    if (el.closest("[inert], [aria-hidden='true']")) return false;
    // A closed <details> keeps its hidden content laid out, but nobody can see it.
    const closed = el.closest("details:not([open])");
    if (closed && !el.closest("summary") && el !== closed) return false;
    const r = el.getBoundingClientRect();
    if (r.width <= 2 || r.height <= 2) return false;
    for (let n: Element | null = el; n; n = n.parentElement) {
      const s = getComputedStyle(n);
      if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) < 0.05) return false;
    }
    return true;
  };
  const clippedAbove = (el: Element) => {
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      if (p === document.body) break;
      if (getComputedStyle(p).overflowX !== "visible") return true;
    }
    return false;
  };
  const ownsText = (el: Element) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
  const overlap = (a: DOMRect, b: { left: number; top: number; right: number; bottom: number }) =>
    Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

  const all = [...document.body.querySelectorAll("*")];
  const header = document.querySelector(".site-nav");
  const headerBox = header?.getBoundingClientRect();

  // R1: nothing reaches past the sides of the screen.
  for (const el of all) {
    const r = el.getBoundingClientRect();
    if ((r.right > vw + 1 || r.left < -1) && shown(el) && !clippedAbove(el) && !header?.contains(el)) add("R1-sideways", label(el));
  }

  // R2: every header item fits on screen.
  if (header) for (const el of header.querySelectorAll("a, button, img, svg")) {
    const r = el.getBoundingClientRect();
    if (shown(el) && (r.right > vw + 1 || r.left < -1)) add("R2-header-fit", label(el));
  }

  // R3: the page headline starts below the header.
  const h1 = [...document.querySelectorAll("h1")].find(shown);
  if (h1 && headerBox && h1.getBoundingClientRect().top < headerBox.bottom - 1) add("R3-headline-under-header", label(h1));

  // R4: the hero's main button is on the first screen.
  const hero = document.querySelector("main section, body section");
  const cta = hero && [...hero.querySelectorAll(".btn-primary, .btn-ghost, .btn-outline")].find(shown);
  if (cta && cta.getBoundingClientRect().bottom > vh) add("R4-action-below-first-screen", label(cta));

  // R5: text never covers a hero image's subject, and the crop keeps it in view.
  for (const img of document.querySelectorAll<HTMLImageElement>("img[data-subject]")) {
    if (!shown(img) || !img.naturalWidth) continue;
    const altMedia = img.dataset.subjectAltMedia;
    const spec = altMedia && img.dataset.subjectAlt && matchMedia(altMedia).matches ? img.dataset.subjectAlt : img.dataset.subject!;
    const r = img.getBoundingClientRect();
    const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const [px, py] = getComputedStyle(img).objectPosition.split(" ").map((v) => parseFloat(v) / 100);
    const offX = (r.width - img.naturalWidth * scale) * (Number.isNaN(px) ? 0.5 : px);
    const offY = (r.height - img.naturalHeight * scale) * (Number.isNaN(py) ? 0.5 : py);
    const section = img.closest("section") ?? document.body;
    const texts = [...section.querySelectorAll("*")].filter((el) => !img.contains(el) && (ownsText(el) || el.matches("a, button")) && shown(el)).map((el) => el.getBoundingClientRect());
    spec.split(",").forEach((boxText, i) => {
      const [x0, y0, x1, y1] = boxText.trim().split(/\s+/).map(Number);
      const box = {
        left: r.left + offX + x0 * img.naturalWidth * scale,
        top: r.top + offY + y0 * img.naturalHeight * scale,
        right: r.left + offX + x1 * img.naturalWidth * scale,
        bottom: r.top + offY + y1 * img.naturalHeight * scale,
      };
      const area = (box.right - box.left) * (box.bottom - box.top);
      const covered = texts.reduce((sum, t) => sum + overlap(t, box), 0) / area;
      const inView = overlap(new DOMRect(Math.max(r.left, 0), r.top, Math.min(r.right, vw) - Math.max(r.left, 0), r.height), box) / area;
      const file = img.currentSrc.includes("url=") ? decodeURIComponent(img.currentSrc.split("url=")[1].split("&")[0]) : img.currentSrc;
      const name = `${file.split("/").pop()} subject ${i + 1}`;
      if (covered > 0.05) add("R5-subject-covered", `${name}: ${Math.round(covered * 100)}% under text`);
      if (inView < 0.9) add("R5-subject-cropped", `${name}: ${Math.round((1 - inView) * 100)}% cropped`);
    });
  }

  // R6: photos are not shown larger than their pixels.
  for (const img of document.querySelectorAll("img")) {
    if (!shown(img) || !img.naturalWidth || img.currentSrc.endsWith(".svg")) continue;
    const r = img.getBoundingClientRect();
    if (r.width < 200) continue;
    const fit = getComputedStyle(img).objectFit;
    const scale = fit === "cover" ? Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight) : Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
    if (scale > 1.15) {
      const src = img.currentSrc.includes("url=") ? decodeURIComponent(img.currentSrc.split("url=")[1].split("&")[0]) : img.currentSrc;
      add("R6-image-too-small", `${src.split("/").slice(-2).join("/")} at ${scale.toFixed(1)}x`);
    }
  }

  // R7: no text smaller than 12px.
  for (const el of all) if (ownsText(el) && shown(el) && parseFloat(getComputedStyle(el).fontSize) < 12) add("R7-text-under-12px", label(el));

  // R8: touch targets are at least 24px, except links inside running text.
  if (touch) for (const el of document.querySelectorAll("a[href], button, input, select, textarea, [role='button']")) {
    if (!shown(el)) continue;
    const r = el.getBoundingClientRect();
    // `.tap-target` enlarges the touch area with an invisible ::after layer.
    const after = getComputedStyle(el, "::after");
    const extended = after.content !== "none" && after.position === "absolute";
    const width = extended ? Math.max(r.width, parseFloat(after.width) || 0) : r.width;
    const height = extended ? Math.max(r.height, parseFloat(after.height) || 0) : r.height;
    const inline = getComputedStyle(el).display === "inline" && el.closest("p");
    if (!inline && (width < 24 || height < 24)) add("R8-small-tap-target", label(el));
  }

  // R9: floating buttons do not cover text or controls on the first screen.
  for (const el of all) {
    const s = getComputedStyle(el);
    if (s.position !== "fixed" || !shown(el) || header?.contains(el) || el.contains(header ?? null)) continue;
    const r = el.getBoundingClientRect();
    if (r.top < (headerBox?.bottom ?? 0) || r.width > vw * 0.8) continue; // header bars and full-screen layers
    for (const other of all) {
      if (el.contains(other) || other.contains(el) || !(ownsText(other) || other.matches("a, button")) || !shown(other)) continue;
      if (overlap(other.getBoundingClientRect(), r) > 4) add("R9-floating-overlap", `${label(el)} over ${label(other)}`);
    }
  }

  // R10: text is not cut off inside its box.
  for (const el of document.querySelectorAll("h1, h2, h3, h4, p, a, button, li, dd, dt, label, span")) {
    // Only boxes that hold the text themselves: a card that clips a zoomed photo is not clipped text.
    if (!ownsText(el) || !shown(el)) continue;
    const s = getComputedStyle(el);
    const hidesOverflow = s.overflowX === "hidden" || s.overflowX === "clip";
    if (hidesOverflow && s.textOverflow !== "ellipsis" && !/\d/.test(s.webkitLineClamp) && el.scrollWidth > el.clientWidth + 2) add("R10-text-clipped", label(el));
  }

  return found;
}

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    const pending = [...document.images].filter((img) => !img.complete && img.getBoundingClientRect().top < innerHeight);
    await Promise.all(pending.map((img) => new Promise((done) => { img.onload = img.onerror = done; setTimeout(done, 5000); })));
  });
  // Floating buttons fade in after the page settles; measure their final state.
  const sinceLoad = await page.evaluate(() => performance.now());
  await page.waitForTimeout(Math.max(300, 1800 - sinceLoad));
}

for (const screen of screens) {
  test.describe(`${screen.name} ${screen.width}x${screen.height}`, () => {
    test.use({
      viewport: { width: screen.width, height: screen.height },
      isMobile: screen.touch && screen.width < 900,
      hasTouch: screen.touch,
      deviceScaleFactor: 1,
      contextOptions: { reducedMotion: "reduce" },
    });

    for (const route of publicRoutes) {
      const tag = screen.tier === "full" ? " @screens-full" : "";
      test(`${route} fits${tag}`, async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== "desktop", "The guard sets its own screen sizes; one project is enough.");
        await blockApiWrites(page);
        await page.goto(route, { waitUntil: "load" });
        await settle(page);

        const problems: Record<string, string[]> = {};
        const merge = (found: Record<string, string[]>) => {
          for (const [rule, list] of Object.entries(found)) problems[rule] = [...new Set([...(problems[rule] ?? []), ...list])];
        };
        merge(await page.evaluate(measure, screen.touch));

        // The homepage rotates slides; every slide must pass on its own.
        const dots = page.getByRole("button", { name: /^Show slide \d+$/ });
        const slides = await dots.count();
        for (let i = 1; i < slides; i++) {
          await dots.nth(i).click();
          await page.waitForTimeout(2200); // slides cross-fade for 2s
          await settle(page);
          merge(await page.evaluate(measure, screen.touch));
        }

        // R9 also applies at the end of the page, where the footer meets floating buttons.
        // Pages can grow once scrolled (bars appear), so repeat until the bottom holds.
        for (let i = 0; i < 4; i++) {
          const atBottom = await page.evaluate(() => {
            const end = document.documentElement.scrollHeight - innerHeight;
            const done = Math.abs(scrollY - end) < 2;
            window.scrollTo({ top: end, behavior: "instant" });
            return done;
          });
          await page.waitForTimeout(400);
          if (atBottom) break;
        }
        await page.waitForTimeout(400);
        const atEnd = (await page.evaluate(measure, screen.touch))["R9-floating-overlap"] ?? [];
        if (atEnd.length) merge({ "R9-floating-overlap": atEnd.map((detail) => `page end: ${detail}`) });

        const counts: Counts =Object.fromEntries(Object.entries(problems).map(([rule, list]) => [rule, list.length] as const).sort());
        const key = `${screen.name} ${route}`;
        // SCREENS_VERBOSE=1 prints every problem, to see what a baseline count stands for.
        if (process.env.SCREENS_VERBOSE) console.log(key, JSON.stringify(problems, null, 1));

        if (["all", "changed"].includes(testInfo.config.updateSnapshots)) {
          writeBaselineEntry(key, counts);
          return;
        }

        const known = readBaseline()[key] ?? {};
        const worse = Object.entries(counts)
          .filter(([rule, count]) => count > (known[rule] ?? 0))
          .map(([rule, count]) => `${rule}: ${known[rule] ?? 0} -> ${count} (${problems[rule].slice(0, 4).join(" | ")})`);
        expect(worse, `rendering problems above the recorded baseline at ${screen.name} (see docs/RENDERING_RULES.md)`).toEqual([]);
      });
    }
  });
}
