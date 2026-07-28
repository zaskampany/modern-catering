import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import ffmpegPath from "ffmpeg-static";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const VID_OUT = ROOT + "public/videos/";
const reels = [
  ["insta-reels-videos/Modern Catering R1 v2.mp4", VID_OUT + "reel5.mp4"],
  ["insta-reels-videos/Modern Catering R2 v2.mp4", VID_OUT + "reel6.mp4"],
  ["insta-reels-videos/Modern May Reel 02.mp4", VID_OUT + "reel7.mp4"],
  ["insta-reels-videos/Modern May Reel 03 .mp4", VID_OUT + "reel8.mp4"],
];
for (const [src, out] of reels) {
  if (!existsSync(ROOT + src)) { console.log("skip (missing):", src); continue; }
  console.log("encoding", out);
  execFileSync(ffmpegPath, [
    "-y", "-i", ROOT + src,
    "-vf", "scale='min(720,iw)':-2:force_original_aspect_ratio=decrease",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "31",
    "-c:a", "aac", "-b:a", "96k",
    "-movflags", "+faststart",
    out,
  ], { stdio: "inherit" });
  console.log("ok:", out);
}
console.log("REELS_DONE");
