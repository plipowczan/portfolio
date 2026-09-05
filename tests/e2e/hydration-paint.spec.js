import { expect, test } from "@playwright/test";

/**
 * Hydratacja nie gasi tego, co prerender już namalował.
 *
 * Pomiar sprzed zmiany: hero `<h1>` wychodził z `dist/` z `opacity: 1`,
 * hydratacja nakładała `initial` Framer Motion około 380 ms i zbijała go do
 * `opacity: 0`, a pełną widoczność odzyskiwał dopiero około 1,45 s. Największy
 * tekst na stronie znikał i wracał, a Largest Contentful Paint — który pomija
 * elementy o zerowej przezroczystości — mierzył się od końca animacji, nie od
 * malowania, które już się wydarzyło.
 *
 * Animacji nie usunięto: gra przy nawigacji wewnątrz serwisu, gdzie nic nie
 * jest prerenderowane i żadne pierwsze malowanie nie jest stawką.
 */

const HERO_HEADING = "h1";

/**
 * Ciało próbkujące, wstrzykiwane po obu stronach.
 *
 * Próbkowanie idzie w przeglądarce, nie przez pętlę w Node: runda przez
 * protokół CDP trwa dziesiątki milisekund, więc pętla po stronie testu
 * przegapiłaby ten kilkusetmilisekundowy dołek, którego szukamy.
 */
const SAMPLER = (selector) => {
  window.__motionSamples = [];
  setInterval(() => {
    const element = document.querySelector(selector);
    if (element) {
      const style = getComputedStyle(element);
      window.__motionSamples.push({
        opacity: Number(style.opacity),
        transform: style.transform,
      });
    }
  }, 60);
};

/**
 * Uzbraja próbkowanie na *następny* dokument, zanim ten w ogóle powstanie.
 * Do pełnego wejścia na stronę — `page.evaluate` po `goto()` startuje setki
 * milisekund po commicie i widziałby już tylko ogon okna.
 */
const armBeforeLoad = (page, selector) => page.addInitScript(SAMPLER, selector);

/**
 * Uzbraja próbkowanie w bieżącym dokumencie. Do nawigacji po stronie klienta,
 * gdzie dokument się nie przeładowuje, więc `addInitScript` nigdy by nie ruszył.
 */
const armInPage = (page, selector) => page.evaluate(SAMPLER, selector);

/** Odczytuje próbki zebrane przez sampler po `durationMs`. */
async function readSamples(page, durationMs) {
  await page.waitForTimeout(durationMs);
  return page.evaluate(() => window.__motionSamples ?? []);
}

const opacities = (samples) => samples.map((s) => s.opacity);

/**
 * Pionowe przesunięcie z `transform`.
 *
 * Sama obecność macierzy nie znaczy „rusza się": Framer, dojeżdżając do celu,
 * zostawia macierz jednostkową zamiast `none`. Liczy się wartość `ty`.
 */
function translateY(transform) {
  if (!transform || transform === "none") return 0;
  const values = transform.match(/matrix(3d)?\(([^)]+)\)/);
  if (!values) return 0;
  const numbers = values[2].split(",").map(Number);
  return values[1] ? numbers[13] : numbers[5];
}

/**
 * Ile RÓŻNYCH pozycji poza celem zastały próbki.
 *
 * Liczba różnych wartości, nie liczba próbek. Przy `prefers-reduced-motion`
 * Framer renderuje jedną klatkę ze stanem `initial`, zanim zdąży go zdjąć —
 * pod obciążeniem ta sama klatka potrafi trafić w dwie próbki, więc zliczanie
 * próbek jest chwiejne. Zamrożona klatka daje jedną wartość niezależnie od
 * tego, ile razy ją złapiemy; grający tween daje ich kilkanaście.
 */
function offsetSteps(samples) {
  const offsets = samples
    .map((s) => Math.round(Math.abs(translateY(s.transform)) * 10) / 10)
    .filter((value) => value > 0.5);
  return new Set(offsets).size;
}

test.describe("hydratacja nie chowa treści z prerenderu", () => {
  test("hero zostaje widoczne przez całą hydratację", async ({ page }) => {
    await armBeforeLoad(page, HERO_HEADING);
    // Bez `waitUntil` domyślne "load" oddałoby sterowanie dopiero po zasobach —
    // chcemy mieć próbki od commitu, jeszcze sprzed hydratacji.
    await page.goto("/", { waitUntil: "commit" });
    await page.locator(HERO_HEADING).waitFor();

    const samples = await readSamples(page, 1500);

    expect(samples.length).toBeGreaterThan(5);
    // Hero nigdy nie jest przezroczyste ani przesunięte: od chwili, w której
    // trafia do DOM-u, jest w stanie docelowym. Przed zmianą pierwsze próbki
    // dawały `opacity: 0` i macierz przesunięcia.
    expect(Math.min(...opacities(samples))).toBe(1);
    expect(offsetSteps(samples)).toBe(0);
  });

  test("nawigacja wewnątrz serwisu nadal animuje wejście", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.locator(HERO_HEADING)).toBeVisible();
    await armInPage(page, HERO_HEADING);

    // Breadcrumb "Home" — nawigacja po stronie klienta, bez przeładowania.
    await page.getByRole("link", { name: "Home" }).first().click();

    const samples = await readSamples(page, 1200);

    expect(samples.length).toBeGreaterThan(5);
    expect(Math.min(...opacities(samples))).toBeLessThan(1);
    expect(offsetSteps(samples)).toBeGreaterThan(3);
  });

  test("reduced motion tłumi ruch również przy nawigacji", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto("/blog");
    await expect(page.locator(HERO_HEADING)).toBeVisible();
    await armInPage(page, HERO_HEADING);

    await page.getByRole("link", { name: "Home" }).first().click();

    const samples = await readSamples(page, 1200);

    expect(samples.length).toBeGreaterThan(5);
    // `<MotionConfig reducedMotion="user">` tłumi ruch, nie zanik: to
    // zachowanie samego Framer Motion i kontrakt, który serwis miał już przed
    // tą zmianą. Hero nie jedzie po ekranie; `opacity` nadal się rozjaśnia.
    // Jedna pozycja poza celem to klatka ze stanem `initial`, którą Framer
    // zdejmuje na następnej ramce — animacja nie gra, więc nowe pozycje się
    // nie pojawiają.
    expect(offsetSteps(samples)).toBeLessThanOrEqual(1);
  });

  test("sekcje pod zgięciem nadal animują się przy scrollu", async ({ page }) => {
    await page.goto("/");

    const about = page.locator("#about");
    await expect(about).toBeAttached();

    // Animowany jest kontener nagłówka (`variants={FADE_IN_UP}`), nie sam `h2`.
    const titleOpacity = (element) =>
      Number(getComputedStyle(element.querySelector("h2").parentElement).opacity);

    // Poniżej zgięcia i jeszcze nieodwiedzone: `whileInView` trzyma sekcję w
    // stanie wyjściowym, więc przed przewinięciem nagłówek nie jest widoczny.
    expect(await about.evaluate(titleOpacity)).toBeLessThan(1);

    await about.scrollIntoViewIfNeeded();
    await expect
      .poll(async () => about.evaluate(titleOpacity), { timeout: 5000 })
      .toBe(1);
  });
});
