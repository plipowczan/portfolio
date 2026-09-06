#!/usr/bin/env node

/**
 * Sprawdzenie wyniku prerenderu.
 *
 * `scripts/prerender.mjs` kończy się kodem != 0, gdy trasa, o którą go
 * poproszono, nie wyrenderowała się. Nie zobaczy dwóch rzeczy: trasy, której
 * nigdy nie było na liście (lekcja dodana, ale niepodpięta), oraz strony,
 * która wyrenderowała się bez metadanych. To są dokładnie te dwie luki.
 *
 * Sprawdzenie siedzi w buildzie, nie w teście Playwrighta, bo `vercel.json`
 * ustawia `buildCommand: "npm run build:prerender"` — dzięki temu bramka
 * działa na każdym wdrożeniu preview i produkcyjnym, bez minuty CI.
 *
 * Da się uruchomić osobno, bez pełnego builda:
 *   node scripts/verify-prerender-output.mjs
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import {
  COURSE_BASE_PATH,
  getCourseLessons,
  listLessonFiles,
} from "./course-lessons.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DIST = join(HERE, "..", "dist");

const DESCRIPTION_TAG = 'name="description"';

/** `/llm-wiki/kurs` → ["llm-wiki", "kurs"] — segmenty do złożenia ścieżki. */
const COURSE_SEGMENTS = COURSE_BASE_PATH.split("/").filter(Boolean);

/**
 * @param {string} distDir katalog z wynikiem builda
 * @returns {{ problems: string[], checked: string[] }}
 */
