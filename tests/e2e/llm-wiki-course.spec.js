import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "..", "dist");

const REPO_URL = "https://github.com/plipowczan/second-brain-template";

// Ordered lessons — a hardcoded mirror of src/content/kurs/*.md. Keep this in
// sync when lessons are added/reordered (or derive it from the files later).
// L0 basics tier (non-technical primer) sits before the main L1–L5 course.
const BASICS = [
  { slug: "0-co-to-drugi-mozg", title: "Co to jest drugi mózg i po co" },
  { slug: "0-trzy-pojecia", title: "Trzy pojęcia zanim zaczniesz" },
  { slug: "0-uruchom-w-swoim-narzedziu", title: "Uruchom w swoim narzędziu" },
];
const LESSONS = [
  { slug: "1-zaloz-katalog", title: "Załóż katalog z szablonu" },
  { slug: "2-onboarding", title: "Onboarding" },
  { slug: "3-pierwszy-ingest", title: "Pierwszy ingest" },
  { slug: "4-pytania-i-zarzadzanie", title: "Pytania i zarządzanie" },
  { slug: "5-rozwoj-i-publikacja", title: "Rozwój i publikacja" },
];
// Full ordered chain: L0.1 → L0.2 → L0.3 → L1 → … → L5.
const ALL_LESSONS = [...BASICS, ...LESSONS];

test.describe("Kurs LLM Wiki — hub", () => {
  test("renderuje tytuł, wszystkie lekcje (L0 + L1–L5), CTA do waitlisty i link do repo", async ({
    page,
  }) => {
    await page.goto("/llm-wiki/kurs");

    await expect(page.locator("h1")).toContainText(/darmowy kurs/i);

    // Wszystkie lekcje (tier podstaw + kurs właściwy) zalinkowane.
    for (const lesson of ALL_LESSONS) {
      await expect(
        page.locator(`a[href="/llm-wiki/kurs/${lesson.slug}"]`)
      ).toHaveCount(1);
    }

    // CTA do waitlisty.
    await expect(page.locator('a[href="/llm-wiki"]')).toHaveCount(1);

    // Link do repo szablonu.
    await expect(page.locator(`a[href="${REPO_URL}"]`)).toHaveCount(1);
  });

  test("sekcja „Zanim zaczniesz — podstawy” jest nad listą L1–L5", async ({
    page,
  }) => {
    await page.goto("/llm-wiki/kurs");

    await expect(
      page.getByRole("heading", { name: /Zanim zaczniesz - podstawy/i })
    ).toBeVisible();

    // Tier podstaw poprzedza kurs właściwy w DOM (pierwsza lekcja L0 przed L1).
    const basicHref = `/llm-wiki/kurs/${BASICS[0].slug}`;
    const mainHref = `/llm-wiki/kurs/${LESSONS[0].slug}`;

    // Fail fast with a clear message if either link is missing, before we
    // reach into the DOM — avoids an opaque throw on a null element handle.
    await expect(page.locator(`a[href="${basicHref}"]`)).toBeVisible();
    await expect(page.locator(`a[href="${mainHref}"]`)).toBeVisible();

    // Compare positions inside the page (querySelector can't leak a null
    // handle across the boundary); null-guard returns null → assertion fails
    // clearly rather than throwing.
    const basicsBeforeMain = await page.evaluate(
      ({ a, b }) => {
        const first = document.querySelector(`a[href="${a}"]`);
        const second = document.querySelector(`a[href="${b}"]`);
        if (!first || !second) return null;
        // eslint-disable-next-line no-bitwise
        return Boolean(
          first.compareDocumentPosition(second) &
            Node.DOCUMENT_POSITION_FOLLOWING
        );
      },
      { a: basicHref, b: mainHref }
    );
    expect(basicsBeforeMain).toBe(true);
  });

  test("hub renderuje sekcję „Dla kogo jest ten kurs” z tą samą listą pojęć co landing", async ({
    page,
  }) => {
    await page.goto("/llm-wiki/kurs");

    const audience = page.getByTestId("course-audience");
    await expect(
      audience.getByRole("heading", { name: "Dla kogo jest ten kurs" })
    ).toBeVisible();
    await expect(
      audience.locator("dt", { hasText: "Claude Code" })
    ).toBeVisible();
    await expect(
      audience.getByText(/agent od Anthropic działający w terminalu/i)
    ).toBeVisible();
  });

  test("hub renderuje FAQ z obiekcjami i emituje FAQPage JSON-LD z danych", async ({
    page,
  }) => {
    await page.goto("/llm-wiki/kurs");

    const faq = page.getByTestId("course-faq");
    await expect(
      faq.getByRole("heading", { name: "Najczęstsze obiekcje" })
    ).toBeVisible();

    // Co najmniej 3 wpisy; obiekcje „po co”, „build vs buy”, „grep vs indeks”.
    await expect(faq.locator("dt")).not.toHaveCount(0);
    for (const question of [
      "Po co mi taka baza?",
      "Po co płacić, skoro sam to zbuduję?",
      "Agent ma grep - po co mu jeszcze indeks?",
    ]) {
      await expect(faq.locator("dt", { hasText: question })).toBeVisible();
    }
    expect(await faq.locator("dt").count()).toBeGreaterThanOrEqual(3);

    // Blok FAQ nie dodaje linków (hub ma dokładnie jedno CTA do /llm-wiki).
    await expect(faq.locator("a")).toHaveCount(0);

    // FAQPage JSON-LD wstrzykiwane przez StructuredData (useEffect) — poll.
    await expect
      .poll(async () =>
        page.evaluate(() => {
          const scripts = Array.from(
            document.querySelectorAll('script[type="application/ld+json"]')
          );
          const faqSchema = scripts
            .map((s) => {
              try {
                return JSON.parse(s.textContent);
              } catch {
                return null;
              }
            })
            .find((s) => s && s["@type"] === "FAQPage");
          return faqSchema ? faqSchema.mainEntity.map((q) => q.name) : null;
        })
      )
      .not.toBeNull();

    const schemaQuestions = await page.evaluate(() => {
      const scripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      );
      const faqSchema = scripts
        .map((s) => {
          try {
            return JSON.parse(s.textContent);
          } catch {
            return null;
          }
        })
        .find((s) => s && s["@type"] === "FAQPage");
      return faqSchema.mainEntity.map((q) => q.name);
    });

    // Pytania w schemie odpowiadają wyrenderowanym wpisom.
    const renderedQuestions = await faq.locator("dt").allTextContents();
    for (const name of schemaQuestions) {
      expect(renderedQuestions.some((text) => text.includes(name))).toBe(true);
    }
  });
});

