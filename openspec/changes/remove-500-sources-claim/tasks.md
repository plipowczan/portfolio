# Tasks

## 1. Landing

- [x] 1.1 Replace the "Index-first" body in `VALUE_INDEX` in `src/pages/LlmWikiLanding.jsx` with the wording from design D2, and set `@sitemapUpdated` in the same file's header comment to `2026-10-13`; verify `git diff` on the file shows exactly those two changes

## 2. Lesson 1

- [x] 2.1 In `src/content/kurs/1-zaloz-katalog.md`, remove "do ~500 źródeł" from the closing sentence of "Dlaczego to działa bez RAG: progressive disclosure" (design D2, row 2); verify the sentence reads as in the design and the bold span is `bez embeddings i bez RAG`
- [x] 2.2 In the FAQ answer "Czym LLM Wiki różni się od RAG i baz wektorowych?", replace the last sentence per design D2, row 3 ("dobry indeks pozwala zawęzić …"); verify no other sentence of that answer changed
- [x] 2.3 Rewrite the FAQ entry "Co, gdy baza urośnie powyżej ~500 źródeł?" per design D3: new question "Co, gdy baza bardzo urośnie?", answer reduced to the one sentence that names the two options; verify the entry is still the last `###` of the FAQ and no sentence was added
- [x] 2.4 Set `updated: 2026-10-13` in the lesson's frontmatter; verify `node scripts/generate-content.mjs` runs without error
- [x] 2.5 Run the plain-Polish vocabulary grep from `.claude/rules/content/10-prosty-polski.md` against `src/content/kurs/*.md`; verify it returns no new match in the touched passages

## 3. Generated files

- [x] 3.1 Rebuild `src/data/generated/` with `node scripts/generate-content.mjs` and `public/llms-full.txt` (and `public/llms.txt`) with `node scripts/generate-llms-txt.js`; verify with `git diff --stat` that `llms-full.txt` changed only in the lesson 1 passages from tasks 2.1–2.3, and `llms.txt` is unchanged
- [x] 3.2 Regenerate `public/sitemap.xml` with `npm run blog:sitemap`; verify the diff is only the `<lastmod>` of `/llm-wiki` and of `/llm-wiki/kurs/1-zaloz-katalog`. If unrelated hunks appear in 3.1 or 3.2, stop and report them instead of committing them

## 4. Verification

- [x] 4.1 Search `500 źr` (case-insensitive), `500 sources` and `~500` in `src/` and `public/llms-full.txt`; verify there is no match that states a knowledge-base size limit, and that every remaining match is unrelated (the "~500 słów" note-length figures in two blog articles and their copy in `llms-full.txt`)
- [x] 4.2 Run `npm test` on the default browser set; verify `llm-wiki-landing`, `llm-wiki-course` and `llm-wiki-discoverable` pass, including the three landing thesis titles and the lesson-1 FAQPage JSON-LD
- [x] 4.3 Run `npm run build:prerender`; verify it finishes, the prerender output check passes, and `dist/llm-wiki/index.html` and `dist/llm-wiki/kurs/1-zaloz-katalog/index.html` contain no `500 źr`
- [x] 4.4 Run `openspec validate remove-500-sources-claim --strict`; verify it reports the change as valid
- [x] 4.5 DOX pass: add one Work Guidance bullet to `src/content/kurs/AGENTS.md` that records the trap and links the `course-content-style` requirement without restating it; state in the PR that `src/AGENTS.md` and `openspec/AGENTS.md` are unchanged (the landing marker rule and the change layout are untouched); verify `grep -rn "500 źr" --include=AGENTS.md .` finds nothing and `node scripts/dox-pass-check.mjs` has no owning doc left unexplained

## 5. Pull request

- [ ] 5.1 Open the PR with the three old/new pairs side by side in the description; verify the description also names what was done with the FAQ entry and why, and that the PR is not merged
- [ ] 5.2 Run the Codex review (`ss:review-fix`) on the PR and record each finding and its outcome in `openspec/changes/remove-500-sources-claim/review.md`; verify every finding is fixed or rejected with a reason
- [ ] 5.3 After the owner merges (outside this change): check live that `/llm-wiki`, `/llm-wiki/kurs/1-zaloz-katalog` and `/llms-full.txt` contain no `500 źr`
