// Renders the product video scenes in this folder to public/videos/*.{mp4,webm,jpg}.
//
// The scenes are deterministic HTML animations: each exposes window.render(t), and this
// script captures every frame at a fixed time step, so output is identical on every run.
//
// Usage (tools are installed temporarily, not added to the project):
//   npm i --no-save playwright ffmpeg-static
//   npx playwright install chromium   # skip if Chromium is already available
//   node scripts/videos/render.mjs [scene-name ...]
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const ffmpeg = process.env.FFMPEG_PATH || require("ffmpeg-static");

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "../../public/videos");

/** name → time (seconds) of the frame used as the poster / reduced-motion still. */
const scenes = {
  "script-to-insight": 8.9,
  "agent-pipeline": 7.9,
  "bulk-stack": 6.9,
};

const SCALE = 1.5; // 1280×720 CSS px → 1920×1080 output

function run(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
    proc.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
  });
}

async function renderScene(browser, name, posterAt) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: SCALE });
  await page.goto(pathToFileURL(path.join(here, `${name}.html`)).href);
  await page.evaluate(() => document.fonts.ready);
  const { duration, fps } = await page.evaluate(() => window.SCENE);
  const frames = Math.round(duration * fps);
  const tmp = await mkdtemp(path.join(tmpdir(), `paatam-${name}-`));

  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.render(t), i / fps);
    await page.screenshot({ path: path.join(tmp, `${String(i).padStart(4, "0")}.png`) });
  }
  await page.evaluate((t) => window.render(t), posterAt);
  await page.screenshot({ path: path.join(tmp, "poster.png") });
  await page.close();

  const input = ["-framerate", String(fps), "-i", path.join(tmp, "%04d.png")];
  await run([...input, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", path.join(outDir, `${name}.mp4`)]);
  // VP9 fallback for browsers without H.264 (e.g. some Linux Chromium builds).
  await run(["-i", path.join(outDir, `${name}.mp4`), "-c:v", "libvpx-vp9", "-crf", "42", "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-an", path.join(outDir, `${name}.webm`)]);
  await run(["-i", path.join(tmp, "poster.png"), "-vf", "scale=1280:-1", "-q:v", "4", path.join(outDir, `${name}.jpg`)]);
  await rm(tmp, { recursive: true, force: true });
  console.log(`✓ ${name} (${frames} frames)`);
}

const requested = process.argv.slice(2);
const names = requested.length ? requested : Object.keys(scenes);
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
try {
  for (const name of names) {
    if (!(name in scenes)) throw new Error(`Unknown scene "${name}"`);
    await renderScene(browser, name, scenes[name]);
  }
} finally {
  await browser.close();
}
