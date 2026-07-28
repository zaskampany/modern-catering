import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const IMG_OUT = ROOT + "public/images/";
const VID_OUT = ROOT + "public/videos/";
mkdirSync(IMG_OUT, { recursive: true });
mkdirSync(VID_OUT, { recursive: true });

// ---- Images: PNG -> optimized JPG (max 1400px) ----
const images = [
  ["Modern S301.png", "s301.jpg"],
  ["Modern S302.png", "s302.jpg"],
  ["Modern S303.png", "s303.jpg"],
  ["Modern S304.png", "s304.jpg"],
  ["Modern S305.png", "s305.jpg"],
  ["Modern S306.png", "s306.jpg"],
  ["Modern S307.png", "s307.jpg"],
  ["Modern S308.png", "s308.jpg"],
  ["Modern S309.png", "s309.jpg"],
  ["Modern S310.png", "s310.jpg"],
  ["Modern S311.png", "s311.jpg"],
  ["Modern S312.png", "s312.jpg"],
];

console.log("== Images ==");
for (const [src, out] of images) {
  if (!existsSync(ROOT + src)) { console.log("skip (missing):", src); continue; }
  await sharp(ROOT + src)
    .resize({ width: 1400, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(IMG_OUT + out);
  console.log("ok:", out);
}
// Logo -> keep transparency-ish, output as jpg + small png
await sharp(ROOT + "Modern logo.jpeg")
  .resize({ width: 400 })
  .jpeg({ quality: 88 })
  .toFile(IMG_OUT + "logo.jpg");
console.log("ok: logo.jpg");

// ---- Videos ----
// hero: landscape-ish cover, no audio, small
// reels: vertical, keep audio, small
function run(args) {
  execFileSync(ffmpegPath, args, { stdio: "inherit" });
}

const hero = ["insta-reels-videos/Food.mp4", VID_OUT + "hero.mp4", "hero"];
const reels = [
  ["insta-reels-videos/Modern Catering Reel 01.mp4", VID_OUT + "reel1.mp4"],
  ["insta-reels-videos/Modern Catering Reel 02.mp4", VID_OUT + "reel2.mp4"],
  ["insta-reels-videos/Modern Catering Reel 03.mp4", VID_OUT + "reel3.mp4"],
  ["insta-reels-videos/Modern May Reel.mp4", VID_OUT + "reel4.mp4"],
];

console.log("== Hero video ==");
run([
  "-y", "-i", ROOT + hero[0],
  "-an",
  "-vf", "scale='min(1280,iw)':-2:force_original_aspect_ratio=decrease",
  "-c:v", "libx264", "-preset", "veryfast", "-crf", "30",
  "-movflags", "+faststart",
  hero[1],
]);
console.log("ok: hero.mp4");

console.log("== Reels ==");
for (const [src, out] of reels) {
  if (!existsSync(ROOT + src)) { console.log("skip (missing):", src); continue; }
  run([
    "-y", "-i", ROOT + src,
    "-vf", "scale='min(720,iw)':-2:force_original_aspect_ratio=decrease",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "31",
    "-c:a", "aac", "-b:a", "96k",
    "-movflags", "+faststart",
    out,
  ]);
  console.log("ok:", out);
}
console.log("DONE");
