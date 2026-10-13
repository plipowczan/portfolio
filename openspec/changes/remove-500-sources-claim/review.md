# Review record — remove-500-sources-claim

## Round 1 — 2026-10-13 — reviewed 9461081

| id | sev | where | finding | outcome |
|---|---|---|---|---|
| R1-1 | P2 | src/content/kurs/AGENTS.md:56-61 | The new Work Guidance bullet restates the scale rule owned by the `course-content-style` delta, although the root contract says one rule lives in one place and the bullet itself says not to restate it | fixed in 528632e |

Checks: `npm run test:unit` — 14/14 passed; `node scripts/generate-content.mjs` — index generated (64 articles, 8 lessons); `openspec validate remove-500-sources-claim --strict` — valid; `grep -rniE "500 (źr|sources)" src public/llms-full.txt public/llms.txt public/sitemap.xml` — zero hits. The full Playwright suite and `npm run build:prerender` were run before the review (421 passed, 26 skipped, 0 failed; prerender output check passed) and not repeated: the round changed one `AGENTS.md`, which no reader of `src/content/kurs/` loads.
