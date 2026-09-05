import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { contentGenerator } from "./scripts/generate-content.mjs";
import { DEV_PORT, PREVIEW_PORT } from "./scripts/ports.mjs";

/**
 * Injects the `<link rel="preload">` for the body font.
 *
 * The font lives under src/ so Vite fingerprints it, which means its final
 * filename is only known once the bundle exists — it cannot be hardcoded in
 * index.html. This looks the emitted asset up instead, and falls back to the
 * source path during `vite dev`, where nothing is hashed.
 *
 * Only the `latin` subset is preloaded. `latin-ext` (the Polish diacritics) is
 * another ~83kB and goes unused on the English routes, so it is left to load on
 * demand via its unicode-range.
 */
const preloadBodyFont = () => ({
  name: "preload-body-font",
  transformIndexHtml: {
    order: "post",
    handler(_html, ctx) {
      // The lookahead matters: `inter-latin-ext-<hash>.woff2` also starts with
      // `inter-latin-`, and preloading it would pull the 83kB diacritics subset
      // on every route instead of the 47kB one we actually want everywhere.
      const emitted = Object.keys(ctx.bundle ?? {}).find((f) =>
        /inter-latin-(?!ext-)[^/]*\.woff2$/.test(f),
      );
      const href = emitted
        ? `/${emitted}`
        : "/src/assets/fonts/inter-latin.woff2";

      return [
        {
          tag: "link",
          // `crossorigin` is required even same-origin: fonts are always
          // fetched in CORS mode, and without it the preload is discarded and
          // the file downloaded a second time.
          attrs: { rel: "preload", href, as: "font", type: "font/woff2", crossorigin: "" },
          injectTo: "head-prepend",
        },
      ];
    },
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "public",
  plugins: [
    // Musi być przed `react()`: aplikacja importuje `src/data/generated/`,
    // które ten plugin dopiero zapisuje w `buildStart`.
    contentGenerator(),
    react(),
    preloadBodyFont(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  // Ports come from scripts/ports.mjs so every worktree gets its own pair —
  // see that file for why. `strictPort` on both: a taken port must fail the
  // run, not silently move it somewhere the tests are not looking.
  preview: {
    port: PREVIEW_PORT,
    strictPort: true,
  },
  server: {
    port: DEV_PORT,
    strictPort: true,
    open: process.env.NODE_ENV !== "production",
    fs: {
      // Allow serving files with UTF-8 encoding
      strict: false,
    },
    watch: {
      // Katalogi buildu muszą być poza obserwacją. Podczas `npm test` serwer
      // deweloperski i build testowy startują równolegle, a watcher trafia na
      // plik, do którego build jeszcze pisze - EBUSY na kilkumegabajtowym .mp4
      // wywraca cały serwer, a z nim wszystkie testy na porcie dev.
      //
      // Lista jest jawna, razem z pozycjami, które Vite pomija domyślnie:
      // `ignored` od użytkownika trafia wprost do chokidara, więc poleganie na
      // scaleniu z domyślnymi znaczyłoby, że watcher bierze się za
      // `node_modules/` i prerenderowany `dist/` (98 katalogów tras + wideo).
      // Tyle plików wystarczyło, żeby serwer dev przestał wyrabiać pod
      // równoległymi testami.
      ignored: [
        "**/node_modules/**",
        "**/.git/**",
        "**/dist/**",
        "**/dist-test/**",
        "**/playwright-report/**",
        "**/test-results/**",
      ],
    },
  },
  // Ensure proper charset handling
  build: {
    charset: "utf8",
    // Manifest jest wejściem dla bramki rozmiaru
    // (`scripts/check-payload-budget.mjs`): mówi wprost, który chunk jest
    // wejściowy i co importuje statycznie. Czytanie tego z `index.html` byłoby
    // zawodne — pomocnik preloadu Vite dokłada `modulepreload` w trakcie
    // działania strony, więc prerender zapisałby też chunki tras leniwych.
    manifest: true,
    rollupOptions: {
      output: {
        // Trzy duże paczki wydzielone jawnie. `react-markdown` z remarkiem i
        // rehypem wchodzi tylko na artykuł i lekcję, więc bez tego podziału
        // doklejałby się do chunka trasy i pobierał się dwa razy — raz dla
        // bloga, raz dla kursu. Ikony i `framer-motion` wydzielone dla cache'u:
        // zmiana kodu strony nie unieważnia wtedy wersji przeglądarki.
        manualChunks: {
          "vendor-motion": ["framer-motion"],
          "vendor-markdown": ["react-markdown", "remark-gfm", "rehype-raw"],
          "vendor-icons": ["react-icons/fa"],
        },
      },
    },
  },
});
