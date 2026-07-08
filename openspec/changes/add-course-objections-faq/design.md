# Design: add-course-objections-faq

## Context

Five recurring customer objections are documented in `agentic-ai-private/context/plsoft/projects/SECOND_BRAIN_KURS/data/obiekcje-klientow.md` (format: objection → why it lands → substantive answer → one-liner for the client). The course surfaces don't address them:

- **Lessons** (`src/content/kurs/*.md`): all five already have `## FAQ` sections; `CourseLesson.jsx` extracts them from the rendered DOM via `src/utils/faqExtractor.js` and emits FAQPage JSON-LD. Lesson 1 covers "LLM Wiki vs RAG" but not "grep vs index"; lesson 4 has a thin "`/qa` vs chat" answer.
- **Hub** (`src/pages/CourseHub.jsx`): JSX page, no FAQ, no schema machinery.
- **Landing** (`src/pages/LlmWikiLanding.jsx`): minimal "living note" page (blocks labeled `index.md`, `dla-kogo.md`); CTA is the waitlist for paid knowledge packs — exactly what objection 4 questions. Repo/course links are gated behind signup (spec requirement).

Shared-copy pattern already exists: `CourseAudience.jsx` + `src/data/coursePrerequisites.js` render the same data on landing + hub so copy can't drift.

Content constraints: `.claude/rules/content/10-prosty-polski.md` (plain Polish, vocabulary grep gate, definitions at first use per document) and the `course-content-style` spec.

## Goals / Non-Goals

**Goals:**

- Address objections 1–4 on the surface where each naturally lives (lesson depth vs hub aggregation vs landing conversion).
- Emit FAQPage JSON-LD for the new hub FAQ; keep exactly one non-lesson page emitting FAQ schema.
- Reuse existing patterns (data file + section component, DOM-based lesson extraction) — no new dependencies.
- All new copy passes the plain-Polish gates.

**Non-Goals:**

- Objection 5 (RAG vs structural/LSP retrieval) — separate blog article, backlog.
- Any change to the waitlist form logic (in-flight `migrate-waitlist-to-resend` owns it).
- EN translations (course surfaces are PL-only by spec).
- Extending the vocabulary grep gate to JS data files (checked manually in review instead).

## Decisions

### D1: Distribution of objections across surfaces

| Objection | Surface | Form |
|---|---|---|
| 1. grep vs index | Lesson 1 FAQ (new question) + hub FAQ (condensed) | Indexes are lesson 1's subject matter |
| 2. `/qa` vs asking directly | Lesson 4 FAQ — enrich the existing "Czym `/qa` różni się od zwykłego zapytania czatu?" answer | Avoids a near-duplicate question in the same FAQPage schema |
| 3. what's the point / failure modes | Hub FAQ (full) + landing TLDR reference | Top-of-funnel "why", belongs on aggregation page |
| 4. build vs buy | Landing (TLDR at CTA + full Q&A below form) + hub FAQ | THE conversion objection; must sit next to the signup ask |
| 5. RAG nierówny | Out of scope (blog article) | Peer-level jargon breaks the course register |

**Alternative considered:** all objections in one hub FAQ — rejected: technical objections lose lesson context, hub bloats, landing conversion moment stays unaddressed.

### D2: Hub FAQ = data file + component + schema from data (not DOM extraction)

New `src/data/courseFaq.js` exporting an ordered list of `{ id, question, answer, surfaces }` entries; new `src/components/sections/CourseFaq.jsx` rendering them in the living-note aesthetic (`faq.md` label, `[[question]]` styling), following `CourseAudience.jsx`. FAQPage JSON-LD built directly from the data array and emitted via the existing `StructuredData` component and `generateFAQSchema()` (reused — it takes `questions[]` + `url`, no DOM needed).

**Alternative considered:** reuse `extractFAQ` DOM extraction like lessons do — rejected: hub content is structured data already; DOM extraction adds a timing effect (150 ms timeout) and fragility for no benefit. Extraction exists for markdown, where the DOM is the only structured source.

### D3: Landing gets a filtered subset of the same data, no schema

`CourseFaq` accepts the entries to render (or a `variant` prop); the landing renders the objection-4-focused subset **below** the form block, plus a 1–2 sentence TLDR line in the existing copy above the form. No `StructuredData` on the landing. Landing entries render as a native `details`/`summary` accordion, collapsed by default — the block stays compact on the conversion page and answers load with zero JS state.

**Why no landing schema:** duplicate FAQPage markup across two closely-linked pages is a negative signal; the hub is the canonical FAQ location. The landing block also must contain **no repo or `/llm-wiki/kurs` links** — the pre-signup gating requirement in `llm-wiki-landing` forbids them before a successful submit.

### D4: Content is adapted, not copied

`obiekcje-klientow.md` stays the source of truth (sales format, jargon allowed). Portfolio copy is a plain-Polish adaptation: rewrite anglicisms ("pinpointuje", "zgreppujesz palcami" won't pass the gate), define terms at first use per document (RAG, embeddings, grep are keep-list but still need a gloss), answers in FAQ snippet style (2–4 sentences, key info first, per `docs/faq/FAQ_GUIDELINES.md`). New objections flow: source file first, portfolio second.

### D5: Relax the "1:1 from deliverable" course requirement via delta

`llm-wiki-course` requires content to reproduce the deliverable 1:1. New FAQ entries are objection-sourced additions, so the requirement gets a delta: additions sourced from the objections file are allowed in lesson FAQ sections, provided they pass the course content-style gates.

## Risks / Trade-offs

- [Landing grows below the fold, diluting the minimal note aesthetic] → TLDR stays a single line near the CTA; the full block sits below the form where it can't push the form down; same visual language as existing blocks.
- [Hub FAQ answers drift from the source objections file over time] → header comment in `courseFaq.js` pointing at the source path; new objections land in the source file first (workflow note in that file already says so).
- [Playwright suite asserts current landing/hub structure] → run `npm test` after implementation; add assertions for the new sections rather than relying on incidental selectors.
- [Merge friction with `migrate-waitlist-to-resend` on `LlmWikiLanding.jsx`] → this change only inserts sibling JSX blocks; no edits inside the form/submit handler. Rebase is trivial.
- [Google rarely shows FAQ rich results for non-authority sites] → accepted; the schema targets GEO/AI-answer consumption, not SERP rich results.

## Open Questions

- None blocking. Exact PL wording of each entry is authored during implementation and gated by the grep + review.
