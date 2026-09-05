/**
 * Bramka rozmiaru JavaScriptu strony głównej.
 *
 * Mierzy to, co przeglądarka musi ściągnąć, zanim strona główna się wyrenderuje:
 * chunk wejściowy plus wszystko, co on importuje statycznie — spakowane gzipem,
 * bo tak leci po sieci. Chunki tras leniwych są poza pomiarem świadomie: liczenie
 * ich karałoby dokładnie ten podział kodu, który ta zmiana wprowadza.
 *
 * `Home` zostaje przy statycznym imporcie w `src/App.jsx` właśnie po to, żeby ten
 * pomiar był uczciwy — trasa, o którą chodzi, jest w chunku wejściowym.
 *
 * Bramka siedzi w buildzie, nie w teście Playwrighta, bo `vercel.json` ustawia
 * `buildCommand: "npm run build:prerender"` — działa więc na każdym wdrożeniu,
 * bez minuty CI. To ta sama reguła, którą stosuje
 * `scripts/verify-prerender-output.mjs`: twierdzenie o zawartości `dist/` należy
 * do buildu.
 *
 * Da się uruchomić osobno, po zwykłym `npm run build`:
 *   node scripts/check-payload-budget.mjs
 */

import { existsSync, readFileSync } from "fs";
import { gzipSync } from "zlib";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DIST = join(HERE, "..", "dist");

/**
 * Pułap w bajtach po gzipie. **Jedyne miejsce, w którym się go zmienia.**
 *
 * Ustawiony na pomiar z chwili wprowadzenia bramki (205 467 B ≈ 200,7 kB) plus
 * ~15 % zapasu. Podniesienie tej liczby ma być widoczne w diffie — o to chodzi:
 * uzasadniona nowa zależność wymaga świadomej decyzji, a nie cichego dryfu.
 *
 * Dla porównania: przed zmianą strona główna ciągnęła jeden chunk ważący
 * 778,71 kB po gzipie.
 */
export const INITIAL_JS_BUDGET_GZIP_BYTES = 236_000;

/** Bajty po gzipie dla pliku w `dist/`. */
function gzipSize(file) {
  return gzipSync(readFileSync(file)).length;
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

/**
 * Chunk wejściowy plus domknięcie jego statycznych importów.
 *
 * Źródłem jest manifest Vite (`build.manifest`), a nie `index.html`: pomocnik
 * preloadu Vite dokłada `modulepreload` w trakcie działania strony, więc
 * prerenderowany HTML zawiera też chunki tras leniwych.
 *
 * @param {string} [distDir]
 * @returns {{ files: { file: string, gzip: number }[], totalGzip: number }}
 */
export function measureInitialPayload(distDir = DEFAULT_DIST) {
  const manifestPath = join(distDir, ".vite", "manifest.json");
  if (!existsSync(manifestPath)) {
    throw new Error(
      `Brak ${manifestPath} — bramka rozmiaru potrzebuje manifestu Vite (build.manifest w vite.config.js)`,
    );
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  const entryKey = Object.keys(manifest).find((key) => manifest[key].isEntry);
  if (!entryKey) {
    throw new Error(`W ${manifestPath} nie ma wpisu wejściowego (isEntry)`);
  }

  const seen = new Set();
  const files = [];

  const collect = (key) => {
    if (seen.has(key)) return;
    seen.add(key);

    const chunk = manifest[key];
    if (!chunk) {
      throw new Error(`Manifest odwołuje się do nieznanego chunka: ${key}`);
    }

    const file = join(distDir, chunk.file);
    if (!existsSync(file)) {
      throw new Error(`Manifest wskazuje na nieistniejący plik: ${file}`);
    }

    files.push({ file: chunk.file, gzip: gzipSize(file) });

    // Tylko statyczne. `dynamicImports` to trasy leniwe — poza pomiarem.
    for (const imported of chunk.imports ?? []) {
      collect(imported);
    }
  };

  collect(entryKey);

  return {
    files,
    totalGzip: files.reduce((sum, item) => sum + item.gzip, 0),
  };
}

/**
 * Wypisuje pomiar i rzuca wyjątkiem po przekroczeniu pułapu.
 *
 * Pomiar i pułap idą na wyjście w obu przypadkach — bramka, która milczy przy
 * zaliczeniu, nie mówi nikomu, ile zapasu zostało.
 *
 * @param {string} [distDir]
 */
export function verifyPayloadBudget(distDir = DEFAULT_DIST) {
  const { files, totalGzip } = measureInitialPayload(distDir);
  const ceiling = INITIAL_JS_BUDGET_GZIP_BYTES;
  const share = ((totalGzip / ceiling) * 100).toFixed(0);

  if (totalGzip > ceiling) {
    console.error("\n❌ Pierwszy ładunek JS strony głównej przekracza pułap:\n");
    for (const item of files) {
      console.error(`   • ${item.file} — ${kb(item.gzip)}`);
    }
    console.error("");
    throw new Error(
      `Pierwszy ładunek JS: ${kb(totalGzip)} po gzipie, pułap ${kb(ceiling)} ` +
        `(${share} %). Pułap to INITIAL_JS_BUDGET_GZIP_BYTES w scripts/check-payload-budget.mjs.`,
    );
  }

  console.log(
    `\n✅ Pierwszy ładunek JS strony głównej: ${kb(totalGzip)} po gzipie, ` +
      `pułap ${kb(ceiling)} (${share} %).`,
  );
  for (const item of files) {
    console.log(`   • ${item.file} — ${kb(item.gzip)}`);
  }
  console.log("");
}

// Uruchomienie bezpośrednie: `node scripts/check-payload-budget.mjs`
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    verifyPayloadBudget(process.argv[2]);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