test.describe("Kurs LLM Wiki — lekcje", () => {
  for (const lesson of ALL_LESSONS) {
    test(`lekcja ${lesson.slug} renderuje h1 i CTA do /llm-wiki`, async ({
      page,
    }) => {
      await page.goto(`/llm-wiki/kurs/${lesson.slug}`);

      await expect(
        page.getByRole("heading", { level: 1 })
      ).toContainText(lesson.title);

      // CTA na dole → waitlista.
      await expect(page.locator('a[href="/llm-wiki"]')).toHaveCount(1);
    });
  }

  test("prev/next odzwierciedlają kolejność lekcji", async ({ page }) => {
    await page.goto("/llm-wiki/kurs/2-onboarding");

    await expect(
      page.locator('a[href="/llm-wiki/kurs/1-zaloz-katalog"]')
    ).toHaveCount(1);
    await expect(
      page.locator('a[href="/llm-wiki/kurs/3-pierwszy-ingest"]')
    ).toHaveCount(1);
  });

  test("pierwsza lekcja (L0.1) bez „Poprzednia”, ostatnia bez „Następna”", async ({
    page,
  }) => {
    await page.goto("/llm-wiki/kurs/0-co-to-drugi-mozg");
    await expect(page.getByText("Poprzednia")).toHaveCount(0);
    await expect(
      page.locator('a[href="/llm-wiki/kurs/0-trzy-pojecia"]')
    ).toHaveCount(1);

    await page.goto("/llm-wiki/kurs/5-rozwoj-i-publikacja");
    await expect(page.getByText("Następna")).toHaveCount(0);
    await expect(
      page.locator('a[href="/llm-wiki/kurs/4-pytania-i-zarzadzanie"]')
    ).toHaveCount(1);
  });

  test("łańcuch L0 → L1: L0.3 «Następna» → L1, L1 «Poprzednia» → L0.3", async ({
    page,
  }) => {
    // L0.3 → następna to pierwsza lekcja kursu właściwego.
    await page.goto("/llm-wiki/kurs/0-uruchom-w-swoim-narzedziu");
    await expect(
      page.locator('a[href="/llm-wiki/kurs/1-zaloz-katalog"]')
    ).toHaveCount(1);

    // L1 → poprzednia to ostatnia lekcja tieru podstaw (jedyny nowy link wstecz).
    await page.goto("/llm-wiki/kurs/1-zaloz-katalog");
    await expect(page.getByText("Poprzednia")).toHaveCount(1);
    await expect(
      page.locator('a[href="/llm-wiki/kurs/0-uruchom-w-swoim-narzedziu"]')
    ).toHaveCount(1);
  });

  test("nieznany slug → stan „nie znaleziono” z linkiem powrotu", async ({
    page,
  }) => {
    await page.goto("/llm-wiki/kurs/nieistniejaca-lekcja");

    await expect(page.getByText(/Lekcja nie znaleziona/i)).toBeVisible();
    await expect(page.locator('a[href="/llm-wiki/kurs"]')).toHaveCount(1);
  });
});

