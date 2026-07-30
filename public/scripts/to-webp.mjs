import { readdirSync, statSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DIR = ROOT + "public/images/";

// Never converted — favicon (app/layout.js); Safari won't load a WebP icon.
const SKIP = new Set(["logo.png"]);

// Converted, but the original is also left in place: app/layout.js points the
// Open Graph tag at s304.jpg, and WhatsApp/LinkedIn crawlers won't render WebP.
const KEEP_ORIGINAL = new Set(["s304.jpg"]);

const kb = (b) => Math.round(b / 1024) + "KB";

const sources = readdirSync(DIR).filter(
  (f) => /\.(jpe?g|png)$/i.test(f) && !SKIP.has(f)
);

let before = 0;
let after = 0;

for (const src of sources) {
  const out = src.replace(/\.(jpe?g|png)$/i, ".webp");
  const srcBytes = statSync(DIR + src).size;

  // Re-encoding already-lossy JPEGs, so quality 82 / effort 6 keeps the size
  // win without a visible second-generation loss.
  await sharp(DIR + src).webp({ quality: 82, effort: 6 }).toFile(DIR + out);

  const outBytes = statSync(DIR + out).size;
  before += srcBytes;
  after += outBytes;

  let note = "";
  if (KEEP_ORIGINAL.has(src)) {
    note = "  (original kept for Open Graph)";
  } else {
    unlinkSync(DIR + src);
  }

  const saved = Math.round((1 - outBytes / srcBytes) * 100);
  console.log(`${src} -> ${out}  ${kb(srcBytes)} -> ${kb(outBytes)}  (-${saved}%)${note}`);
}

console.log(
  `\n${sources.length} converted: ${kb(before)} -> ${kb(after)} ` +
    `(-${Math.round((1 - after / before) * 100)}%)`
);
console.log(`not converted: ${[...SKIP].join(", ")}`);
