import { expect, test } from "@playwright/test";

test.describe("SEO — llms.txt / llms-full.txt", () => {
  test("llms.txt zwraca 200 i zawiera header '# Pawel Lipowczan'", async ({
    request,
  }) => {
    const res = await request.get("/llms.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("# Pawel Lipowczan");
  });

  test("llms-full.txt zwraca 200 i zawiera treść znanego posta", async ({
    request,
  }) => {
    const res = await request.get("/llms-full.txt");
    expect(res.status()).toBe(200);
    const body = await res.text();
    // One of the known published posts
    expect(body).toContain("15 hacków do Cursor.sh");
  });
});
