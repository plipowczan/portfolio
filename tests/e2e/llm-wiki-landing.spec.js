import { expect, test } from "@playwright/test";

test.describe("Landing LLM Wiki — treść", () => {
  test("renderuje hook, 3 wpisy indeksu, graf w tle, link RODO; repo zabramkowane", async ({
    page,
  }) => {
    await page.goto("/llm-wiki");

    await expect(page.locator("h1")).toContainText("rośnie sama");

    // 3 propsy wartości (wpisy index.md) — po tytułach, nie po globalnej
    // liczbie h2, żeby dodanie kolejnej sekcji nie psuło testu
    for (const title of ["Kumuluje się sama", "Index-first", "Przenośna"]) {
      await expect(page.locator("h2", { hasText: title })).toBeVisible();
    }

    // tło = rosnący graf
    await expect(page.locator("canvas[aria-hidden='true']")).toBeVisible();

    const privacyLink = page.getByRole("link", {
      name: /Polityce prywatności/i,
    });
    await expect(privacyLink).toHaveAttribute("href", "/privacy-policy");

    // GATE: brak linku do repo przed zapisem
    await expect(
      page.getByRole("link", { name: /Weź szablon/i })
    ).toHaveCount(0);
  });

  test("sekcja „Dla kogo jest ten kurs”: widoczna, z terminem + definicją, przed formularzem", async ({
    page,
  }) => {
    await page.goto("/llm-wiki");

    const audience = page.getByTestId("course-audience");
    await expect(
      audience.getByRole("heading", { name: "Dla kogo jest ten kurs" })
    ).toBeVisible();

    // Co najmniej jeden termin z definicją (współdzielone dane z hubem kursu).
    await expect(
      audience.locator("dt", { hasText: "Claude Code" })
    ).toBeVisible();
    await expect(
      audience.getByText(/agent od Anthropic działający w terminalu/i)
    ).toBeVisible();

    // Sekcja poprzedza formularz waitlisty w kolejności dokumentu.
    const sectionBeforeForm = await page.evaluate(() => {
      const section = document.querySelector('[data-testid="course-audience"]');
      const form = document.querySelector("form");
      return Boolean(
        section &&
          form &&
          section.compareDocumentPosition(form) &
            Node.DOCUMENT_POSITION_FOLLOWING
      );
    });
    expect(sectionBeforeForm).toBe(true);
  });

  test("blok obiekcji: pod formularzem, TLDR przy CTA, bez FAQPage i bez linków", async ({
    page,
  }) => {
    await page.goto("/llm-wiki");

    // TLDR obiekcji „po co płacić” w copy przy formularzu.
    await expect(
      page.getByText(/Metoda, szablon i kurs są darmowe/i)
    ).toBeVisible();

    // Blok obiekcji obecny, z pytaniem build-vs-buy jako akordeonem:
    // domyślnie zwinięty, odpowiedź rozwija się po kliknięciu.
    const faq = page.getByTestId("course-faq");
    const buildVsBuy = faq.locator("details", {
      has: page.locator("summary", {
        hasText: "Po co płacić, skoro sam to zbuduję?",
      }),
    });
    await expect(buildVsBuy.locator("summary")).toBeVisible();
    const answer = buildVsBuy.locator("p", { hasText: "Masz rację" });
    await expect(answer).toBeHidden();
    await buildVsBuy.locator("summary").click();
    await expect(answer).toBeVisible();

    // Blok występuje PO formularzu w kolejności dokumentu.
    const formBeforeBlock = await page.evaluate(() => {
      const block = document.querySelector('[data-testid="course-faq"]');
      const form = document.querySelector("form");
      return Boolean(
        form &&
          block &&
          form.compareDocumentPosition(block) &
            Node.DOCUMENT_POSITION_FOLLOWING
      );
    });
    expect(formBeforeBlock).toBe(true);

    // GATE: blok nie zawiera żadnych linków (repo i kurs zabramkowane do zapisu).
    await expect(faq.locator("a")).toHaveCount(0);

    // Landing nie emituje FAQPage JSON-LD (kanoniczne FAQ = hub kursu).
    const hasFaqSchema = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).some((s) => {
        try {
          return JSON.parse(s.textContent)["@type"] === "FAQPage";
        } catch {
          return false;
        }
      })
    );
    expect(hasFaqSchema).toBe(false);
  });
});

test.describe("Landing LLM Wiki — waitlist form", () => {
  test("zły email: pokazuje błąd i nie wysyła", async ({ page }) => {
    let posted = false;
    await page.route("**/api/subscribe", async (route) => {
      posted = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/llm-wiki");
    await page.locator("#waitlist-email").fill("nieprawidlowy");
    await page.getByRole("button", { name: /Zapisz mnie/i }).click();

    await expect(page.locator("#waitlist-email-error")).toBeVisible();
    expect(posted).toBe(false);
  });

  test("poprawny email: wysyła z source=waitlist, pokazuje success + odbramkowany repo link", async ({
    page,
  }) => {
    let body = null;
    await page.route("**/api/subscribe", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/llm-wiki");

    // przed zapisem repo zabramkowane
    await expect(
      page.getByRole("link", { name: /Weź szablon/i })
    ).toHaveCount(0);

    await page.locator("#waitlist-email").fill("test@example.com");
    await page.getByRole("button", { name: /Zapisz mnie/i }).click();

    await expect(page.getByText(/Jesteś na liście/i)).toBeVisible();
    expect(body).toMatchObject({
      email: "test@example.com",
      source: "waitlist",
    });

    // po zapisie repo link odbramkowany i celuje w publiczne repo
    const repoLink = page.getByRole("link", { name: /Weź szablon/i });
    await expect(repoLink).toHaveAttribute(
      "href",
      "https://github.com/plipowczan/second-brain-template"
    );

    // instrukcja „pierwsze 5 minut" obecna
    await expect(page.getByText(/pierwszego pytania/i)).toBeVisible();
  });

  test("email już zapisany (2xx z endpointu) → pokazuje ten sam ekran success", async ({
    page,
  }) => {
    // Endpoint jest idempotentny: duplikat też zwraca 2xx → sukces nie do odróżnienia.
    await page.route("**/api/subscribe", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/llm-wiki");
    await page.locator("#waitlist-email").fill("dupe@example.com");
    await page.getByRole("button", { name: /Zapisz mnie/i }).click();

    await expect(page.getByText(/Jesteś na liście/i)).toBeVisible();
  });

  test("błąd endpointu (500) → brak success, inline error, formularz zostaje", async ({
    page,
  }) => {
    await page.route("**/api/subscribe", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Upstream error" }),
      });
    });

    await page.goto("/llm-wiki");
    await page.locator("#waitlist-email").fill("test@example.com");
    await page.getByRole("button", { name: /Zapisz mnie/i }).click();

    // brak ekranu success
    await expect(page.getByText(/Jesteś na liście/i)).toHaveCount(0);
    // inline error widoczny
    await expect(page.getByText(/Coś poszło nie tak/i)).toBeVisible();
    // formularz nadal obecny
    await expect(page.locator("#waitlist-email")).toBeVisible();
  });
});
