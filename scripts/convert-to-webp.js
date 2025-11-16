import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Konwertuje pojedynczy plik PNG na WebP
 * @param {string} inputPath - Ścieżka do pliku PNG
 * @param {number} quality - Jakość WebP (0-100), domyślnie 85
 */
async function convertToWebP(inputPath, quality = 85) {
  const outputPath = inputPath.replace('.png', '.webp');
  
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Plik nie istnieje: ${inputPath}`);
    return null;
  }
  
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);
    
    const pngSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((1 - webpSize / pngSize) * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)}`);
    console.log(`   PNG:  ${(pngSize / 1024).toFixed(1)} KB`);
    console.log(`   WebP: ${(webpSize / 1024).toFixed(1)} KB`);
    console.log(`   Oszczędność: ${savings}%\n`);
    
    return outputPath;
  } catch (error) {
    console.error(`❌ Błąd przy konwersji ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Konwertuje wszystkie pliki PNG w folderze
 * @param {string} folderPath - Ścieżka do folderu z obrazami
 */
async function convertAllInFolder(folderPath) {
  console.log('🔄 Rozpoczynam konwersję PNG → WebP...\n');
  
  const files = fs.readdirSync(folderPath)
    .filter(file => file.endsWith('.png'));
  
  if (files.length === 0) {
    console.log('⚠️  Nie znaleziono plików PNG do konwersji.');
    return;
  }
  
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    await convertToWebP(filePath);
  }
  
  console.log('✨ Konwersja zakończona!');
}

// CLI usage
const args = process.argv.slice(2);

if (args.length === 0) {
  // Domyślnie konwertuj wszystkie obrazy w public/images
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  convertAllInFolder(imagesDir).catch(console.error);
} else if (args[0] === '--help' || args[0] === '-h') {
  console.log(`
Skrypt konwersji PNG → WebP

Użycie:
  node scripts/convert-to-webp.js                    # Konwertuje wszystkie PNG w public/images
  node scripts/convert-to-webp.js <ścieżka>          # Konwertuje pojedynczy plik lub folder
  node scripts/convert-to-webp.js --help             # Wyświetla pomoc

Przykłady:
  node scripts/convert-to-webp.js public/images/og-home.png
  node scripts/convert-to-webp.js public/images
`);
} else {
  const targetPath = path.resolve(args[0]);
  
  if (fs.existsSync(targetPath)) {
    const stats = fs.statSync(targetPath);
    
    if (stats.isDirectory()) {
      convertAllInFolder(targetPath).catch(console.error);
    } else if (targetPath.endsWith('.png')) {
      convertToWebP(targetPath).catch(console.error);
    } else {
      console.log('❌ Plik musi mieć rozszerzenie .png');
    }
  } else {
    console.log('❌ Podana ścieżka nie istnieje:', targetPath);
  }
}

export { convertToWebP, convertAllInFolder };

