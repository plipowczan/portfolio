#!/usr/bin/env node

/**
 * Build with Prerender
 *
 * Kompletny skrypt który:
 * 1. Buduje aplikację (vite build)
 * 2. Uruchamia preview server
 * 3. Wykonuje prerendering wszystkich stron
 * 4. Zamyka preview server
 */

import { spawn } from "child_process";
import { setTimeout } from "timers/promises";

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
    });

    let output = "";

    // Timeout jeśli server nie uruchomi się w 30 sekund
    const timeoutId = setTimeout(() => {
      if (!output.includes("Local:") && !output.includes("4173")) {
        reject(new Error("Preview server nie uruchomił się w czasie"));
      }
    }, 30000);

    server.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(`[Preview Output Raw]: ${JSON.stringify(chunk)}`); // Debug raw
      // Czekaj aż server będzie gotowy
      if (output.includes("Local:") || output.includes("4173")) {
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

  try {
    // Krok 1: Build aplikacji
    console.log("📦 Krok 1/3: Budowanie aplikacji...\n");
    await runCommand("npm", ["run", "build"]);
    console.log("\n✅ Build zakończony!\n");

    // Krok 2: Uruchom preview server
    console.log("📦 Krok 2/3: Uruchamianie preview server...\n");
    previewServer = await startPreviewServer();

    // Dodatkowy czas na stabilizację servera
    await setTimeout(2000);

    // Krok 3: Prerendering
    console.log("📦 Krok 3/3: Prerendering stron...\n");
    await runCommand("node", ["scripts/prerender.mjs"]);

    console.log("\n🎉 SUKCES! Build z prerenderingiem zakończony.\n");
    console.log("📂 Pliki gotowe do deployu w folderze: dist/\n");
  } catch (error) {
    console.error("\n❌ BŁĄD:", error.message);
    process.exit(1);
  } finally {
    // Zawsze zamknij preview server
    if (previewServer) {
      console.log("🛑 Zamykam preview server...\n");
      previewServer.kill();
    }
  }
}

// Uruchom
main().catch((error) => {
  console.error("Nieoczekiwany błąd:", error);
  process.exit(1);
});
