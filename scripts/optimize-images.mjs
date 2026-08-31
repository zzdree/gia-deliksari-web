#!/usr/bin/env node
/**
 * Image optimization pipeline.
 *
 * Reads every JPEG/PNG under public/images/, generates matching .webp + .avif
 * siblings at quality 82 (WebP) / 55 (AVIF), and re-encodes the originals to
 * slightly compressed JPEG (quality 85) / PNG-optimized.
 *
 * Why both modern formats:
 *   - AVIF: ~50% smaller than JPEG, supported by Chrome 85+, Firefox 93+, Safari 16+
 *   - WebP: ~30% smaller, broader support (Safari 14+, all evergreen browsers)
 *   Next.js <Image> picks the best one automatically via Accept header.
 *
 * Idempotent: re-running won't re-encode if source is older than outputs.
 *
 * Usage:
 *   node scripts/optimize-images.mjs            # optimize all images
 *   node scripts/optimize-images.mjs --force    # re-encode even if up-to-date
 */

import { readdir, stat } from 'node:fs/promises';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(process.cwd(), 'public', 'images');
const FORCE = process.argv.includes('--force');
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const SKIP_FILES = new Set(['logo-ig.jpg']); // keep originals untouched (Instagram logo compression already optimal)

const log = (msg) => console.log(`[optimize-images] ${msg}`);
const warn = (msg) => console.warn(`[optimize-images] ⚠️  ${msg}`);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'scraped') continue; // skip scraper working tree
      yield* walk(p);
    } else {
      yield p;
    }
  }
}

function isUpToDate(srcPath, outPaths) {
  // If any output is missing or older than source, re-encode.
  return Promise.all([stat(srcPath), ...outPaths.map((o) => stat(o).catch(() => null))])
    .then(([src, ...outs]) => {
      if (outs.some((o) => !o)) return false;
      return outs.every((o) => o.mtimeMs > src.mtimeMs);
    })
    .catch(() => false);
}

async function optimizeOne(srcPath) {
  const ext = path.extname(srcPath).toLowerCase();
  if (!EXTENSIONS.has(ext)) return null;
  if (SKIP_FILES.has(path.basename(srcPath))) return null;

  const baseName = srcPath.slice(0, -ext.length);
  const webpPath = `${baseName}.webp`;
  const avifPath = `${baseName}.avif`;
  const outPaths = [webpPath, avifPath];

  const upToDate = !FORCE && (await isUpToDate(srcPath, outPaths));
  if (upToDate) return { src: srcPath, status: 'skipped' };

  const srcStat = await stat(srcPath);
  const startedAt = Date.now();

  try {
    const buf = await readFile(srcPath);
    const img = sharp(buf, { failOn: 'none' });
    const meta = await img.metadata();

    // Generate WebP (lossy for JPEG, lossless for PNG to preserve transparency)
    const webpOpts = ext === '.png'
      ? { compressionLevel: 9, nearLossless: true }
      : { quality: 82, effort: 4 };
    const webpBuf = await img.clone().webp(webpOpts).toBuffer();

    // Generate AVIF (smaller; skip for animated/alpha-heavy PNGs as lossy)
    const avifOpts = ext === '.png'
      ? { effort: 4, chromaSubsampling: '4:4:4' }
      : { quality: 55, effort: 4 };
    const avifBuf = await img.clone().avif(avifOpts).toBuffer();

    // Re-encode original at slightly tighter settings to shave bytes.
    // Skip for PNG (lossless territory).
    if (ext === '.jpg' || ext === '.jpeg') {
      const optimizedOriginal = await sharp(buf)
        .jpeg({ quality: 85, mozjpeg: true, progressive: true })
        .toBuffer();
      // Only overwrite if smaller (sometimes source is already optimal).
      if (optimizedOriginal.length < srcStat.size) {
        await writeFile(srcPath, optimizedOriginal);
      }
    } else {
      const optimizedOriginal = await sharp(buf)
        .png({ compressionLevel: 9, palette: true, quality: 80 })
        .toBuffer();
      if (optimizedOriginal.length < srcStat.size) {
        await writeFile(srcPath, optimizedOriginal);
      }
    }

    await writeFile(webpPath, webpBuf);
    await writeFile(avifPath, avifBuf);

    const srcKb = Math.round(srcStat.size / 1024);
    const webpKb = Math.round(webpBuf.length / 1024);
    const avifKb = Math.round(avifBuf.length / 1024);
    const reduction = Math.round((1 - avifBuf.length / srcStat.size) * 100);
    return {
      src: path.relative(process.cwd(), srcPath),
      status: 'optimized',
      format: meta.format,
      width: meta.width,
      height: meta.height,
      srcKb,
      webpKb,
      avifKb,
      reduction,
      ms: Date.now() - startedAt,
    };
  } catch (err) {
    return {
      src: path.relative(process.cwd(), srcPath),
      status: 'failed',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

async function main() {
  const startedAt = Date.now();
  log(`scanning ${ROOT} ...`);

  const files = [];
  for await (const f of walk(ROOT)) files.push(f);
  const targets = files.filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()));

  log(`found ${targets.length} candidate images`);

  let optimized = 0;
  let skipped = 0;
  let failed = 0;
  let totalSavedKb = 0;

  // Process in parallel batches to keep CPU usage predictable.
  const BATCH = 4;
  for (let i = 0; i < targets.length; i += BATCH) {
    const batch = targets.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(optimizeOne));
    for (const r of results) {
      if (!r) continue;
      if (r.status === 'skipped') {
        skipped++;
      } else if (r.status === 'failed') {
        failed++;
        warn(`failed: ${r.src} — ${r.error}`);
      } else {
        optimized++;
        totalSavedKb += Math.max(0, r.srcKb - r.avifKb);
        log(
          `${r.src}: ${r.srcKb}KB → webp ${r.webpKb}KB / avif ${r.avifKb}KB ` +
          `(${r.reduction}% smaller, ${r.ms}ms)`,
        );
      }
    }
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  log(
    `done in ${elapsed}s — ${optimized} optimized, ${skipped} skipped, ${failed} failed. ` +
    `Estimated AVIF savings: ${Math.round(totalSavedKb / 1024 * 10) / 10} MB total.`,
  );

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('[optimize-images] fatal:', err);
  process.exit(1);
});