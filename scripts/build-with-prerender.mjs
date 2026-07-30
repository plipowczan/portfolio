#!/usr/bin/env node

/**
 * Build with Prerender
 *
 * Kompletny skrypt który:
 * 1. Buduje aplikację (vite build)
 * 2. Uruchamia preview server
 * 3. Wykonuje prerendering wszystkich stron
 * 4. Sprawdza, czy wyjście prerenderu jest kompletne
 * 5. Zamyka preview server
 */

import { spawn, spawnSync } from "child_process";
import { setTimeout as sleep } from "timers/promises";
import { PREVIEW_PORT } from "./ports.mjs";
import { verifyPrerenderOutput } from "./verify-prerender-output.mjs";

/**
 * Ubija cały proces potomny wraz z drzewem dzieci.
 *
 * `npm run preview` spawnuje się przez shell (cmd.exe na Windows), więc
 * `child.pid` to PID shella — jego wnukiem jest właściwy `vite preview`.
 * `process.kill(pid)` ubiłby tylko shell, zostawiając zombie na porcie
 * preview, który blokuje `dist/` (ENOTEMPTY) i wisi przy kolejnych buildach.
 */
function killProcessTree(pid) {
  if (!pid) return;
  if (process.platform === "win32") {
    // /T = drzewo, /F = force. Ignoruj kod wyjścia (proces mógł już zniknąć).
    spawnSync("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    // Grupa procesów (wymaga detached: true przy spawnie) → potem sam proces.
    try {
      process.kill(-pid, "SIGTERM");
    } catch {
      try {
        process.kill(pid, "SIGTERM");
      } catch {
        /* już nie istnieje */
      }
    }
  }
}

console.log("🏗️  Rozpoczynam build z prerenderingiem...\n");

/**
 * Uruchamia komendę i czeka na jej zakończenie
 */
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`▶️  Uruchamiam: ${command} ${args.join(" ")}\n`);

    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
      ...options,
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Komenda zakończyła się z kodem: ${code}`));
      } else {
        resolve();
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Uruchamia preview server w tle
 */
function startPreviewServer() {
  return new Promise((resolve, reject) => {
    console.log("🌐 Uruchamiam preview server...\n");

    const server = spawn("npm", ["run", "preview"], {
      stdio: "pipe",
      shell: true,
      // POSIX: własna grupa procesów, żeby killProcessTree mógł ubić grupę
      // przez `-pid`. Na Windows drzewo ubija `taskkill /T`.
      detached: process.platform !== "win32",
    });

    let output = "";

    // Port jest pochodną katalogu roboczego (scripts/ports.mjs), więc marker
    // gotowości też musi być wyliczony, nie wpisany na sztywno.
    const readyMarker = String(PREVIEW_PORT);
    const isReady = () =>
      output.includes("Local:") || output.includes(readyMarker);

    // Timeout jeśli server nie uruchomi się w 30 sekund
    const timeoutId = setTimeout(() => {
      if (!isReady()) {
        reject(new Error("Preview server nie uruchomił się w czasie"));
      }
    }, 30000);

    server.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(`[Preview Output Raw]: ${JSON.stringify(chunk)}`); // Debug raw
      // Czekaj aż server będzie gotowy
      if (isReady()) {
        clearTimeout(timeoutId);
        console.log("✅ Preview server gotowy!\n");
        resolve(server);
      }
    });

    server.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    server.on("error", (error) => {
      clearTimeout(timeoutId);
      reject(error);
    });
  });
}

/**
 * Główna funkcja
 */
async function main() {
  let previewServer = null;
  let exitCode = 0;

  try {
    // Krok 0: Generowanie sitemap
    console.log("📦 Krok 1/6: Generowanie sitemap.xml...\n");
    await runCommand("node", ["scripts/update-sitemap.js"]);

    // Krok 0.5: Generowanie llms.txt / llms-full.txt
    console.log("📦 Krok 2/6: Generowanie llms.txt...\n");
    await runCommand("node", ["scripts/generate-llms-txt.js"]);

    // Krok 1: Build aplikacji
    console.log("📦 Krok 3/6: Budowanie aplikacji...\n");
    await runCommand("npm", ["run", "build"]);
    console.log("\n✅ Build zakończony!\n");

    // Krok 2: Uruchom preview server
    console.log("📦 Krok 4/6: Uruchamianie preview server...\n");
    previewServer = await startPreviewServer();

    // Dodatkowy czas na stabilizację servera (dłuższy na Vercel)
    const stabilizationTime = process.env.VERCEL === "1" ? 5000 : 2000;
    console.log(`⏳ Czekam ${stabilizationTime}ms na stabilizację serwera...\n`);
    await sleep(stabilizationTime);

    // Krok 3: Prerendering
    console.log("📦 Krok 5/6: Prerendering stron...\n");
    await runCommand("node", ["scripts/prerender.mjs"]);

    // Krok 4: Sprawdzenie wyniku. Prerender melduje błąd tylko dla tras, o
    // które go poproszono — tu wychodzą te, których na liście nie było, i
    // strony bez metadanych. Bramka działa też na Vercelu, bo to jego
    // `buildCommand`.
    console.log("📦 Krok 6/6: Sprawdzanie wyniku prerenderu...\n");
    verifyPrerenderOutput();

    console.log("\n🎉 SUKCES! Build z prerenderingiem zakończony.\n");
    console.log("📂 Pliki gotowe do deployu w folderze: dist/\n");
  } catch (error) {
    console.error("\n❌ BŁĄD:", error.message);
    exitCode = 1;
  } finally {
    // Zawsze zamknij preview server — całe drzewo, nie tylko shell.
    if (previewServer) {
      console.log("🛑 Zamykam preview server...\n");
      killProcessTree(previewServer.pid);
    }
  }

  // Wymuś wyjście: piped stdio wnuka (vite preview) potrafi trzymać event loop
  // przy życiu nawet po ubiciu drzewa, przez co proces wisiał bez tego exita.
  process.exit(exitCode);
}

// Uruchom
main().catch((error) => {
  console.error("Nieoczekiwany błąd:", error);
  process.exit(1);
});
