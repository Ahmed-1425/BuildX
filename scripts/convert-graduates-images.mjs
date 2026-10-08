// Converts the edition-1 award photos (HEIF/JPG) from "المراكز BUILDx" into
// web-friendly WebP files in public/images/graduates/edition-1/awards.
// HEIF is decoded with macOS `sips` (sharp's prebuilt binaries lack HEVC),
// then sharp produces auto-oriented, responsive WebP variants.
// Source files are never modified.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, existsSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("المراكز BUILDx");
const OUT = path.resolve("public/images/graduates/edition-1/awards");
mkdirSync(OUT, { recursive: true });
const tmp = mkdtempSync(path.join(tmpdir(), "buildx-grad-"));

const files = [
  ["Team 80- المركز الاول.heif", "team-80-first-place"],
  ["Team 10- المركز الثاني_.jpg", "team-10-second-place"],
  ["Team 70- المركز الثالث.heif", "team-70-third-place"],
  ["افضل عرض للحل - Team 20.heif", "team-20-best-solution-presentation"],
  ["افضل منتج واعد - Team 30.jpg", "team-30-most-promising-product"],
  ["الأثر الاستثنائي - Team 50.jpg", "team-50-exceptional-impact"],
  ["الابتكار المتميز - Team 40.heif", "team-40-distinguished-innovation"],
  ["توظيف الذكاء الاصطناعي - Team 60.jpg", "team-60-best-ai-use"],
];
const WIDTHS = [640, 1280, 1920];

for (const [srcName, slug] of files) {
  let input = path.join(SRC, srcName);
  if (!existsSync(input)) {
    // Arabic filenames may differ in Unicode normalization; fall back to a listing match.
    throw new Error(`Missing source: ${srcName}`);
  }
  if (srcName.endsWith(".heif")) {
    const jpg = path.join(tmp, `${slug}.jpg`);
    execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "95", input, "--out", jpg]);
    input = jpg;
  }
  for (const w of WIDTHS) {
    const out = path.join(OUT, w === 1280 ? `${slug}.webp` : `${slug}-${w}.webp`);
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(out);
    console.log(path.basename(out), Math.round(statSync(out).size / 1024) + " KB");
  }
}
