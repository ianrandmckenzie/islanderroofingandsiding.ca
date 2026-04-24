#!/usr/bin/env node
import { readdirSync, statSync } from 'fs';
import { resolve, dirname, extname, join, basename } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(__dirname, '..', 'public', 'assets');
const maxDimension = 2400;
const webpQuality = 82;
const sourceExts = new Set(['.png', '.jpg', '.jpeg']);

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (sourceExts.has(extname(entry).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

async function optimizeImage(filePath) {
  const outputPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
  const image = sharp(filePath).rotate().resize({
    width: maxDimension,
    height: maxDimension,
    fit: 'inside',
    withoutEnlargement: true,
  });

  const metadata = await image.metadata();
  await image.webp({ quality: webpQuality, effort: 4 }).toFile(outputPath);

  const dimensions = [metadata.width ?? '?', metadata.height ?? '?'].join('x');
  console.log(`optimized ${basename(filePath)} -> ${basename(outputPath)} (${dimensions}, max ${maxDimension}px)`);
}

async function main() {
  const files = walk(assetsDir);
  if (!files.length) {
    console.log('No raster images found under public/assets.');
    return;
  }

  for (const filePath of files) {
    await optimizeImage(filePath);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
