#!/usr/bin/env node

/**
 * Preview resize of OG images to 1200x630 px
 * Creates copies with -resized suffix WITHOUT replacing originals
 *
 * Usage:
 *   node scripts/resize-og-images-preview.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir } from 'fs/promises';
import { existsSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 630;

async function previewResize(filename) {
  const inputPath = join(__dirname, '..', 'public', 'images', filename);
  const outputFilename = filename.replace('.webp', '-resized.webp');
  const outputPath = join(__dirname, '..', 'public', 'images', outputFilename);

  try {
    const metadata = await sharp(inputPath).metadata();

    // Skip if already correct size
    if (metadata.width === EXPECTED_WIDTH && metadata.height === EXPECTED_HEIGHT) {
      console.log(`⏭️  ${filename} - already correct size (${EXPECTED_WIDTH}x${EXPECTED_HEIGHT} px)`);
      return { status: 'skipped', filename };
    }

    console.log(`🖼️  ${filename}`);
    console.log(`   Original: ${metadata.width}x${metadata.height} px`);

    // Resize to 1200x630 px
    await sharp(inputPath)
      .resize(EXPECTED_WIDTH, EXPECTED_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 90 })
      .toFile(outputPath);

    const originalSize = statSync(inputPath).size;
    const newSize = statSync(outputPath).size;

    console.log(`   ✅ Preview created: ${outputFilename}`);
    console.log(`   Size: ${(originalSize / 1024).toFixed(2)} KB → ${(newSize / 1024).toFixed(2)} KB\n`);

    return { status: 'converted', filename, outputFilename };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    return { status: 'failed', filename, error: error.message };
  }
}

async function main() {
  const imagesDir = join(__dirname, '..', 'public', 'images');
  const files = await readdir(imagesDir);
  const ogImages = files.filter(f =>
    f.startsWith('og-') &&
    f.endsWith('.webp') &&
    !f.includes('-resized')
  );

  console.log(`🔄 Creating preview resized versions of ${ogImages.length} OG images...\n`);
  console.log(`Target size: ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT} px\n`);

  const results = {
    converted: [],
    skipped: [],
    failed: []
  };

  for (const file of ogImages.sort()) {
    const result = await previewResize(file);
    results[result.status].push(result);
  }

  console.log(`\n📊 Preview Summary:`);
  console.log(`   ✅ Converted: ${results.converted.length}`);
  console.log(`   ⏭️  Skipped (already correct): ${results.skipped.length}`);
  console.log(`   ❌ Failed: ${results.failed.length}`);

  if (results.converted.length > 0) {
    console.log(`\n📁 Preview files created in public/images/:`);
    results.converted.forEach(r => {
      console.log(`   - ${r.outputFilename}`);
    });

    console.log(`\n🔍 Next steps:`);
    console.log(`   1. Check the -resized.webp files in public/images/`);
    console.log(`   2. If they look good, run the apply script:`);
    console.log(`      node scripts/apply-og-resize.mjs`);
    console.log(`   3. Or resize all at once (replaces originals):`);
    console.log(`      node scripts/resize-og-image.mjs --all`);
  }

  if (results.failed.length > 0) {
    console.log(`\n⚠️  Failed conversions:`);
    results.failed.forEach(r => {
      console.log(`   - ${r.filename}: ${r.error}`);
    });
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
