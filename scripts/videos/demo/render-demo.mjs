// Renders demo.html frame by frame into a 1080p H.264 MP4.
//
//   npx http-server -p 3200 -s .            # from the repo root (serves the HTML, plates and fonts)
//   PLAYWRIGHT_MODULE=$(npm root -g)/playwright FFMPEG_PATH=<ffmpeg> \
//     node scripts/videos/demo/render-demo.mjs out.mp4 [--preview 3,20,45]
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const ffmpeg = process.env.FFMPEG_PATH || require("ffmpeg-static");
const URL = process.env.DEMO_URL || "http://localhost:3200/scripts/videos/demo/demo.html";
const [out, flag, list] = process.argv.slice(2);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto(URL, { waitUntil: "networkidle" });
const { duration, fps } = await page.evaluate(() => window.init());
console.log(`duration ${duration.toFixed(1)}s`);

if (flag === "--preview") {
  for (const t of list.split(",").map(Number)) {
    await page.evaluate((t) => window.render(t), t);
    await page.screenshot({ path: out.replace(/\.mp4$/, "") + `-${t}.jpg`, type: "jpeg", quality: 85 });
  }
} else {
  const tmp = await mkdtemp(path.join(tmpdir(), "paatam-demo-"));
  const frames = Math.round(duration * fps);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.render(t), i / fps);
    await page.screenshot({ path: path.join(tmp, `${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 95 });
    if (i % 300 === 0) console.log(`frame ${i}/${frames}`);
  }
  await new Promise((resolve, reject) => {
    const p = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-framerate", String(fps), "-i", path.join(tmp, "%05d.jpg"),
      "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out], { stdio: "inherit" });
    p.on("exit", (c) => (c === 0 ? resolve() : reject(new Error(`ffmpeg ${c}`))));
  });
  await rm(tmp, { recursive: true, force: true });
  console.log(`wrote ${out} (${frames} frames)`);
}
await browser.close();
