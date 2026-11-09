import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const baseUrl = process.argv[2] ?? "http://localhost:3057";
const browser = await chromium.launch();
const context = await browser.newContext({ serviceWorkers: "block", javaScriptEnabled: false });
const page = await context.newPage();

try {
  await page.goto(baseUrl);
  const paths = await page.evaluate(async () => {
    const response = await fetch("/sitemap.xml");
    const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
    return [...xml.querySelectorAll("loc")].map((node) => new URL(node.textContent).pathname);
  });

  const rows = [];
  for (const path of paths) {
    const routePage = await context.newPage();
    await routePage.goto(new URL(path, baseUrl).toString(), { waitUntil: "domcontentloaded" });
    const meta = await routePage.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
      image: document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "",
    }));
    rows.push({ path, ...meta });
    await routePage.close();
  }

  const escape = (value) => value.replaceAll("|", "\\|").replaceAll("\n", " ");
  const shortTitles = rows.filter((row) => row.title.length < 50 || row.title.length > 60);
  const descriptionOutliers = rows.filter((row) => row.description.length < 140 || row.description.length > 160);
  const duplicateTitles = rows.filter((row, index) => rows.findIndex((other) => other.title === row.title) !== index);
  const table = [
    "# SEO Metadata Audit",
    "",
    "Generated from the local production build. Review page copy with the temple before promotion. Title and description lengths are editorial guides, not search-engine guarantees.",
    "",
    "| Route | Title (chars) | Description (chars) | Canonical | Share image |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map(({ path, title, description, canonical, image }) =>
      `| ${path} | ${escape(title)} (${title.length}) | ${escape(description)} (${description.length}) | ${canonical} | ${image} |`
    ),
    "",
    "## Copy Review",
    "",
    `- ${shortTitles.length} titles fall outside the 50-60 character editorial target: ${shortTitles.map((row) => row.path).join(", ") || "none"}.`,
    `- ${descriptionOutliers.length} descriptions fall outside the 140-160 character editorial target: ${descriptionOutliers.map((row) => row.path).join(", ") || "none"}.`,
    `- Duplicate titles: ${duplicateTitles.map((row) => row.path).join(", ") || "none"}.`,
    "",
    "## Editorial Follow-up",
    "",
    "- Confirm page titles and descriptions with the temple before launch promotion.",
    "- Confirm exact temple coordinates before adding `geo` to HinduTemple structured data.",
    "- Confirm exact publication dates for both blog posts before adding `datePublished`.",
    "- Verify live rich results and social previews after deployment; local markup tests cannot validate third-party caches.",
    "",
  ];
  await writeFile("docs/SEO_METADATA_AUDIT.md", table.join("\n"));
  console.log(`Audited ${rows.length} indexed routes.`);
} finally {
  await browser.close();
}
