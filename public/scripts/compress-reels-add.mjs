import { execFileSync } from "node:child_process";
import { existsSync, statSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const VID = ROOT + "public/videos/";
const IMG = ROOT + "public/images/";

// [source at repo root, reel number]. Sources stay out of git (.gitignore);
// only the encoded reel and its poster frame are committed.
const reels = [
  ["MODERN final.mp4", 9],
  ["Modern May Reel.mp4", 10],
  ["Modern Reel  M04.mp4", 11],
  ["Modern Reel  M05.mp4", 12],
  ["Modern Reel  M06.mp4", 13],
  ["Modern Reel  M07.mp4", 14],
  ["Modern Reel  M08.mp4", 15],
  ["Modern Reel J01.mp4", 16],
];

const mb = (p) => (statSync(p).size / 1024 / 1024).toFixed(1) + "MB";
const run = (args) => execFileSync(ffmpegPath, args, { stdio: ["ignore", "ignore", "ignore"] });

let encoded = 0;
let srcTotal = 0;
let outTotal = 0;

for (const [src, n] of reels) {
  const srcPath = ROOT + src;
  const out = `${VID}reel${n}.mp4`;
  const poster = `${IMG}reel${n}.webp`;

  if (!existsSync(srcPath)) {
    console.log(`skip (no source): reel${n}  <- ${src}`);
    continue;
  }
  // Re-running shouldn't burn minutes re-encoding what's already done.
  if (existsSync(out) && existsSync(poster)) {
    console.log(`skip (done):      reel${n}.mp4  ${mb(out)}`);
    continue;
  }

  process.stdout.write(`encoding reel${n}.mp4 from ${mb(srcPath)}... `);

  // Same ladder as every other reel: 720px wide, crf 31, veryfast, 96k audio,
  // faststart so playback can begin before the file is fully downloaded.
  run([
    "-y", "-i", srcPath,
    "-vf", "scale='min(720,iw)':-2:force_original_aspect_ratio=decrease",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "31",
    "-c:a", "aac", "-b:a", "96k",
    "-movflags", "+faststart",
    out,
  ]);

  // Poster frame grabbed a little way in, past any fade from black.
  const tmp = `${IMG}.reel${n}-frame.png`;
  run(["-y", "-ss", "2.5", "-i", out, "-frames:v", "1", tmp]);
  await sharp(tmp).webp({ quality: 82, effort: 6 }).toFile(poster);
  unlinkSync(tmp);

  srcTotal += statSync(srcPath).size;
  outTotal += statSync(out).size;
  encoded++;
  console.log(`${mb(out)}  + poster ${mb(poster)}`);
}

if (encoded) {
  const pct = Math.round((1 - outTotal / srcTotal) * 100);
  console.log(
    `\n${encoded} encoded: ${(srcTotal / 1024 / 1024).toFixed(0)}MB -> ` +
      `${(outTotal / 1024 / 1024).toFixed(1)}MB (-${pct}%)`
  );
} else {
  console.log("\nnothing to do");
}
