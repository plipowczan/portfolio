import { expect, test } from "@playwright/test";

/**
 * Guards the move off fonts.googleapis.com / fonts.gstatic.com.
 *
 * The value of self-hosting is entirely "no third-party origin on the critical
 * path", so the load-bearing assertion is the negative one: zero requests to
 * Google. A stray @import or a re-added <link> would silently undo the change
 * while everything still looked correct on screen.
 */

const GOOGLE_FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

/** Records every request to a Google font origin during one page load. */
const collectGoogleFontRequests = (page) => {
  const hits = [];
  page.on("request", (req) => {
    const url = req.url();
    if (GOOGLE_FONT_HOSTS.some((h) => url.includes(h))) hits.push(url);
  });
  return hits;
};

for (const path of ["/", "/blog", "/blog/slabe-strony-claude-code", "/en/"]) {
  test(`${path} loads no fonts from Google`, async ({ page }) => {
    const hits = collectGoogleFontRequests(page);
    await page.goto(path, { waitUntil: "load" });
    // Give late/idle-callback work a chance to fire a stray request.
    await page.waitForTimeout(1500);
    expect(hits, `requests to Google font origins: ${JSON.stringify(hits)}`).toEqual([]);
  });
}

test("serves the body font from our own origin", async ({ page }) => {
  const fontRequests = [];
  page.on("response", (res) => {
    if (res.url().endsWith(".woff2")) {
      fontRequests.push({ url: res.url(), status: res.status() });
    }
  });

  await page.goto("/", { waitUntil: "load" });
  await page.waitForTimeout(1500);

  expect(fontRequests.length).toBeGreaterThan(0);
  for (const r of fontRequests) {
    expect(r.status).toBe(200);
    expect(new URL(r.url).origin).toBe(new URL(page.url()).origin);
  }
  expect(fontRequests.some((r) => /inter-latin/.test(r.url))).toBe(true);
});

test("preloads the always-used latin subset, crossorigin", async ({ page }) => {
  await page.goto("/");
  // Matched by pattern, not literal path: the file is fingerprinted in a
  // production build, so its name differs between dev and dist.
  const preload = page.locator('link[rel="preload"][as="font"]');
  await expect(preload).toHaveCount(1);

  const href = await preload.getAttribute("href");
  // The `(?!-ext)` is the whole point. `inter-latin-ext-<hash>.woff2` starts
  // with `inter-latin` too, and preloading it would pull the 83kB diacritics
  // subset on every route instead of the 47kB one — which is exactly the bug
  // this plugin shipped with first time round. The optional group covers the
  // fingerprint, which is present in a build and absent in dev.
  expect(href).toMatch(/inter-latin(?!-ext)(-[A-Za-z0-9_-]+)?\.woff2$/);
  // Without crossorigin the preload is discarded and the font fetched twice.
  await expect(preload).toHaveAttribute("crossorigin", /.*/);
});

test("Inter actually renders, and Polish diacritics use it too", async ({ page }) => {
  await page.goto("/blog/slabe-strony-claude-code");
  await page.waitForSelector("h1");

  // document.fonts is the real check: if @font-face failed, the computed
  // font-family would still say "Inter" while nothing was ever loaded.
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].map((f) => ({ family: f.family, status: f.status }));
  });
  expect(loaded.some((f) => f.family.includes("Inter") && f.status === "loaded")).toBe(true);

  // latin-ext carries ą ć ę ł ń ó ś ź ż. If it were dropped, Polish text would
  // silently fall back to a system font while ASCII stayed correct.
  const polishUsesInter = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.check('16px "Inter"', "ąćęłńóśźż");
  });
  expect(polishUsesInter).toBe(true);
});
