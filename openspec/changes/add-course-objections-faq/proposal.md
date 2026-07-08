# Proposal: add-course-objections-faq

## Why

Sales conversations and social comments around the LLM Wiki course keep raising the same five objections (collected in the internal `obiekcje-klientow.md` notes, private and out-of-repo): "grep is enough", "why `/qa`", "what's the point at all / what if it breaks", "why pay if I can build it myself", "RAG vs structural retrieval". None of them is addressed on the course surfaces today — the conversion-critical one (objection 4, "why pay") is invisible exactly where the waitlist CTA asks for the signup. Addressing them on-page also feeds FAQPage/GEO visibility.

## What Changes

- **Lesson FAQs (markdown only):** objection 1 (grep vs index) becomes a new FAQ entry in lesson 1; objection 2 (`/qa` vs asking directly) enriches the existing lesson 4 FAQ answer (no duplicate question). Existing FAQPage JSON-LD extraction picks these up automatically.
- **Course hub (`/llm-wiki/kurs`):** new FAQ section rendering objections 3 (what's the point / failure modes) and 4 (build vs buy) plus a condensed objection 1, fed from a new `src/data/courseFaq.js`, with FAQPage JSON-LD generated directly from that data (hub is the only non-lesson page emitting FAQ schema).
- **Landing (`/llm-wiki`):** new `obiekcje.md`-styled block **below** the signup form — 1–2 sentence TLDR of objection 4 near the CTA, full Q&A lower for readers who scroll. No FAQPage schema on the landing (avoids duplicate markup with the hub). Block contains no repo/course links, preserving the pre-signup gating requirement.
- **Content pipeline:** all published copy is an adaptation (not a copy) of the objections file, rewritten through the plain-Polish rules (`.claude/rules/content/10-prosty-polski.md`) with the shared vocabulary grep gate; terms defined at first use per document.
- **Out of scope:** objection 5 (RAG vs structural/LSP retrieval) ships later as a standalone blog article ("RAG ragowi nierówny") via `/blog-article-writer` — jargon-heavy, peer-level tone doesn't fit the course register. Backlog item, not part of this change.

## Capabilities

### New Capabilities

<!-- none — this change extends two existing page capabilities -->

### Modified Capabilities

- `llm-wiki-course`: (1) hub gains a FAQ/objections section with FAQPage JSON-LD; (2) the "content sourced 1:1 from the deliverable" requirement is relaxed to additionally allow objection-derived FAQ entries sourced from the objections file; (3) lessons 1 and 4 FAQ coverage extended.
- `llm-wiki-landing`: landing gains an objections block below the signup form (TLDR at CTA + full Q&A lower), explicitly without FAQPage schema and without gated links.

## Impact

- **Code:** `src/pages/CourseHub.jsx`, `src/pages/LlmWikiLanding.jsx`, new `src/components/sections/CourseFaq.jsx` (pattern: `CourseAudience`), new `src/data/courseFaq.js` (pattern: `coursePrerequisites.js`).
- **Content:** `src/content/kurs/1-zaloz-katalog.md`, `src/content/kurs/4-pytania-i-zarzadzanie.md`.
- **SEO/GEO:** FAQPage JSON-LD added on the hub (lessons already emit it); prerendered HTML for hub/landing changes; `public/llms-full.txt` may need regeneration if it embeds page content.
- **Tests:** Playwright specs covering hub/landing render will need new assertions (FAQ section present, landing block below form, no schema on landing).
- **Dependencies:** none new. No API, no build changes.
- **Interaction with in-flight work:** `migrate-waitlist-to-resend` touches the same landing file; this change only adds a sibling block below the form and does not modify form logic.
