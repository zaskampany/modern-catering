import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const OUT = ROOT + "public/images/";
mkdirSync(OUT, { recursive: true });

// Transparent logo -> keep PNG transparency, trim, resize
await sharp(ROOT + "logo-no-bg.png")
  .trim()
  .resize({ width: 320, withoutEnlargement: true })
  .png({ compressionLevel: 9 })
  .toFile(OUT + "logo.png");
console.log("ok: logo.png");

// New professional event photos -> optimized JPG (max 1600px)
const photos = [
  ["IMG_6078.JPEG", "serve1.jpg"],   // serving sadhya on banana leaf
  ["IMG_6079.JPEG", "team1.jpg"],    // team group
  ["IMG_6080.JPEG", "sadhya1.jpg"],  // long banquet tables
  ["IMG_6081.JPEG", "sadhya2.jpg"],  // banquet rows
  ["IMG_6083.JPEG", "team2.jpg"],    // team group
  ["IMG_6084.JPEG", "team3.jpg"],    // team group (crisp)
  ["IMG_6085.JPEG", "sadhya3.jpg"],  // guests dining
  ["IMG_6090.JPEG", "sadhya4.jpg"],  // guests dining wide
  ["IMG_6093.JPEG", "sadhya5.jpg"],  // dining + serving
  ["IMG_6096.JPEG", "sadhya6.jpg"],  // long tables dining
];

for (const [src, out] of photos) {
  if (!existsSync(ROOT + src)) { console.log("skip (missing):", src); continue; }
  await sharp(ROOT + src)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(OUT + out);
  console.log("ok:", out);
}
console.log("DONE");
