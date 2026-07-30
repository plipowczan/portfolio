import { expect, test } from "@playwright/test";

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

    // CTA do waitlisty. Liczone w treści, nie w całym dokumencie — nawigacja
    // i stopka też linkują do /llm-wiki, odkąd sekcja przestała być osierocona.
    await expect(page.locator('main a[href="/llm-wiki"]')).toHaveCount(1);

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

      // CTA na dole → waitlista. Zawężone do treści: nawigacja i stopka też
      // linkują do /llm-wiki, odkąd sekcja przestała być osierocona.
      await expect(page.locator('main a[href="/llm-wiki"]')).toHaveCount(1);
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

test.describe("Kurs LLM Wiki — wejście w kurs z landingu", () => {
  test("link do /llm-wiki/kurs jest dostępny przed zapisem i po zapisie", async ({
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

    // Wcześniej link pojawiał się dopiero po zapisie. Bramka niczego nie
    // chroniła — /llm-wiki/kurs zwraca 200 każdemu, kto zna adres — a ukrywała
    // kurs i 8 lekcji przed robotem: w prerenderowanym HTML nie było do nich
    // żadnego linku wewnętrznego. Formularz zostaje głównym wezwaniem.
    await expect(page.locator('main a[href="/llm-wiki/kurs"]')).toHaveCount(1);

    await page.locator("#waitlist-email").fill("test@example.com");
    await page.getByRole("button", { name: /Zapisz mnie/i }).click();

    await expect(page.getByText(/Jesteś na liście/i)).toBeVisible();

    // Ekran sukcesu ma własne wejście w kurs.
    await expect(page.locator('main a[href="/llm-wiki/kurs"]')).toHaveCount(1);
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

// Asercje o prerenderze (statyczny HTML huba i lekcji, brak wariantów /en)
// nie mieszkają już tutaj. Przeniosły się do `scripts/verify-prerender-output.mjs`,
// które `npm run build:prerender` wywołuje jako ostatni krok — a że to
// `buildCommand` z `vercel.json`, bramka działa na każdym wdrożeniu, zamiast
// czekać, aż ktoś pamięta uruchomić 6,5-minutowy build przed merge.
