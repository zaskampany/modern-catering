import { execFileSync } from "node:child_process";
import { existsSync, statSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const SRC = ROOT + "MODERN final.mp4";
const OUT = ROOT + "public/videos/reel9.mp4";
const POSTER = ROOT + "public/images/reel9.webp";
const POSTER_TMP = ROOT + "public/images/.reel9-frame.png";

if (!existsSync(SRC)) {
  console.log("skip (missing):", SRC);
  process.exit(0);
}

const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(2) + "MB";

// Same ladder as the other reels (see compress-reels-extra.mjs): 720px wide,
// crf 31, veryfast, 96k audio, faststart so it starts playing before it's done.
console.log("encoding reel9.mp4 from", mb(SRC), "source...");
execFileSync(ffmpegPath, [
  "-y", "-i", SRC,
  "-vf", "scale='min(720,iw)':-2:force_original_aspect_ratio=decrease",
  "-c:v", "libx264", "-preset", "veryfast", "-crf", "31",
  "-c:a", "aac", "-b:a", "96k",
  "-movflags", "+faststart",
  OUT,
], { stdio: "inherit" });
console.log("ok: reel9.mp4", mb(OUT));

// Poster frame: grabbed a couple of seconds in, past any fade-from-black.
console.log("extracting poster frame...");
execFileSync(ffmpegPath, [
  "-y", "-ss", "2.5", "-i", OUT,
  "-frames:v", "1",
  POSTER_TMP,
], { stdio: "inherit" });

await sharp(POSTER_TMP).webp({ quality: 82, effort: 6 }).toFile(POSTER);
unlinkSync(POSTER_TMP);
console.log("ok: reel9.webp", mb(POSTER));
console.log("DONE");
