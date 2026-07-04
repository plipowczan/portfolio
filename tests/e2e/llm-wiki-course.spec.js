import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "..", "dist");

const REPO_URL = "https://github.com/plipowczan/second-brain-template";

// Ordered lessons — a hardcoded mirror of src/content/kurs/*.md. Keep this in
// sync when lessons are added/reordered (or derive it from the files later).
const LESSONS = [
  { slug: "1-zaloz-katalog", title: "Załóż katalog z szablonu" },
  { slug: "2-onboarding", title: "Onboarding" },
  { slug: "3-pierwszy-ingest", title: "Pierwszy ingest" },
  { slug: "4-pytania-i-zarzadzanie", title: "Pytania i zarządzanie" },
  { slug: "5-rozwoj-i-publikacja", title: "Rozwój i publikacja" },
];

test.describe("Kurs LLM Wiki — hub", () => {
  test("renderuje tytuł, 5 linków do lekcji, CTA do waitlisty i link do repo", async ({
    page,
  }) => {
    await page.goto("/llm-wiki/kurs");

    await expect(page.locator("h1")).toContainText(/darmowy kurs/i);

    // Wszystkie 5 lekcji zalinkowane.
    for (const lesson of LESSONS) {
      await expect(
        page.locator(`a[href="/llm-wiki/kurs/${lesson.slug}"]`)
      ).toHaveCount(1);
    }

    // CTA do waitlisty.
    await expect(page.locator('a[href="/llm-wiki"]')).toHaveCount(1);

    // Link do repo szablonu.
    await expect(page.locator(`a[href="${REPO_URL}"]`)).toHaveCount(1);
  });
});

test.describe("Kurs LLM Wiki — lekcje", () => {
  for (const lesson of LESSONS) {
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

  test("pierwsza lekcja bez „Poprzednia”, ostatnia bez „Następna”", async ({
    page,
  }) => {
    await page.goto("/llm-wiki/kurs/1-zaloz-katalog");
    await expect(page.getByText("Poprzednia")).toHaveCount(0);
    await expect(
      page.locator('a[href="/llm-wiki/kurs/2-onboarding"]')
    ).toHaveCount(1);

    await page.goto("/llm-wiki/kurs/5-rozwoj-i-publikacja");
    await expect(page.getByText("Następna")).toHaveCount(0);
    await expect(
      page.locator('a[href="/llm-wiki/kurs/4-pytania-i-zarzadzanie"]')
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
  test("/llm-wiki nadal renderuje „rośnie sama” + 3 wpisy indeksu (h2)", async ({
    page,
  }) => {
    await page.goto("/llm-wiki");
    await expect(page.locator("h1")).toContainText("rośnie sama");
    await expect(page.locator("h2")).toHaveCount(3);
  });
});

test.describe("Kurs LLM Wiki — link z ekranu sukcesu landingu", () => {
  test("link do /llm-wiki/kurs pojawia się dopiero po zapisie", async ({
    page,
  }) => {
    await page.route("https://formspree.io/f/xblqpqab", async (route) => {
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

  test("hub i 5 lekcji mają statyczny HTML z meta description; brak wariantów /en", () => {
    const hubHtml = join(DIST, "llm-wiki", "kurs", "index.html");
    expect(existsSync(hubHtml)).toBe(true);
    expect(readFileSync(hubHtml, "utf-8")).toContain('name="description"');

    for (const lesson of LESSONS) {
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
