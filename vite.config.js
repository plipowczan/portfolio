import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: "public",
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
  ],
  server: {
    port: 3000,
    open: process.env.NODE_ENV !== "production",
    fs: {
      // Allow serving files with UTF-8 encoding
      strict: false,
    },
    watch: {
      // Katalogi buildu muszą być poza obserwacją. Podczas `npm test` serwer
      // deweloperski i build testowy startują równolegle, a watcher trafia na
      // plik, do którego build jeszcze pisze - EBUSY na kilkumegabajtowym .mp4
      // wywraca cały serwer, a z nim wszystkie testy na porcie 3000.
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
  },
});
