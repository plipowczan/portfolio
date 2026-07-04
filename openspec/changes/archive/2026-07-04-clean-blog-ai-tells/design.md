## Context

26 blog markdown files (PL root + `en/`) contain 1354 em dashes and 150 en dashes. All 1354 em dashes are space-wrapped (` — `); a check for glued `\S—\S` returned 0, so a straight character swap is safe. En dashes appear both as space-wrapped sentence dashes and inside numeric ranges (`2020–2025`), which need different handling. The `portfolio-copywriting` skill already forbids these characters and ships a `grep` validation, but the content predates enforcement and the skill has no guidance on rhetorical (non-punctuation) AI-tells. This is a mechanical content migration plus a documentation edit — no application code.

## Goals / Non-Goals

**Goals:**
- Remove `—`, `–` from all blog markdown, deterministically and reversibly (git).
- Keep numeric ranges correct (`2020-2025`, no spurious spaces).
- Preserve Polish quotes `„ "` and all frontmatter.
- Add a forbidden-phrasing subsection (PL + EN) to the copywriter skill.
- Leave the repo passing the skill's own `grep` gate and the E2E blog tests.

**Non-Goals:**
- Rewriting sentences to remove the *rhetorical* AI-tells in existing posts (skill guidance is forward-looking only; retrofitting prose is out of scope).
- Touching `…` (0 occurrences).
- Bumping `modified` frontmatter dates — cosmetic edit per `data-storage` rules.
- Changing any non-blog markdown (docs, openspec, skills content other than the one file).

## Decisions

**Decision: Node script over `sed` for the replacement.**
Windows shell + UTF-8 + per-file globbing makes `sed -i` fragile; a small Node script using `fs` + `import.meta.glob`-style directory walk (or `fast-glob` already in deps) gives deterministic UTF-8 handling and lets us apply ordered rules. Alternative considered: `grep`-driven `sed` loop — rejected for encoding/edge-case risk on Win32.

**Decision: Ordered replacement rules.**
Apply in this order per file:
1. `(\d)[–—](\d)` → `$1-$2` (ranges: dash between digits → hyphen, no spaces).
2. Remaining `—` → `-` and remaining `–` → `-` (space-wrapped sentence dashes keep their spaces, yielding ` - `).
Order matters so ranges are handled before the blanket swap. Rationale: the two categories are disjoint after step 1, so step 2 can be a plain `String.replaceAll`.

**Decision: Scope-limit the walk to `src/content/blog/**/*.md`.**
Excludes `README.md`? No — README is documentation, not a post, but it lives in the same dir. Restrict to files the blog loader ingests: `*.md` excluding `_wsad.md`/`_`-prefixed. Simplest correct rule: process every `.md` under the blog tree; README dash cleanup is harmless. Confirm loader-excluded files are still left syntactically valid.

**Decision: Copywriter guidance as a new `###` subsection.**
Append after the existing "Znaki interpunkcyjne - unikaj AI-tells" subsection in `writing-style.md`, titled e.g. "Zwroty i konstrukcje - unikaj AI-tells", mirroring the ✅/❌ table + bullet style already there. Keeps one file, one format.

## Risks / Trade-offs

- **[En dash in a range gets spaced anyway]** → Step-1 regex runs before the blanket swap; add a unit-style assertion in the verify step (`grep -nP '\d - \d'` over blog should not increase vs baseline).
- **[Script corrupts UTF-8 / Polish diacritics on Win32]** → Read/write with explicit `utf8` encoding; diff a sample file after run; rely on git to review the full diff before commit.
- **[A dash was intentional in a code block]** → Blog posts use backtick code; em/en dashes inside fenced code would also be swapped. Low risk (dashes in code are rare and `-` is the valid char there anyway), but flag any fenced-code hit in the diff review.
- **[E2E/prerender breakage]** → None expected; run `npm test` blog specs as the gate.

## Migration Plan

1. Snapshot baseline counts (`grep -c` per char) for before/after evidence.
2. Run the Node replacement script over `src/content/blog/**/*.md`.
3. Run validation gate: `grep -nP '[\x{2014}\x{2013}\x{2026}]'` must be empty.
4. Review full `git diff` (spot-check ranges, code blocks, quotes).
5. Edit `writing-style.md`: add forbidden-phrasing subsection.
6. Run `npm test` (blog E2E) — must pass.
7. Rollback: `git checkout -- src/content/blog` if any gate fails.
