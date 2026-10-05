// Captures high-resolution "plates" of the /v2 site for the marketing demo video.
// Needs the production site running (npm run build && npm run start -- -p 3100).
//
//   PLAYWRIGHT_MODULE=$(npm root -g)/playwright node scripts/videos/demo/capture.mjs
//
// Writes PNGs + plates.json (element boxes used as zoom targets) to scripts/videos/demo/plates/.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const BASE = process.env.BASE || "http://localhost:3100";
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "plates");
await mkdir(out, { recursive: true });

// Modules shown in the video, in order (the coordinator view is intentionally left out).
const MODULES = ["overview", "classes", "student-analytics", "knowledge-base", "exam-generator", "head-of-school", "student-portal", "parent-whatsapp"];
const DSF = 3;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: DSF, reducedMotion: "reduce" });
await page.goto(`${BASE}/v2`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
const meta = { dsf: DSF, modules: {} };

// Hero: the first viewport, header included.
await page.screenshot({ path: path.join(out, "hero.png") });
meta.hero = await page.evaluate(() => {
  const h1 = document.querySelector("h1").getBoundingClientRect();
  return { w: innerWidth, h: innerHeight, h1: { x: h1.x, y: h1.y, w: h1.width, h: h1.height } };
});

// Dashboard window, one plate per module, plus boxes of every panel inside it.
await page.addStyleTag({ content: "#module-tab-coordinator { display: none !important; }" });
const win = page.locator('[role="tablist"][aria-label="Paatam product modules"]').locator("xpath=ancestor::div[contains(@class,'rounded-2xl')][1]");
await win.scrollIntoViewIfNeeded();
const ids = await page.$$eval('[id^="module-tab-"]', (els) => els.map((e) => e.id.slice("module-tab-".length)));
for (const id of MODULES) {
  if (!ids.includes(id)) throw new Error(`Module tab "${id}" not found (have: ${ids.join(", ")})`);
  await page.click(`#module-tab-${id}`);
  await page.waitForTimeout(500);
  await win.scrollIntoViewIfNeeded();
  await page.screenshot({ path: path.join(out, `module-${id}.png`), clip: await win.boundingBox() });
  meta.modules[id] = await win.evaluate((root, id) => {
    const r = root.getBoundingClientRect();
    const rel = (el) => {
      const b = el.getBoundingClientRect();
      return { x: b.x - r.x, y: b.y - r.y, w: b.width, h: b.height };
    };
    const panel = root.querySelector('[role="tabpanel"]');
    const boxes = [...panel.querySelectorAll("div.rounded-xl")]
      .filter((el) => el.querySelector(":scope > div > h4"))
      .map((el) => ({ title: el.querySelector("h4").textContent, ...rel(el) }));
    const stats = [...panel.querySelectorAll("div.rounded-xl")].filter((el) => el.querySelector(":scope > div > p") && !el.querySelector("h4"));
    const statsBox = stats.length ? stats.map(rel).reduce((a, b) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.max(a.x + a.w, b.x + b.w) - Math.min(a.x, b.x), h: Math.max(a.y + a.h, b.y + b.h) - Math.min(a.y, b.y) })) : null;
    return {
      w: r.width,
      h: r.height,
      title: panel.querySelector("h3").textContent,
      subtitle: panel.querySelector("h3 + p")?.textContent ?? "",
      sidebar: rel(root.firstElementChild),
      tab: rel(document.getElementById(`module-tab-${id}`)),
      panels: boxes,
      stats: statsBox,
    };
  }, id);
}

await writeFile(path.join(out, "plates.json"), JSON.stringify(meta, null, 2));
await browser.close();
console.log("plates written:", Object.keys(meta.modules).length + 1);
