// scripts/generate-pwa-icons.mjs
// Generates PWA icons from public/icon.svg using sharp
// Outputs:
// - public/pwa/icon-192.png
// - public/pwa/icon-512.png
// - public/pwa/icon-512-maskable.png
// - public/pwa/apple-touch-icon.png

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

const srcSvg = path.join(root, "public", "icon.svg");
const outDir = path.join(root, "public", "pwa");

if (!fs.existsSync(srcSvg)) {
  console.error(`Missing source SVG: ${srcSvg}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const svgBuffer = fs.readFileSync(srcSvg);

async function writePng(dest, size) {
  await sharp(svgBuffer, { density: 300 })
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(dest);

  console.log(`✅ Wrote ${path.relative(root, dest)} (${size}x${size})`);
}

async function writeMaskable(dest, size) {
  // Maskable icons need padding / safe area.
  // We place the SVG into a padded canvas so it won’t get clipped by OS masks.
  const padding = Math.round(size * 0.12); // ~12% padding is a good baseline
  const inner = size - padding * 2;

  const resized = await sharp(svgBuffer, { density: 300 })
    .resize(inner, inner, { fit: "contain" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 2, g: 6, b: 23, alpha: 1 }, // #020617
    },
  })
    .composite([{ input: resized, left: padding, top: padding }])
    .png({ compressionLevel: 9 })
    .toFile(dest);

  console.log(`✅ Wrote ${path.relative(root, dest)} (maskable ${size}x${size})`);
}

async function main() {
  await writePng(path.join(outDir, "icon-192.png"), 192);
  await writePng(path.join(outDir, "icon-512.png"), 512);
  await writeMaskable(path.join(outDir, "icon-512-maskable.png"), 512);
  await writePng(path.join(outDir, "apple-touch-icon.png"), 180);

  console.log("\nDone. Now deploy and hard-refresh / clear SW cache if needed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
