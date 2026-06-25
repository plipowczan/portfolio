import { expect, test } from "@playwright/test";

test.describe("Landing LLM Wiki — treść", () => {
  test("renderuje hook, 3 wpisy indeksu, graf w tle, link RODO; repo zabramkowane", async ({
    page,
  }) => {
    await page.goto("/llm-wiki");

    await expect(page.locator("h1")).toContainText("rośnie sama");

    // 3 propsy wartości = jedyne h2 na stronie (wpisy index.md)
    await expect(page.locator("h2")).toHaveCount(3);

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
});

test.describe("Landing LLM Wiki — waitlist form", () => {
  test("zły email: pokazuje błąd i nie wysyła", async ({ page }) => {
    let posted = false;
    await page.route("https://formspree.io/f/xblqpqab", async (route) => {
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
    await page.route("https://formspree.io/f/xblqpqab", async (route) => {
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
});
