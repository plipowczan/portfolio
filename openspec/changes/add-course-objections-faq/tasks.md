# Tasks: add-course-objections-faq

## 1. Content adaptation (plain Polish)

- [x] 1.1 Adapt objection 1 (grep vs index) into a lesson-1 FAQ entry: question + 2–4 sentence snippet answer, index-first/grep-second framing, honest "when grep alone suffices" line; define terms at first use for that lesson
- [x] 1.2 Enrich lesson 4's existing "Czym `/qa` różni się od zwykłego zapytania czatu?" answer with objection 2 material (training memory vs grounded citations, retrieval discipline, repeatability); no duplicate question
- [x] 1.3 Write hub FAQ copy for objections 3 (what's the point / failure modes / local-first degradation), 4 (build vs buy: free method vs ~300 processed notes), and condensed 1 (grep vs index) as data entries
- [x] 1.4 Write the landing TLDR line (1–2 sentences near the CTA) and the landing Q&A subset (build-vs-buy focused), with no repo/course links in the block
- [x] 1.5 Run the shared vocabulary grep from `.claude/rules/content/10-prosty-polski.md` over `src/content/kurs/*.md` and manually over the new copy in `src/data/courseFaq.js`; fix all prose hits

## 2. Data + components

- [x] 2.1 Create `src/data/courseFaq.js`: ordered entries `{ id, question, answer, surfaces }`, header comment pointing at the source objections file (internal `obiekcje-klientow.md`, private and out-of-repo) as the source of truth
- [x] 2.2 Create `src/components/sections/CourseFaq.jsx` after the `CourseAudience` pattern: living-note aesthetic (`faq.md` label, `[[question]]` styling), accepts the subset of entries to render, named data imports. Deviation: PropTypes dropped — `prop-types` is not a project dependency and importing it broke the Vite module graph; props documented via JSDoc instead (rules updated accordingly)
- [x] 2.3 Wire `CourseFaq` into `CourseHub.jsx` (full entry set) and emit FAQPage JSON-LD via `StructuredData` + `generateFAQSchema()` built directly from the data array (no DOM extraction)
- [x] 2.4 Wire the TLDR line and the `CourseFaq` subset into `LlmWikiLanding.jsx` **below** the form block; no `StructuredData` on the landing; do not touch form/submit logic

## 3. Lesson markdown updates

- [x] 3.1 Add the grep-vs-index FAQ entry to `src/content/kurs/1-zaloz-katalog.md` (H3 question + paragraph answer inside the existing `## FAQ`)
- [x] 3.2 Update the `/qa` FAQ answer in `src/content/kurs/4-pytania-i-zarzadzanie.md` per task 1.2

## 4. Tests

- [x] 4.1 Extend the hub Playwright spec: FAQ section renders with ≥3 entries; `FAQPage` JSON-LD present with matching questions
- [x] 4.2 Extend the landing Playwright spec: objections block present after the form in document order; build-vs-buy question rendered; no `FAQPage` JSON-LD; no repo/`/llm-wiki/kurs` links inside the block pre-signup
- [x] 4.3 Run the full suite (`npm test`) and fix regressions

## 5. Verification

- [x] 5.1 Run `npm run build:prerender`; assert `dist/llm-wiki/kurs/index.html` contains FAQ question texts + FAQPage JSON-LD, and `dist/llm-wiki/index.html` contains the build-vs-buy question with no FAQPage JSON-LD
- [x] 5.2 Verify lesson 1's rendered FAQPage schema includes the new grep-vs-index question (client render)
- [x] 5.3 Check whether `public/llms-full.txt` embeds hub/landing content; regenerate if the pipeline covers these pages
- [x] 5.4 Visual pass on landing + hub (desktop/mobile): note aesthetic intact, form not pushed down, TLDR reads as one line
