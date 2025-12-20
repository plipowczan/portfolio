#!/usr/bin/env node

/**
 * Check all OG images dimensions and verify they match SEO standards (1200x630 px)
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imagesDir = join(__dirname, '..', 'public', 'images');
const EXPECTED_WIDTH = 1200;
const EXPECTED_HEIGHT = 630;

async function checkOGImages() {
  try {
    console.log('🔍 Checking OG images...\n');

    const files = await readdir(imagesDir);
    const ogImages = files.filter(f => f.startsWith('og-') && f.endsWith('.webp'));

    console.log(`Found ${ogImages.length} OG images\n`);

    let correctCount = 0;
    let incorrectCount = 0;

    for (const file of ogImages.sort()) {
      const filePath = join(imagesDir, file);
      const metadata = await sharp(filePath).metadata();
      const fileStats = await stat(filePath);
      const fileSizeKB = (fileStats.size / 1024).toFixed(2);

      const isCorrectSize = metadata.width === EXPECTED_WIDTH && metadata.height === EXPECTED_HEIGHT;
      const status = isCorrectSize ? '✅' : '❌';

      if (isCorrectSize) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      console.log(
        `${status} ${file.padEnd(50)} ${metadata.width}x${metadata.height} px | ${fileSizeKB} KB`
      );
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Correct (1200x630): ${correctCount}`);
    console.log(`   ❌ Incorrect: ${incorrectCount}`);

    if (incorrectCount > 0) {
      console.log(`\n⚠️  Some images need to be resized to 1200x630 px`);
      console.log(`   Use: node scripts/resize-og-image.mjs <image-path>`);
    } else {
      console.log(`\n🎉 All OG images have correct dimensions!`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkOGImages();
