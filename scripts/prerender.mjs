#!/usr/bin/env node

/**
 * Prerender Script
 *
 * Generuje statyczne HTML dla wszystkich stron portfolio,
 * aby poprawić SEO poprzez dostarczenie pełnej treści dla botów.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import matter from "gray-matter";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dokumentacja mieszkająca w folderach z treścią. To pliki `.md`, więc
// readdir je łapie, a bez frontmattera wygenerowałyby fałszywe trasy.
// `README.md` to przewodnik po polsku, `AGENTS.md` to kontrakt DOX dla
// agentów, `CLAUDE.md` to jego shim.
const DOC_FILES = new Set(["README.md", "AGENTS.md", "CLAUDE.md"]);

// Funkcja do wczytywania postów bezpośrednio z plików markdown
function getBlogPosts(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const files = readdirSync(dir).filter(
    (file) =>
      file.endsWith(".md") &&
      !file.endsWith("_wsad.md") &&
      !file.startsWith("_") &&
      !DOC_FILES.has(file)
  );

  return files.map((file) => {
    const filePath = join(dir, file);
    const content = readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    return {
      slug: data.slug,
      id: data.id,
    };
  });
}

import { projects } from "../src/data/projects.js";
// Lista lekcji mieszka w scripts/course-lessons.mjs, bo czyta ją też
// sprawdzenie wyniku prerenderu — obie strony muszą widzieć ten sam katalog.
import { COURSE_CONTENT_DIR, getCourseLessons } from "./course-lessons.mjs";
import { PREVIEW_URL } from "./ports.mjs";
import { PRERENDER_READY_ATTR } from "../src/utils/prerenderMarker.js";

const blogPostsPl = getBlogPosts(join(__dirname, "..", "src", "content", "blog"));
const blogPostsEn = getBlogPosts(join(__dirname, "..", "src", "content", "blog", "en"));
const courseLessons = getCourseLessons(COURSE_CONTENT_DIR);

// Konfiguracja
const BASE_URL = PREVIEW_URL; // patrz scripts/ports.mjs — port per worktree
const DIST_DIR = join(__dirname, "..", "dist");

// Wykrywanie środowiska Vercel
const IS_VERCEL = process.env.VERCEL === "1";

// PL routes (unchanged)
const staticRoutesPl = [
  "/",
  "/blog",
  "/privacy-policy",
  "/terms-of-service",
  "/cookie-policy",
];

const blogRoutesPl = blogPostsPl.map((post) => `/blog/${post.slug}`);
const projectRoutesPl = projects.map((project) => `/projects/${project.slug}`);

// PL-only waitlist landing — intentionally NOT mirrored to /en (PL-only page)
const landingRoutes = ["/llm-wiki"];

// PL-only free course — hub + one route per lesson (derived from files),
// intentionally NOT mirrored to /en (see StripEnRedirect).
const courseRoutes = [
  "/llm-wiki/kurs",
  ...courseLessons.map((lesson) => `/llm-wiki/kurs/${lesson.slug}`),
];

// EN routes (under /en/ prefix)
const staticRoutesEn = staticRoutesPl.map((route) => `/en${route}`);
const blogRoutesEn = blogPostsEn.map((post) => `/en/blog/${post.slug}`);
const projectRoutesEn = projects.map((project) => `/en/projects/${project.slug}`);

const allRoutes = [
  ...staticRoutesPl,
  ...landingRoutes,
  ...courseRoutes,
  ...blogRoutesPl,
  ...projectRoutesPl,
  ...staticRoutesEn,
  ...blogRoutesEn,
  ...projectRoutesEn,
];

// Trasy, których treść przychodzi osobnym chunkiem (`import()` w
// `useContentBody`). Tylko na nich czekamy na znacznik gotowości — hub kursu i
// listing bloga renderują się z indeksu, synchronicznie.
const CONTENT_ROUTES = new Set([
  ...blogRoutesPl,
  ...blogRoutesEn,
  ...courseRoutes.filter((route) => route !== "/llm-wiki/kurs"),
]);

/**
 * Prerenderuje pojedynczą stronę z retry logic
 */
