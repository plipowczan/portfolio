import { expect, test } from "@playwright/test";

test.describe("Landing LLM Wiki — treść", () => {
  test("renderuje hook, 3 wpisy indeksu, graf w tle, link RODO; repo zabramkowane", async ({
    page,
  }) => {
    await page.goto("/llm-wiki");

    await expect(page.locator("h1")).toContainText("rośnie sama");

    // 3 propsy wartości (wpisy index.md) + nagłówek sekcji "Dla kogo jest ten kurs"
    await expect(page.locator("h2")).toHaveCount(4);

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
