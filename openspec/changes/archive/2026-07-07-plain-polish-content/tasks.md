## 1. Shared plain-Polish rules file

- [x] 1.1 Create `.claude/rules/content/10-prosty-polski.md` with: writing principles (average sentence ≤ ~20 words, one thought per sentence), replacement table (ingest→wczytanie, fallback→awaryjnie, merge→scalenie [prose], stale→przeterminowany, graveyard→`_graveyard/` [path form], renderować→wypełniać szablon, klastrować się→układać się w grupę, dojrzeć [review sense]→przejrzeć, arsenał→zestaw, zżyty→dopracowany, dopieszczony→sprawdzony), keep-list with the UI/file-system test (vault, frontmatter, markdown, git, RAG, OKF, commit, command names, technology names), banned Polonized verbs (ingestować, mergować, renderować, deployować, commitować in prose), ornament rules (adjective needs a number or example; max one metaphor per section), first-use gloss format with ✅/❌ example, and the validation grep with the forbidden-word regex
- [x] 1.2 Add the file to the Rules System list in `CLAUDE.md` (one line under Universal Rules)

## 2. Skill updates

- [x] 2.1 `portfolio-copywriting/references/writing-style.md`: rewrite the "Język techniczny: Kiedy English vs Polish" section — default Polish when a natural equivalent exists, English only for names/commands/acronyms; replace inline term lists with a link to the rules file; add the first-use-gloss rule (✅/❌ pair) and the ornament-restraint subsection next to the existing AI-tells sections
- [x] 2.2 `portfolio-copywriting/SKILL.md`: update the "Jezyk" row and Wytyczne pisania to point at `.claude/rules/content/10-prosty-polski.md`
- [x] 2.3 `blog-article-writer/SKILL.md` + `subcommands/execute.md`: replace the "Language"/"Language Guidelines" inline lists ("Keep English: workflow, skills…") with a reference to the rules file; keep the alternateSlug/bilingual rules untouched
- [x] 2.4 `blog-article-writer/subcommands/validate.md`: add a Level 2 vocabulary gate — grep the validated article with the forbidden-word regex from the rules file; a match fails validation before OG generation (mirror the existing em-dash gate wording)

## 3. Course lesson fixes (prose only — commands, file names, code blocks, simulated output unchanged)

- [x] 3.1 Lesson 3 (`3-pierwszy-ingest.md`): "Jedno wiadomość" → "Jeden wniosek" (l.71); "ingestowałeś" → "wczytałeś" (l.29); "Po ingeście" / "bez ingestu" → "po `/ingest`" / "bez `/ingest`" (prose occurrences, incl. Pułapki l.79-82); "fallback Whisper" → "awaryjnie Whisper" (l.29, l.92); FAQ "robi **merge**" → "robi **scalenie**" (l.96); "coś się klastruje" → "pliki układają się w grupę" (l.37); "żebyś dojrzał" / "dojrzyj ją" → "żebyś to przejrzał" / "przejrzyj ją" (l.45, l.81)
- [x] 3.2 Lesson 4 (`4-pytania-i-zarzadzanie.md`): "treść stale (>1 rok bez review)" → "przeterminowana treść (>1 rok bez przeglądu)" (l.58); "stuby" → gloss or "niedokończone noty (stub)" (l.58); table "do graveyard" → "do `_graveyard/`" (l.83)
- [x] 3.3 Lesson 5 (`5-rozwoj-i-publikacja.md`): "arsenał komend" → "zestaw komend" (l.8, l.10); "zżytej/zżytej bazy" → "bazy dopracowanej miesiącami" (l.51, l.95); "dopieszczone skille" → "sprawdzone skille" (l.95); "najmocniejsza dźwignia «baza rośnie sama»" → simpler phrasing (l.32); "z graveyard z powrotem" → "z `_graveyard/` z powrotem" (l.87); "kompas, nie koparka" stays (one metaphor per section)
- [x] 3.4 Lesson 2 (`2-onboarding.md`): "Renderuje trzy pliki schematu" → "Wypełnia trzy pliki schematu" (l.83); "wszystkie trzy rendery się powiodą" → "generowanie wszystkich trzech plików się powiedzie" (l.84, l.179); "renderuje je do finalnych plików" → "wypełnia je wartościami do finalnych plików" (l.179); "do renderu schemy" → "do generowania plików schematu" (l.187); `render.py` filename stays; adjust image alt text l.90 accordingly
- [x] 3.5 First-use glosses per lesson (per-lesson scope — each lesson glosses its own first occurrence): lesson 1 "vault (tak Obsidian nazywa folder z notatkami)", "frontmatter (blok metadanych na początku pliku)", "progressive disclosure (agent czyta od ogółu do szczegółu, tylko tyle, ile trzeba)"; lesson 3 "transkrypt", "klaster (grupa plików o wspólnym temacie)"; lesson 4 "RAG" if named; lesson 5 "MCP (protokół, którym narzędzia AI podłączają się do zewnętrznych źródeł)", "ekstrakt" — audit all five lessons against the rule, list above is the known minimum
- [x] 3.6 Run the forbidden-word grep from the rules file over `src/content/kurs/*.md` → no prose matches; re-read lessons 1 and 3 excerpts (frontmatter `excerpt:`) for compliance too

## 4. Audience & prerequisites section (landing + hub)

- [x] 4.1 Derive the prerequisite-concept list from the lessons (minimum: LLM, agent, markdown, git, Claude Code; verify whether RAG/embeddings actually appear in course prose before including them) and write one-sentence plain-Polish definitions following the rules file
- [x] 4.2 Create the shared data module `src/data/coursePrerequisites.js` exporting the audience description + concept list (named export, plain array of `{ term, definition }`)
- [x] 4.3 `src/pages/LlmWikiLanding.jsx`: render the "Dla kogo jest ten kurs" section from the shared module, before the waitlist form in document order, reusing existing section styling (dark surface, mono motif) — no new design language
- [x] 4.4 `src/pages/CourseHub.jsx`: render the same section from the same module; verify the lesson index stays above the fold on desktop (1280×800)
- [x] 4.5 E2E: extend `tests/e2e/llm-wiki-landing.spec.js` and `llm-wiki-course.spec.js` — section heading visible on both pages, at least one concept term + definition rendered, landing section precedes the form

## 5. Verification

- [x] 5.1 `npm run build:prerender` → `dist/llm-wiki/index.html` and `dist/llm-wiki/kurs/index.html` contain the section heading; no EN mirror appears; lesson pages still prerender
- [x] 5.2 Run affected E2E specs → green; existing waitlist/course scenarios unaffected
- [x] 5.3 Final gates: em-dash grep + forbidden-word grep over `src/content/kurs/*.md` both clean; `git diff` review confirms no command/file-name/code-block changes in lessons
