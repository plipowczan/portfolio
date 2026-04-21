#!/usr/bin/env node
/**
 * Generates public/logo-schema.png (600x60) from logo.svg + text.
 * Used for BlogPosting.publisher.logo in JSON-LD (Google requires raster).
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const width = 600;
const height = 60;
const bg = "#0a0a0a";
const accent = "#00ff9d";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}"/>
  <g transform="translate(10, 5) scale(0.25)">
    <circle cx="100" cy="100" r="85" stroke="${accent}" stroke-width="8" stroke-dasharray="10 5" fill="none"/>
    <path d="M 70 70 L 50 100 L 70 130" stroke="${accent}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M 130 70 L 150 100 L 130 130" stroke="${accent}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M 110 70 L 90 130" stroke="${accent}" stroke-width="10" stroke-linecap="round"/>
  </g>
  <text x="75" y="39" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#ffffff">Pawel Lipowczan</text>
</svg>
`;

const outPath = path.join(root, "public", "logo-schema.png");

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`Wrote ${outPath} (${width}x${height})`);
