// scripts/generate-pwa-icons.mjs
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writePngFromSvg(svgBuffer, outPath, size) {
  await sharp(svgBuffer)
    .resize(size, size, { fit: "contain" })
    .png({ quality: 100 })
    .toFile(outPath);
}

async function writeMaskable(svgBuffer, outPath, size) {
  // Maskable icons need padding so the glyph isn't clipped by rounded masks.
  // We'll render the SVG smaller and center it on a transparent canvas.
  const inner = Math.round(size * 0.78); // ~22% padding total
  const rendered = await sharp(svgBuffer)
    .resize(inner, inner, { fit: "contain" })
    .png({ quality: 100 })
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: rendered, gravity: "center" }])
    .png({ quality: 100 })
    .toFile(outPath);
}

async function main() {
  const svgPath = path.join(ROOT, "public", "icon.svg");
  const svgOk = await exists(svgPath);

  if (!svgOk) {
    console.error(
      `[PWA] Missing public/icon.svg. Create it first, then rerun install/build.`
    );
    process.exit(1);
  }

  const svgBuffer = await fs.readFile(svgPath);

  // Ensure folders
  const pwaDir = path.join(ROOT, "public", "pwa");
  await ensureDir(pwaDir);

  // PWA icons
  await writePngFromSvg(svgBuffer, path.join(pwaDir, "icon-192.png"), 192);
  await writePngFromSvg(svgBuffer, path.join(pwaDir, "icon-512.png"), 512);
  await writeMaskable(svgBuffer, path.join(pwaDir, "icon-512-maskable.png"), 512);

  // Apple + favicons
  await writePngFromSvg(svgBuffer, path.join(ROOT, "public", "apple-touch-icon.png"), 180);
  await writePngFromSvg(svgBuffer, path.join(ROOT, "public", "favicon-32.png"), 32);
  await writePngFromSvg(svgBuffer, path.join(ROOT, "public", "favicon-16.png"), 16);

  console.log("[PWA] Icons generated successfully.");
}

main().catch((err) => {
  console.error("[PWA] Failed to generate icons:", err);
  process.exit(1);
});
