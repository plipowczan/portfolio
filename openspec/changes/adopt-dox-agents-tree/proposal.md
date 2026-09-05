## Why

The root `AGENTS.md` is 20 KB of confidently wrong context: it references a `.cursorrules` file that does not exist (4 times), a `src/utils/blogLoader.js` that was replaced by `src/data/blogPosts.js`, "8+ blog articles" when there are 61, and lists shipped features (i18n, Resend waitlist, course pages) as unstarted roadmap items. It has drifted since 2026-01-01 because nothing forced it to stay current, and Codex reads it as authoritative.

At the same time every session pays ~50 KB of always-on context (`CLAUDE.md` + all 25 files in `.claude/rules/`, none path-scoped), so Tailwind rules load while editing a prerender script and Playwright rules load while writing a blog post. Adopting the [DOX](https://github.com/agent0ai/dox) hierarchy replaces one stale monolith with folder-local contracts that load near the work, and makes updating them part of the change itself.

## What Changes

- **Root `AGENTS.md` becomes the DOX rail** (~40 lines): core contract, read-before-editing protocol, update-after-editing protocol, hierarchy rules, style rules, closeout checklist, user preferences, and the top-level Child DOX Index. **BREAKING** for anything that deep-links into the current `AGENTS.md` headings.
- **Non-derivable content from the old `AGENTS.md` moves to `docs/`**: deployment status, Core Web Vitals measurements, roadmap, and the deliberately-rejected ideas list. Content an agent can read from the repo itself (folder tree, dependency list, npm command list, routing table) is deleted rather than migrated.
- **11 child `AGENTS.md` files** are created at durable folder boundaries: `src/`, `src/content/`, `src/content/blog/`, `src/content/kurs/`, `src/components/`, `src/data/`, `scripts/`, `tests/`, `api/`, `openspec/`, `remotion/`. Each uses the DOX section order (Purpose, Ownership, Local Contracts, Work Guidance, Verification, Child DOX Index).
- **A one-line `CLAUDE.md` containing `@AGENTS.md`** sits beside each `AGENTS.md`, including at the root. Claude Code reads `CLAUDE.md`, not `AGENTS.md`, and loads subdirectory `CLAUDE.md` files on demand when it touches files in those directories; the import shim is what makes the DOX tree visible to Claude Code without duplicating content. Root `CLAUDE.md` keeps its existing OpenSpec command table below the import.
- **`.claude/rules/data-storage/00-overview.md` is dissolved into the tree** — the blog content system, frontmatter schema, FAQ structure, and loader mechanics move to `src/content/blog/AGENTS.md` and `src/data/AGENTS.md`, and the rules file is deleted. `.claude/rules/` keeps only technology-generic style (React, Tailwind, Vite, Playwright, Framer Motion, React Router, Vercel, git, setup, universal overview).
- **`.claude/rules/content/10-prosty-polski.md` stays where it is.** It is cross-cutting (blog + course + course FAQ data) and `blog-content-style` requires that exact path as the single source of truth. The tree links to it instead of copying it.
- **The five existing per-folder `README.md` files are preserved unchanged.** `AGENTS.md` is the English contract for agents; `README.md` stays the Polish guide for humans, and each `AGENTS.md` links to its sibling README.
- **A non-blocking warning hook** reports when a session edited files under a folder whose nearest `AGENTS.md` was not touched, so the DOX pass has an actual trigger instead of relying on recall.

## Capabilities

### New Capabilities

- `agent-context-hierarchy`: The DOX documentation tree — which folders own an `AGENTS.md`, the required section shape, the `CLAUDE.md` import shim beside each one, index consistency between parent and child, the read-before-edit and update-after-edit protocols, the boundary between OpenSpec specs / DOX docs / `.claude/rules`, and the warning hook that flags a missed DOX pass.

### Modified Capabilities

None. `openspec-primary-workflow` requires root `CLAUDE.md` to carry the OpenSpec command table and to be free of PIV references; both hold after the `@AGENTS.md` import is added above the existing content. `blog-content-style`, `course-content-style`, and `llm-wiki-course` hard-reference `.claude/rules/content/10-prosty-polski.md`, which this change deliberately leaves in place.

## Impact

**Created**
- 11 `AGENTS.md` files under `src/`, `src/content/`, `src/content/blog/`, `src/content/kurs/`, `src/components/`, `src/data/`, `scripts/`, `tests/`, `api/`, `openspec/`, `remotion/`
- 11 matching one-line `CLAUDE.md` shims
- One `docs/` file holding the migrated project-status content
- One hook script plus its `.claude/settings.json` registration

**Rewritten**
- `AGENTS.md` (20 KB → DOX rail)
- `CLAUDE.md` (adds `@AGENTS.md` import and the ownership boundary; keeps the OpenSpec table and rules index)

**Deleted**
- `.claude/rules/data-storage/00-overview.md` (content relocated into the tree)

**Unchanged**
- `openspec/specs/**` — no requirement changes
- `.claude/rules/content/10-prosty-polski.md` and every reference to it
- The five per-folder `README.md` files
- `.agent/`, `.cursor/`, `.github/` — OpenSpec-generated mirrors
- Application code, tests, and build scripts. This change touches documentation, one hook, and one settings file only.

**Risks**
- The `@AGENTS.md` import is documented for files loaded at launch; whether it expands in a subdirectory `CLAUDE.md` loaded on demand is unverified. This is verified on one folder before the remaining ten are written. Fallback: content goes directly into each `CLAUDE.md` and `AGENTS.md` is kept as the Codex-facing copy.
- Windows note: `ln -s AGENTS.md CLAUDE.md` requires Administrator or Developer Mode, so the import shim is used rather than symlinks.
- Always-on context drops by roughly 5 KB (the dissolved rules file); the tree adds on-demand context per folder instead. The gain is relevance, not raw size.
