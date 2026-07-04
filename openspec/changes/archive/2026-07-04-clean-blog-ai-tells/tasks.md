## 1. Baseline

- [x] 1.1 Record before-counts: `grep -roP '—|–|…' src/content/blog --include=*.md | wc -l` and per-char counts (PL vs en/) for the execution report
- [x] 1.2 Confirm no glued em dashes remain to worry about: `grep -roP '\S—\S' src/content/blog --include=*.md` returns empty

## 2. Content cleanup

- [x] 2.1 Write a Node script (scratchpad) that walks `src/content/blog/**/*.md` and applies ordered rules: (a) `(\d)[–—](\d)` → `$1-$2`, (b) remaining `—` → `-`, (c) remaining `–` → `-`; read/write as UTF-8
- [x] 2.2 Run the script; leave Polish quotes `„ "` and all frontmatter untouched
- [x] 2.3 Validation gate: `grep -nP '[\x{2014}\x{2013}\x{2026}]' src/content/blog/**/*.md` returns empty (exit 1)
- [x] 2.4 Range check: `grep -rnP '\d - \d' src/content/blog --include=*.md` shows no ranges accidentally spaced (5 hits are legit spaced thousands-ranges, e.g. `5,000 - 50,000`, not corruption)
- [x] 2.5 Review full `git diff src/content/blog` — spot-check a PL file, an en/ file, a numeric range, and any fenced-code hit

## 3. Copywriter skill

- [x] 3.1 Add subsection "Zwroty i konstrukcje - unikaj AI-tells" to `.claude/skills/portfolio-copywriting/references/writing-style.md`, after the existing punctuation subsection
- [x] 3.2 Populate ✅/❌ examples (PL + EN) for: antithesis-dash ("To nie X - to Y" / "It's not just X, it's Y"), empty openers, empty closers, forced rule-of-three, meta-hedging ("Warto zauważyć" / "It's worth noting"), empty intensifiers, invitation phrases ("Zanurzmy się" / "Let's dive in" / "delve into")
- [x] 3.3 Confirm the guidance explicitly covers EN posts (examples in both languages)

## 4. Verify

- [x] 4.1 Run blog E2E: `npm test` (or blog-scoped specs) — must pass (15 passed, 4.5m)
- [x] 4.2 Re-run validation gate (2.3) to confirm still empty after any edits (empty, exit 1)
- [x] 4.3 Record after-counts and diff summary for `/opsx:verify` (0/0/0 remaining; 27 files, 1285/1266)
