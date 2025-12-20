#!/usr/bin/env node

/**
 * Apply resized OG images - replaces originals with -resized versions
 *
 * Usage:
 *   node scripts/apply-og-resize.mjs
 */

import { readdir, rename, unlink } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function applyResizedImages() {
  const imagesDir = join(__dirname, '..', 'public', 'images');
  const files = await readdir(imagesDir);
  const resizedFiles = files.filter(f => f.endsWith('-resized.webp'));

  if (resizedFiles.length === 0) {
    console.log('❌ No -resized.webp files found!');
    console.log('   Run first: node scripts/resize-og-images-preview.mjs');
    process.exit(1);
  }

  console.log(`🔄 Applying ${resizedFiles.length} resized images...\n`);

  let successCount = 0;
  let failedCount = 0;

  for (const resizedFile of resizedFiles.sort()) {
    const originalFile = resizedFile.replace('-resized.webp', '.webp');
    const resizedPath = join(imagesDir, resizedFile);
    const originalPath = join(imagesDir, originalFile);

    try {
      console.log(`🔄 ${originalFile}`);

      // Check if original exists
      if (!existsSync(originalPath)) {
        console.log(`   ⚠️  Original not found, renaming resized version`);
        await rename(resizedPath, originalPath);
      } else {
        // Replace original with resized
        await unlink(originalPath);
        await rename(resizedPath, originalPath);
        console.log(`   ✅ Replaced with resized version`);
      }

      successCount++;
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      failedCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Applied: ${successCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);

  if (successCount > 0) {
    console.log(`\n🎉 All OG images are now 1200x630 px!`);
    console.log(`\n🔍 Verify with: node scripts/check-og-images.mjs`);
  }
}

async function main() {
  console.log('⚠️  This will replace original images with resized versions.');
  console.log('    Make sure you\'ve checked the -resized.webp files first!\n');

  await applyResizedImages();
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