async function prerenderPage(browser, route, retries = 2) {
  const page = await browser.newPage();
  let pageClosed = false;

  try {
    const url = `${BASE_URL}${route}`;
    console.log(`  📄 Renderuję: ${route}`);

    if (IS_VERCEL) {
      // Puppeteer setup
      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36"
      );
    }

    // Dla Vercel używamy dłuższego timeoutu i mniej restrykcyjnego waitUntil
    const timeout = IS_VERCEL ? 120000 : 60000; // 120s na Vercel, 60s lokalnie
    // Używamy 'load' zamiast 'networkidle0' - szybsze i bardziej niezawodne na Vercel
    // 'load' czeka na załadowanie wszystkich zasobów, ale nie wymaga 500ms bez requestów
    const waitUntil = IS_VERCEL ? "load" : "networkidle0";

    // Otwórz stronę i poczekaj na pełne załadowanie
    await page.goto(url, {
      waitUntil: waitUntil,
      timeout: timeout,
    });

    // Czekaj na hoistowanie metadanych przez React 19 - metatagi muszą
    // NALEŻEĆ DO TEJ TRASY.
    //
    // Sama obecność og:title i description nie wystarcza. Wdrożenie z 29.07.2026
    // wypuściło /privacy-policy, /terms-of-service i /llm-wiki z poprawnym
    // <body>, ale z <head> strony głównej (canonical "/", tytuł domyślny) -
    // bramka sprawdzająca tylko istnienie tagów przepuściła to bez śladu w
    // logach. Ten sam build lokalnie wychodził poprawnie, więc rzecz jest
    // niedeterministyczna i tym bardziej potrzebuje twardego warunku.
    //
    // Canonical jest tu jedynym wiarygodnym świadkiem: to jedyny tag, który
    // musi się różnić między trasami i który znamy z góry.
    // Porównujemy z `location.pathname`, nie z `route`: strona w trakcie
    // prerenderu jest pod swoim adresem, więc nie trzeba nic przekazywać do
    // kontekstu strony, a trasy z przekierowaniem po stronie klienta
    // (np. /en/llm-wiki/kurs → /llm-wiki/kurs) porównują się z adresem, na
    // którym faktycznie wylądowały.
    try {
      await page.waitForFunction(
        () => {
          const canonical = document.querySelector('link[rel="canonical"]');
          const description = document.querySelector(
            'meta[name="description"]'
          );
          const ogTitle = document.querySelector('meta[property="og:title"]');
          if (!canonical || !description || !ogTitle) return false;
          const trim = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
          return (
            trim(new URL(canonical.href).pathname) ===
            trim(window.location.pathname)
          );
        },
        { timeout: 20000 } // Zwiększony timeout dla metatagów
      );
    } catch (e) {
      const actual = await page
        .evaluate(() => {
          const c = document.querySelector('link[rel="canonical"]');
          const t = document.querySelector("title");
          return {
            canonical: c?.href ?? null,
            title: t?.textContent ?? null,
            at: window.location.pathname,
          };
        })
        .catch(() => ({ canonical: null, title: null, at: null }));

      // Świadomie twardy błąd zamiast ostrzeżenia: strona z cudzymi
      // metadanymi jest gorsza niż brak strony, bo wygląda na poprawną.
      // failCount kończy build kodem 1, więc nic takiego nie trafi na produkcję.
      const problem = new Error(
        `Metadane nie należą do trasy ${route} ` +
          `(jestem na: ${actual.at ?? "?"}, canonical: ${actual.canonical ?? "brak"}, ` +
          `title: ${actual.title ?? "brak"})`
      );
      problem.retryable = true;
      throw problem;
    }

    // Treść artykułu i lekcji przychodzi osobnym chunkiem, więc jest za
    // granicą asynchroniczną. Zrzut zrobiony przed jej rozwiązaniem zapisałby
    // stronę z tytułem i metadanymi, ale bez tekstu — poprawną w przeglądarce
    // i pustą dla robotów. Czekamy na jawny znacznik, nie na ciszę w sieci:
    // cisza nie odróżnia „doszedł chunk z treścią" od „doszedł beacon
    // analityki".
    if (CONTENT_ROUTES.has(route)) {
      try {
        // Uwaga na sygnatury: Playwright czyta drugi argument jako `arg`,
        // Puppeteer jako opcje. Ten sam kompromis co przy oczekiwaniu na
        // metadane wyżej — lokalnie działa domyślny timeout Playwrighta, na
        // Vercelu podana wartość. Obie kończą się błędem, nie zawieszeniem.
        await page.waitForFunction(
          `document.documentElement.hasAttribute(${JSON.stringify(PRERENDER_READY_ATTR)})`,
          { timeout: 20000 },
        );
      } catch {
        // Twardy błąd: pusty artykuł wygląda na poprawny i niczego nie zgłasza.
        // failCount kończy build kodem 1, więc taka strona nie trafi do dist/.
        const problem = new Error(
          `Treść nie doszła dla trasy ${route} — brak znacznika ` +
            `${PRERENDER_READY_ATTR} na <html>, strona wyszłaby bez tekstu`,
        );
        problem.retryable = true;
        throw problem;
      }
    }

    // Przejazd scrollem przed zrzutem.
    //
    // Sekcje strony głównej (`#about`, `#skills`, `#projects`, `#testimonials`,
    // `#contact`, wezwanie do rezerwacji) odsłaniają się przy wejściu w kadr.
    // Prerenderer nigdy nie scrollował, więc nigdy w kadr nie wchodziły, nigdy
    // się nie animowały i lądowały w statycznym pliku w stanie początkowym —
    // 68 elementów z `opacity: 0` na produkcji, zmierzone 2026-09-06. To nie
    // jest wyścig, tylko zdarzenie, które się nie odpala, więc żadne wydłużenie
    // oczekiwania go nie dosięgnie.
    //
    // Idzie PO oczekiwaniu na treść, nie przed: na trasach artykułów i lekcji
    // ciało dochodzi osobnym `import()`, a scroll po dokumencie bez ciała mierzy
    // nieprawdziwą wysokość i kończy się za wcześnie.
    //
    // Animacja dla prawdziwych odwiedzających zostaje bez zmian — zmienia się
    // tylko to, co widzi robot i użytkownik bez JavaScriptu.
    // Krok to POŁOWA ekranu, nie cały. Sekcje odsłaniają się dopiero, gdy są
    // 100 px w środku kadru (`viewport={{ margin: "-100px" }}`), a skok o pełny
    // ekran potrafi przenieść element spod dolnego progu nad górny, nigdy go w
    // próg nie wprowadzając. Zmierzone na zbudowanej stronie: pełny ekran przy
    // 120 ms zostawia 46 niewidocznych elementów, pół ekranu przy 250 ms
    // zostawia zero. Ćwierć ekranu nie poprawia już nic, więc połowa jest
    // najtańszym krokiem, który wystarcza.
    // Przejazd kończy się, gdy nie ma już czego odsłaniać, a nie po dojechaniu
    // do końca strony. Bezwarunkowy przejazd po wszystkich 98 trasach wydłużył
    // build z 3 do 10 minut na Vercelu, a płaci go każde wdrożenie — podczas gdy
    // sekcje odsłaniane przewijaniem ma garść tras, a nie artykuły bloga.
    //
    // Warunek jest samoograniczający: element jeszcze nieodsłonięty ma
    // `opacity: 0`, więc pętla jedzie dopóki cokolwiek istotnego jest ukryte, i
    // wychodzi po jednym sprawdzeniu tam, gdzie nie ma nic do odsłonięcia.
    await page.evaluate(async () => {
      const settle = () => new Promise((r) => setTimeout(r, 250));

      // Liczymy WSZYSTKIE ukryte elementy, nie tylko nagłówek i sekcje.
      // Warunek zawężony do nagłówków wychodził za wcześnie: same sekcje stają
      // się widoczne od razu, a animują się dopiero elementy w środku — strona
      // główna kończyła wtedy z 67 ukrytymi kaflami przy widocznych nagłówkach.
      const hiddenCount = () =>
        [...document.querySelectorAll("[style]")].filter((el) =>
          /opacity:\s*0(?![.\d])/.test(el.getAttribute("style") || ""),
        ).length;

      const step = window.innerHeight / 2;
      let position = 0;
      let guard = 0;
      let previous = hiddenCount();
      let stagnant = 0;

      // Jedziemy, dopóki przewijanie coś odsłania. Zatrzymanie po braku postępu,
      // a nie po dojechaniu do końca strony, jest tu istotne z dwóch powodów:
      // artykuły bloga nie mają czego odsłaniać i wychodzą po dwóch krokach
      // zamiast przewijać całą długość, a karuzela opinii animuje się w kółko i
      // nigdy nie dojdzie do zera — bez tego warunku pętla kręciłaby się do
      // wyczerpania `guard`. Bezwarunkowy przejazd po wszystkich 98 trasach
      // wydłużył build z 3 do 10 minut, a płaci go każde wdrożenie.
      while (previous > 0 && position < document.body.scrollHeight && guard < 200) {
        window.scrollTo(0, position);
        await settle();

        const current = hiddenCount();
        if (current === 0) break;
        stagnant = current < previous ? 0 : stagnant + 1;
        if (stagnant >= 3) break;

        previous = current;
        position += step;
        guard += 1;
      }

      if (guard > 0) {
        window.scrollTo(0, document.body.scrollHeight);
        await settle();
        window.scrollTo(0, 0);
        await settle();
      }
    });

    // Dodatkowy czas na animacje i lazy loading (zmniejszony dla Vercel)
    const waitTime = IS_VERCEL ? 1000 : 2000;
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    // Pobierz pełny HTML po renderowaniu
    const html = await page.content();

    // Określ ścieżkę do zapisu
    let outputPath;
    if (route === "/") {
      outputPath = join(DIST_DIR, "index.html");
    } else {
      // Dla innych tras tworzymy folder i index.html
      const routePath = route.endsWith("/") ? route.slice(0, -1) : route;
      const dirPath = join(DIST_DIR, routePath);

      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }

      outputPath = join(dirPath, "index.html");
    }

    // Zapisz prerenderowany HTML
    writeFileSync(outputPath, html, "utf-8");
    console.log(`  ✅ Zapisano: ${outputPath.replace(DIST_DIR, "")}`);

    return true;
  } catch (error) {
    // Retry logic dla timeoutów i dla metadanych z niewłaściwej trasy -
    // to drugie bywa wyścigiem, więc druga próba zwykle wychodzi poprawnie.
    if (retries > 0 && (error.retryable || error.message.includes("timeout"))) {
      console.error(`  ⚠️  ${error.message}`);
      console.error(`  ⚠️  Ponawiam ${route} (pozostało ${retries} prób)...`);
      // Zamknij stronę bezpiecznie - nawet jeśli się nie powiedzie, kontynuuj retry
      try {
        await page.close();
        pageClosed = true; // Oznacz stronę jako zamkniętą tylko jeśli zamknięcie się powiodło
      } catch (closeError) {
        // Jeśli zamknięcie się nie powiodło, strona może być już zamknięta lub uszkodzona
        // Oznacz jako zamkniętą, aby finally nie próbował ponownie
        pageClosed = true;
        console.error(`  ⚠️  Błąd przy zamykaniu strony przed retry (ignoruję): ${closeError.message}`);
      }
      // Krótka przerwa przed retry
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return prerenderPage(browser, route, retries - 1);
    }
    
    console.error(`  ❌ Błąd dla ${route}:`, error.message);
    return false;
  } finally {
    // Zamknij stronę tylko jeśli nie została już zamknięta (np. w retry)
    if (!pageClosed) {
      try {
        await page.close();
      } catch (closeError) {
        // Ignoruj błędy zamykania (strona może być już zamknięta)
        // To może się zdarzyć w edge cases, ale nie powinno przerwać procesu
      }
    }
  }
}