test.describe("Kurs LLM Wiki — landing bez regresji", () => {
  test("/llm-wiki nadal renderuje „rośnie sama” + wpisy indeksu i sekcję Dla kogo", async ({
    page,
  }) => {
    await page.goto("/llm-wiki");
    await expect(page.locator("h1")).toContainText("rośnie sama");
    // Po tytułach, nie po globalnej liczbie h2 — odporne na nowe sekcje.
    for (const title of ["Kumuluje się sama", "Index-first", "Przenośna"]) {
      await expect(page.locator("h2", { hasText: title })).toBeVisible();
    }
    await expect(
      page.locator("h2", { hasText: "Dla kogo jest ten kurs" })
    ).toBeVisible();
  });
});

test.describe("Kurs LLM Wiki — link z ekranu sukcesu landingu", () => {
  test("link do /llm-wiki/kurs pojawia się dopiero po zapisie", async ({
    page,
  }) => {
    await page.route("**/api/subscribe", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/llm-wiki");

    // GATE: brak linku do kursu przed zapisem.
    await expect(page.locator('a[href="/llm-wiki/kurs"]')).toHaveCount(0);

    await page.locator("#waitlist-email").fill("test@example.com");
    await page.getByRole("button", { name: /Zapisz mnie/i }).click();

    await expect(page.getByText(/Jesteś na liście/i)).toBeVisible();

    // Po zapisie: link do darmowego kursu odbramkowany.
    await expect(page.locator('a[href="/llm-wiki/kurs"]')).toHaveCount(1);
  });
});

test.describe("Kurs LLM Wiki — PL-only redirecty /en", () => {
  test("/en/llm-wiki/kurs/2-onboarding → /llm-wiki/kurs/2-onboarding", async ({
    page,
  }) => {
    await page.goto("/en/llm-wiki/kurs/2-onboarding");
    await page.waitForURL("**/llm-wiki/kurs/2-onboarding");
    await expect(page).toHaveURL(/\/llm-wiki\/kurs\/2-onboarding$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Onboarding"
    );
  });

  test("/en/llm-wiki/kurs → /llm-wiki/kurs", async ({ page }) => {
    await page.goto("/en/llm-wiki/kurs");
    await page.waitForURL("**/llm-wiki/kurs");
    await expect(page).toHaveURL(/\/llm-wiki\/kurs$/);
  });
});

// Prerender assertions read the built `dist/`. `npm test` runs the dev server
// only, so this block is skipped unless a `npm run build:prerender` was run
// first (locally / in the verify step). It never fails a build-less run.
test.describe("Kurs LLM Wiki — prerender (PL-only)", () => {
  test.skip(
    !existsSync(DIST),
    "brak dist/ — uruchom `npm run build:prerender` przed tym testem"
  );

  test("hub i wszystkie lekcje (L0 + L1–L5) mają statyczny HTML z meta description; brak wariantów /en", () => {
    const hubHtml = join(DIST, "llm-wiki", "kurs", "index.html");
    expect(existsSync(hubHtml)).toBe(true);
    expect(readFileSync(hubHtml, "utf-8")).toContain('name="description"');

    for (const lesson of ALL_LESSONS) {
      const lessonHtml = join(
        DIST,
        "llm-wiki",
        "kurs",
        lesson.slug,
        "index.html"
      );
      expect(existsSync(lessonHtml)).toBe(true);
      expect(readFileSync(lessonHtml, "utf-8")).toContain('name="description"');
    }

    // PL-only: żadnych stron kursu pod /en.
    expect(existsSync(join(DIST, "en", "llm-wiki", "kurs"))).toBe(false);
  });
});
