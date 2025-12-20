#!/usr/bin/env node

/**
 * Resize OG image(s) to 1200x630 px (standard OG image size)
 *
 * Usage:
 *   node scripts/resize-og-image.mjs <image-filename>
 *   node scripts/resize-og-image.mjs --all
 *
 * Examples:
 *   node scripts/resize-og-image.mjs og-blog.webp
 *   node scripts/resize-og-image.mjs --all
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, rename } from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 630;

async function resizeSingleImage(filename) {
  const inputPath = join(__dirname, '..', 'public', 'images', filename);
  const tempPath = join(__dirname, '..', 'public', 'images', `${filename}.tmp`);

  if (!existsSync(inputPath)) {
    console.error(`❌ File not found: ${filename}`);
    return false;
  }

  try {
    // Get original dimensions
    const metadata = await sharp(inputPath).metadata();

    // Skip if already correct size
    if (metadata.width === EXPECTED_WIDTH && metadata.height === EXPECTED_HEIGHT) {
      console.log(`⏭️  ${filename} - already correct size (${EXPECTED_WIDTH}x${EXPECTED_HEIGHT} px)`);
      return true;
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
      .toFile(tempPath);

    // Replace original with resized
    await rename(tempPath, inputPath);

    const fs = await import('fs');
    const newSize = fs.statSync(inputPath).size;
    console.log(`   ✅ Resized: ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT} px | ${(newSize / 1024).toFixed(2)} KB\n`);

    return true;
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}\n`);
    return false;
  }
}

async function resizeAllImages() {
  const imagesDir = join(__dirname, '..', 'public', 'images');
  const files = await readdir(imagesDir);
  const ogImages = files.filter(f => f.startsWith('og-') && f.endsWith('.webp'));

  console.log(`🔄 Resizing ${ogImages.length} OG images to ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT} px...\n`);

  let successCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const file of ogImages.sort()) {
    const result = await resizeSingleImage(file);
    if (result === true) {
      successCount++;
    } else if (result === 'skipped') {
      skippedCount++;
    } else {
      failedCount++;
    }
  }

  console.log(`📊 Summary:`);
  console.log(`   ✅ Resized: ${successCount}`);
  console.log(`   ⏭️  Skipped (already correct): ${skippedCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log('Usage:');
    console.log('  node scripts/resize-og-image.mjs <image-filename>');
    console.log('  node scripts/resize-og-image.mjs --all');
    console.log('\nExamples:');
    console.log('  node scripts/resize-og-image.mjs og-blog.webp');
    console.log('  node scripts/resize-og-image.mjs --all');
    process.exit(0);
  }

  if (args[0] === '--all') {
    await resizeAllImages();
  } else {
    await resizeSingleImage(args[0]);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