/**
 * Główna funkcja prerenderingu
 */
async function main() {
  let browser;
  let successCount = 0;
  let failCount = 0;

  try {
    console.log(`🚀 Rozpoczynam prerendering ${allRoutes.length} stron...\n`);

    // Sprawdź czy dist folder istnieje
    if (!existsSync(DIST_DIR)) {
      throw new Error(
        `Folder dist nie istnieje! Najpierw uruchom: npm run build`
      );
    }

    console.log(`📦 Używam dist folder: ${DIST_DIR}`);
    console.log(`🌐 Preview URL: ${BASE_URL}`);

    if (IS_VERCEL) {
      console.log("▲ Wykryto środowisko Vercel - używam puppeteer-core + sparticuz/chromium");
      console.log("⚙️  Konfiguracja: timeout=120s, waitUntil=load (zoptymalizowane dla Vercel)");
      const chromium = await import("@sparticuz/chromium");
      const puppeteer = await import("puppeteer-core");

      // Konfiguracja dla Vercel/AWS Lambda
      browser = await puppeteer.default.launch({
        args: chromium.default.args,
        defaultViewport: chromium.default.defaultViewport,
        executablePath: await chromium.default.executablePath(),
        headless: chromium.default.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      console.log("💻 Wykryto środowisko Lokalne - używam Playwright");
      const { chromium } = await import("@playwright/test");
      // Opt-in: ustaw PRERENDER_CHANNEL=msedge|chrome, by użyć systemowej
      // przeglądarki zamiast pobranej binarki Playwright (np. gdy brak chromium).
      // Bez env zachowanie bez zmian (pobrany chromium).
      browser = await chromium.launch({
        headless: true,
        channel: process.env.PRERENDER_CHANNEL || undefined,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    console.log("🤖 Browser uruchomiony\n");

    // Prerenderuj każdą stronę
    for (const route of allRoutes) {
      const success = await prerenderPage(browser, route);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log(`\n📊 Podsumowanie:`);
    console.log(`   ✅ Sukces: ${successCount} stron`);
    console.log(`   ❌ Błędy: ${failCount} stron`);
    console.log(`\n🎉 Prerendering zakończony!`);

    if (failCount > 0) {
      console.log(
        `\n⚠️  Niektóre strony nie zostały prerenderowane. Sprawdź logi powyżej.`
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(`\n❌ Krytyczny błąd:`, error.message);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Uruchom
main().catch((error) => {
  console.error("Nieoczekiwany błąd:", error);
  process.exit(1);
});
