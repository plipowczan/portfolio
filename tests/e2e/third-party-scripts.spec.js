import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Longer than the 3 s `requestIdleCallback` timeout the removed ClickRank
 * injector used. An assertion that nothing was requested has to outlast the
 * deferral, or it passes before the code it is meant to catch could run.
 */
const PAST_INJECTION_WINDOW_MS = 3500;

const isClickRankHost = (url) => /(^|\.)clickrank\.ai$/i.test(new URL(url).hostname);

// ClickRank was removed on 2026-10-28 (PL-463). The build check in
// scripts/verify-prerender-output.mjs sees a tag baked into static HTML; this
// spec sees the other path back in — application code injecting it at runtime.
// Requirement: openspec/specs/performance-third-party-scripts
test.describe("Skrypty zewnętrzne — ClickRank usunięty", () => {
  for (const path of ["/", "/blog/spec-driven-seo-portfolio-qamera-ai"]) {
    test(`${path}: żadne żądanie nie trafia do clickrank.ai`, async ({ page }) => {
      const attempted = [];
      page.on("request", (request) => {
        if (isClickRankHost(request.url())) attempted.push(request.url());
      });

      await page.goto(path);
      await page.waitForTimeout(PAST_INJECTION_WINDOW_MS);

      expect(attempted).toEqual([]);
      await expect(page.locator('script[src*="clickrank"]')).toHaveCount(0);
    });
  }

  test("CSP w vercel.json nie dopuszcza js.clickrank.ai", () => {
    const config = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf-8"));
    const csp = config.headers
      .flatMap((entry) => entry.headers ?? [])
      .find((h) => h.key === "Content-Security-Policy-Report-Only")?.value;

    expect(csp, "Report-Only CSP must be declared in vercel.json").toBeDefined();
    expect(csp).not.toContain("clickrank");
  });
});
