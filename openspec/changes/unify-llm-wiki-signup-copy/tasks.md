# Tasks

## 1. Landing copy

- [x] 1.1 In `src/pages/LlmWikiLanding.jsx` replace the paragraph above the form, the success header and text, and the `SEO` description per design D2; delete the closing line of the success screen; set `@sitemapUpdated` to `2026-10-15`; verify `git diff` on the file shows exactly those changes and no others
- [x] 1.2 Run the vocabulary grep from `.claude/rules/content/10-prosty-polski.md` against `src/pages/LlmWikiLanding.jsx`; verify it returns no match in the new strings. Run the character gate from `portfolio-copywriting` (no em dash, en dash or ellipsis character in the new strings)
- [x] 1.3 Search `ruszy`, `ruszył`, `będą w kursie` in `src/pages/LlmWikiLanding.jsx`; verify no match remains

## 2. Tests

- [x] 2.1 `tests/e2e/llm-wiki-landing.spec.js`: move the three `Jesteś na liście` assertions to `Adres zapisany`; add one test for the copy rule (before submit the form paragraph and the meta description carry no launch wording and say news arrives by email; after submit the success screen says the address is saved and carries no launch wording); verify the file passes on the default browser set
- [x] 2.2 `tests/e2e/llm-wiki-course.spec.js`: move the one `Jesteś na liście` assertion to `Adres zapisany`; verify the file passes
- [x] 2.3 Search `Jesteś na liście` in `src/`, `tests/` and `public/`; verify no match remains

## 3. Generated files

- [x] 3.1 Regenerate `public/sitemap.xml` with `npm run blog:sitemap`; verify with `git diff` that the only changed line is the `<lastmod>` of `/llm-wiki`. If unrelated hunks appear, stop and report them instead of committing them

## 4. Verification

- [x] 4.1 Run `npm run test:unit`; verify 14 of 14 pass (checked 2026-10-15)
- [x] 4.2 Run the e2e specs `llm-wiki-landing`, `llm-wiki-course`, `llm-wiki-discoverable`, `seo-metadata-invariants`, `a11y-baseline` on the default browser set; verify they pass, and report any failure that is not caused by this change as such (176 passed on `chromium` and `Mobile Chrome`, 2026-10-15; the new copy test was also run against the old page and fails there at its first assertion)
- [x] 4.3 Run `npm run build:prerender`; verify it finishes, the prerender output check passes, and `dist/llm-wiki/index.html` contains "Adres zapisany" nowhere (the success screen is not prerendered) and contains the new meta description (build exit 0, 102 routes rendered, output check and payload budget passed; the prerendered landing carries the new paragraph and meta description and none of "Adres zapisany", "Jesteś na liście", "gdy ruszy kurs"; no `RESEND_API_KEY` or `re_` key in `dist/assets`; 2026-10-15)
- [x] 4.4 Run `openspec validate unify-llm-wiki-signup-copy --strict` and `openspec validate migrate-waitlist-to-resend --strict`; verify both report the change as valid
- [x] 4.5 DOX pass: add one Work Guidance bullet to `src/AGENTS.md` that records the trap and links the `llm-wiki-landing` requirement without restating it; remove the stale `npm run test:unit` line from `api/AGENTS.md`; state in the PR which other `AGENTS.md` files are unchanged; run `node scripts/dox-pass-check.mjs`

## 5. Spec sync and pull request

- [x] 5.1 Sync the delta into `openspec/specs/llm-wiki-landing/spec.md` (success requirement restated, copy requirement added); verify `openspec validate --specs` passes (26 of 26). `--strict` still fails 13 specs, `llm-wiki-landing` among them, on the placeholder Purpose line that predates this change; fixing those is outside it
- [x] 5.2 Open the PR against `main` with the old/new copy table in the description; verify the PR is not merged (PR #50, open)
- [x] 5.3 Run the Codex review (`ss:review-fix`) on the PR and record each finding and its outcome in `openspec/changes/unify-llm-wiki-signup-copy/review.md`; verify every finding is fixed or rejected with a reason (round 1: no findings)
- [ ] 5.4 After the owner merges (outside this change): archive this change with `/opsx:archive`; check live that `/llm-wiki` shows the new paragraph above the form