export function checkPrerenderOutput(distDir = DEFAULT_DIST) {
  const problems = [];
  const checked = [];

  const requirePage = (segments, label) => {
    const file = join(distDir, ...segments, "index.html");
    if (!existsSync(file)) {
      problems.push(`${label}: brak pliku ${file}`);
      return;
    }
    if (!readFileSync(file, "utf-8").includes(DESCRIPTION_TAG)) {
      problems.push(`${label}: ${file} nie zawiera <meta ${DESCRIPTION_TAG}>`);
      return;
    }
    checked.push(`${label} → ${join(...segments, "index.html")}`);
  };

  // Hub kursu.
  requirePage(COURSE_SEGMENTS, "hub kursu");

  // Lekcje. Pusta lista znaczy, że nie ma czego sprawdzać — a to samo w sobie
  // jest awarią: bez tego strażnika wszystkie asercje niżej przechodzą
  // pustym przebiegiem i sprawdzenie melduje sukces, nie sprawdziwszy nic.
  const lessons = getCourseLessons();
  if (lessons.length === 0) {
    problems.push(
      "nie znaleziono żadnej lekcji kursu w src/content/kurs — sprawdzenie nie miałoby czego weryfikować"
    );
  }

  // Plik, który kandydował na lekcję, ale nie ma poprawnego `slug`/`order`,
  // wypada z listy z samym ostrzeżeniem na konsoli. Nie prerenderuje się i nie
  // trafia do pętli niżej, więc bez tego porównania build przechodzi mimo
  // lekcji, której nikt nigdy nie zobaczy — czyli dokładnie przypadek „lekcja
  // dodana, ale niepodpięta", od którego jest ten inwariant.
  const parsed = new Set(lessons.map((lesson) => lesson.file));
  for (const file of listLessonFiles()) {
    if (!parsed.has(file)) {
      problems.push(
        `src/content/kurs/${file} wygląda na lekcję, ale nie ma poprawnego frontmatteru (\`slug\` i \`order\`), więc nie została prerenderowana`
      );
    }
  }
  for (const lesson of lessons) {
    requirePage([...COURSE_SEGMENTS, lesson.slug], `lekcja ${lesson.slug}`);
  }

  // Kurs jest PL-only: żadnego wariantu pod /en.
  const enMirror = join(distDir, "en", ...COURSE_SEGMENTS);
  if (existsSync(enMirror)) {
    problems.push(
      `kurs jest PL-only, a powstał wariant /en: ${enMirror} — usuń go albo popraw listę tras w scripts/prerender.mjs`
    );
  }

  // Analityka jest bramkowana zgodą i wstrzykiwana dopiero w przeglądarce.
  // Gdyby prerender zapisał gotowy tag do statycznego HTML, skrypt Google
  // ładowałby się przed jakąkolwiek decyzją użytkownika — czyli bramka zgody
  // przestałaby istnieć, a statyczny plik nie ma jak tego zgłosić.
  const htmlFiles = existsSync(distDir)
    ? readdirSync(distDir, { recursive: true })
        .map(String)
        .filter((name) => name.endsWith(".html"))
    : [];

  if (htmlFiles.length <= 1) {
    problems.push(
      `w ${distDir} jest ${htmlFiles.length} plików .html — to nie wygląda na wynik prerenderu`
    );
  }

  const withAnalytics = htmlFiles.filter((name) =>
    readFileSync(join(distDir, name), "utf-8").includes("googletagmanager")
  );
  if (withAnalytics.length > 0) {
    problems.push(
      `statyczny HTML odwołuje się do googletagmanager, co omija bramkę zgody: ${withAnalytics.join(", ")}`
    );
  } else {
    checked.push(`${htmlFiles.length} plików HTML bez odwołań do googletagmanager`);
  }

  // Dane strukturalne: każdy blok ma być poprawnym JSON-em i ma wystąpić raz.
  //
  // Bramka wyżej w scripts/prerender.mjs sprawdza kanoniczny adres, opis i
  // og:title — czyli to, czym zarządza Helmet. JSON-LD było poza jej zasięgiem,
  // bo komponent doklejał skrypt wprost do `document.head`. Skutek: strona
  // prywatności serwowała blok `Person` ze strony głównej, a `/en/` ten sam blok
  // dwa razy. Emisja przez Helmet związała bloki z trasą, a to sprawdzenie
  // pilnuje, żeby nawrót zatrzymał build zamiast wyjechać na produkcję.
  //
  // Świadomie sprawdzamy dwie rzeczy, których wynik da się rozstrzygnąć z
  // samego pliku: duplikat i niepoprawny JSON. „Blok należący do innej trasy"
  // nie jest tu rozstrzygalny — wymagałby mapy trasa→schematy, a tę utrzymywano
  // by ręcznie i rozjechałaby się z kodem. Przynależność do trasy zapewnia
  // Helmet konstrukcyjnie, nie ta bramka.
  const LD_BLOCK = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let ldChecked = 0;

  for (const name of htmlFiles) {
    const html = readFileSync(join(distDir, name), "utf-8");
    const blocks = [...html.matchAll(LD_BLOCK)].map((m) => m[1].trim());
    if (blocks.length === 0) continue;

    const seen = new Map();
    for (const raw of blocks) {
      ldChecked += 1;

      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch (error) {
        problems.push(
          `${name}: blok danych strukturalnych nie jest poprawnym JSON-em (${error.message})`
        );
        continue;
      }

      const type = Array.isArray(parsed)
        ? "tablica"
        : (parsed["@type"] ?? "bez @type");

      if (seen.has(raw)) {
        problems.push(
          `${name}: blok danych strukturalnych "${type}" występuje ${seen.get(raw) + 1} razy — ten sam byte w byte`
        );
      }
      seen.set(raw, (seen.get(raw) ?? 0) + 1);
    }
  }

  if (ldChecked > 0) {
    checked.push(`${ldChecked} bloków danych strukturalnych: poprawny JSON, bez duplikatów`);
  }

  // Treść główna ma wyjść widoczna, bez udziału JavaScriptu.
  //
  // Sekcje strony głównej odsłaniają się przy wejściu w kadr, a prerenderer nie
  // scrollował, więc nigdy w kadr nie wchodziły i lądowały w pliku w stanie
  // początkowym: 68 elementów z `opacity: 0` na produkcji, w tym `<h1>`, który
  // Lighthouse wskazuje jako największy element strony. Serwer odpowiadał w
  // 30 ms i nie malował nic.
  //
  // Sprawdzamy sam znacznik `<h1>` i same znaczniki `<section id="...">`, nie
  // ich potomków. Karuzela opinii animuje się w kółko, więc któryś jej slajd
  // zawsze wypadnie w połowie przejścia — to nie jest usterka, bo sekcja i jej
  // tekst są w pliku. Element świadomie ukryty, jak zwinięte menu, też ma prawo
  // być niewidoczny. Ukryta sekcja albo ukryty nagłówek to co innego: wtedy
  // odwiedzający widzi pustą przestrzeń.
  //
  // Lista sekcji bierze się z samego wyjścia, nie z listy w kodzie — dzięki temu
  // nowa sekcja jest objęta sprawdzeniem bez dopisywania jej gdziekolwiek.
  // Zero, ale nie `0.5` i nie `0` z dalszymi cyframi. Wzorzec wymagający znaku
  // po zerze nie działa, bo `opacity: 0"` kończy atrybut — dlatego lookahead.
  const HIDDEN_STYLE = /style="[^"]*opacity:\s*0(?![.\d])/;
  let visibilityChecked = 0;

  for (const name of htmlFiles) {
    const html = readFileSync(join(distDir, name), "utf-8");

    const landmarks = [
      ...[...html.matchAll(/<h1\b[^>]*>/g)].map((m) => ["<h1>", m[0]]),
      ...[...html.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*>/g)].map((m) => [
        `<section id="${m[1]}">`,
        m[0],
      ]),
    ];

    for (const [label, tag] of landmarks) {
      visibilityChecked += 1;
      if (HIDDEN_STYLE.test(tag)) {
        problems.push(
          `${name}: ${label} wychodzi niewidoczny (opacity: 0) — bez JavaScriptu odwiedzający zobaczy w tym miejscu pustkę`
        );
      }
    }

    // Sekcja może wyjść widoczna, a jej zawartość ukryta — i to przechodziło
    // przez sprawdzenie wyżej. Trafiło się naprawdę: przy jednej z wersji
    // przejazdu strona główna wyszła z 67 ukrytymi kaflami przy widocznych
    // nagłówkach, a build był zielony.
    //
    // Nie liczymy tu pojedynczych sztuk, bo karuzela opinii animuje się w kółko
    // i zawsze wypadnie w połowie przejścia. Próg oddziela „jeden element w
    // ruchu" od „sekcja, która nigdy się nie odsłoniła".
    const HIDDEN_DESCENDANTS_LIMIT = 3;
    for (const m of html.matchAll(/<section\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
      const from = m.index + m[0].length;
      const to = html.indexOf("</section>", from);
      const body = to === -1 ? html.slice(from) : html.slice(from, to);
      const hidden = (body.match(/style="[^"]*opacity:\s*0(?![.\d])/g) ?? []).length;

      if (hidden > HIDDEN_DESCENDANTS_LIMIT) {
        problems.push(
          `${name}: sekcja #${m[1]} wychodzi widoczna, ale ${hidden} elementów w środku ma opacity: 0 — nagłówek będzie, treści pod nim nie`
        );
      }
    }
  }

  if (visibilityChecked > 0) {
    checked.push(`${visibilityChecked} nagłówków i sekcji wychodzi widocznych`);
  }

  return { problems, checked };
}

/**
 * Wypisuje wynik i rzuca wyjątkiem, gdy wyjście jest niekompletne.
 * @param {string} [distDir]
 */
export function verifyPrerenderOutput(distDir = DEFAULT_DIST) {
  const { problems, checked } = checkPrerenderOutput(distDir);

  if (problems.length > 0) {
    console.error("\n❌ Prerender wypuścił niekompletne wyjście:\n");
    for (const problem of problems) {
      console.error(`   • ${problem}`);
    }
    console.error("");
    throw new Error(
      `Sprawdzenie wyniku prerenderu: ${problems.length} ${
        problems.length === 1 ? "problem" : "problemów"
      }`
    );
  }

  console.log(`\n✅ Wynik prerenderu sprawdzony (${checked.length} stron):`);
  for (const page of checked) {
    console.log(`   • ${page}`);
  }
  console.log("");
}

// Uruchomienie bezpośrednie: `node scripts/verify-prerender-output.mjs`
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    verifyPrerenderOutput(process.argv[2]);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
