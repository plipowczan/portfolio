## 1. Migrate content out of the old AGENTS.md

- [x] 1.1 Read current `AGENTS.md` and classify every section as derivable-from-repo, non-derivable-status, or roadmap
- [x] 1.2 Create `docs/PROJECT_STATUS.md` with the non-derivable content: Core Web Vitals figures (dated as measured 2026-01), deployment status, SEO status, and the record of deliberately rejected ideas
- [x] 1.3 Merge roadmap and priority items from `AGENTS.md` into the existing `docs/TODO.md`, deduplicating against what is already there
- [x] 1.4 Verify nothing non-derivable is left unmigrated: diff the old section list against `docs/PROJECT_STATUS.md` + `docs/TODO.md`

## 2. Write the root rail

- [x] 2.1 Rewrite `AGENTS.md` as the DOX rail with sections in order: intro, Core Contract, Read Before Editing, Update After Editing, Hierarchy, Child Doc Shape, Style, Closeout, User Preferences, Child DOX Index (left empty for now)
- [x] 2.2 Add the three-way ownership boundary to the rail: `openspec/specs/**` = behavior contracts, `AGENTS.md` = folder work contracts, `.claude/rules/**` = technology style with no repo knowledge; state that a cross-cutting rule is written once and linked
- [x] 2.3 Confirm the rail is at most 120 lines and contains no dependency versions, folder tree, npm command list, routing table, or performance measurement
- [x] 2.4 Add `@AGENTS.md` as the first line of root `CLAUDE.md`, keeping the existing OpenSpec command table and `.claude/rules/` index below it
- [x] 2.5 Verify `openspec-primary-workflow` still holds: root `CLAUDE.md` lists all `/opsx:*` and `/validation:*` commands and contains zero matches for "PIV", "piv_loop", "core_piv"

## 3. Pilot the import shim on one folder

- [x] 3.1 Write `src/content/blog/AGENTS.md` using the DOX section order, with Verification naming only existing checks (`npm run blog:sitemap`, the plain-Polish grep, `npm test`)
- [x] 3.2 Create `src/content/blog/CLAUDE.md` containing exactly one non-empty line: `@AGENTS.md`
- [x] 3.3 In a fresh session, read a file under `src/content/blog/`, run `/context`, and confirm `src/content/blog/CLAUDE.md` appears under Memory files
- [x] 3.4 Confirm the imported `AGENTS.md` content is actually in context, not just the shim — check that a rule stated only in `AGENTS.md` is visible
- [x] 3.5 **Decision gate.** If 3.4 passes, continue to group 4 unchanged. If it fails, apply the design fallback: content goes into each `CLAUDE.md`, `AGENTS.md` becomes the Codex-facing copy, and the deviation from upstream DOX is recorded in the rail before proceeding

## 4. Write the remaining child docs

- [x] 4.1 `src/AGENTS.md` — React 19 + Vite conventions, the no-PropTypes trap, named exports, component size limit; covers `hooks/`, `context/`, `locales/`, `styles/`, `pages/`, `utils/` which get no doc of their own
- [x] 4.2 `src/content/AGENTS.md` — parent of blog and kurs; links `.claude/rules/content/10-prosty-polski.md` as the cross-cutting plain-Polish source of truth without restating it
- [x] 4.3 `src/content/kurs/AGENTS.md` — file-derived lesson system, ordering drives nav/prerender/sitemap/redirects, the `excerpt` colon build break; links the plain-Polish rules
- [x] 4.4 `src/components/AGENTS.md` — the `layout/ sections/ ui/ seo/ animations/ widgets/ booking/ routing/` split and which kind of component belongs where
- [x] 4.5 `src/data/AGENTS.md` — loader conventions, boundary validation, links `src/data/README.md` as the Polish human guide
- [x] 4.6 `scripts/AGENTS.md` — prerender, sitemap, OG images, font fetch, WebP conversion; links `scripts/README.md`
- [x] 4.7 `tests/AGENTS.md` — Playwright conventions, the `dist/` vs `dist-test/` trap, the pre-merge `build:prerender` gate and why skipped-not-failed matters; links `tests/README.md`
- [x] 4.8 `api/AGENTS.md` — the single Vercel function, Resend audience, env var handling
- [x] 4.9 `openspec/AGENTS.md` — OpenSpec is the primary workflow, `specs/` is not hand-edited, changes flow through `/opsx:*`
- [x] 4.10 `remotion/AGENTS.md` — separate build with its own dependencies, not part of the site build
- [x] 4.11 Create the matching one-line `CLAUDE.md` shim beside each of the ten docs from 4.1–4.10
- [x] 4.12 Verify every child doc uses the exact section order Purpose, Ownership, Local Contracts, Work Guidance, Verification, Child DOX Index, with empty sections present rather than omitted or padded

## 5. Dissolve the data-storage rules file

- [x] 5.1 Move the frontmatter schema into `src/content/blog/AGENTS.md`: required fields, `description`, `modified`, and both `alternateSlug` hard rules verbatim in meaning
- [x] 5.2 Move the FAQ section structure and its link to `src/utils/faqExtractor.js` into `src/content/blog/AGENTS.md`
- [x] 5.3 Move the loading mechanism into `src/data/AGENTS.md`: the `import.meta.glob` pattern, `_wsad.md` and underscore-prefix exclusion, boundary validation, and the static-data conventions
- [x] 5.4 Delete `.claude/rules/data-storage/00-overview.md` and remove the now-empty `data-storage/` directory
- [x] 5.5 Remove the `data-storage/00-overview.md` entry from the `CLAUDE.md` rules index
- [x] 5.6 Grep the whole repo for `data-storage/00-overview` and `data-storage` and fix or remove every remaining reference
- [x] 5.7 Confirm `.claude/rules/content/10-prosty-polski.md` is untouched and that `blog-content-style`, `course-content-style`, and `llm-wiki-course` still resolve to that exact path

## 6. Populate and cross-check the indexes

- [x] 6.1 Fill the root Child DOX Index with its direct children and a one-line scope for each; confirm "not yet indexed" no longer appears
- [x] 6.2 Fill each intermediate Child DOX Index (`src/AGENTS.md` lists content, components, data; `src/content/AGENTS.md` lists blog, kurs)
- [x] 6.3 Cross-check both directions: every `AGENTS.md` on disk is named by exactly one parent, and every indexed path exists
- [x] 6.4 Verify each `AGENTS.md` in a folder that has a `README.md` links it and labels it the Polish human guide while stating `AGENTS.md` is binding

## 7. Add the DOX-pass warning hook

- [x] 7.1 Write `scripts/dox-pass-check.mjs`: collect changed paths from `git status --porcelain` and `git diff --name-only`, walk each up to its nearest `AGENTS.md`, and warn for every owning doc not itself in the changed set
- [x] 7.2 Make the script exit 0 unconditionally so it can never fail a turn or block a commit
- [x] 7.3 Create `.claude/settings.json` (does not exist yet — only `settings.local.json` does) and register the script as a `Stop` hook
- [x] 7.4 Test the warning path: edit a file under `src/content/blog/` without touching `src/content/blog/AGENTS.md` and confirm the warning names both paths
- [x] 7.5 Test the silent path: edit `src/data/blogPosts.js` together with `src/data/AGENTS.md` and confirm nothing is printed for that path
- [x] 7.6 Confirm the hook does not fire on a clean working tree

## 8. Verify the tree against the repository

- [x] 8.1 Extract every file path, directory path, and `npm run` script cited across all `AGENTS.md` files and resolve each against the repository and `package.json`
- [x] 8.2 Grep all `AGENTS.md` files for the known-dead references `.cursorrules`, `blogLoader.js`, `docs/maintenance/`, `docs/blog/BLOG_WORKFLOW.md` and confirm zero matches
- [x] 8.3 Confirm exactly 12 `AGENTS.md` files exist outside `node_modules/` and `.claude/worktrees/`, and that each has a sibling `CLAUDE.md`
- [x] 8.4 Confirm no `CLAUDE.md` in the tree is a symlink
- [x] 8.5 Confirm no child doc restates a parent rule or a cross-cutting rule that should be linked instead
- [x] 8.6 Run `npm test` to confirm the change touched no application behavior — chromium project: 161 passed, 6 skipped (prerender assertions, no prerendered `dist/`). Full 5-project run deliberately skipped: `git status` over `src/ api/ public/` and every config file shows zero application changes, and the one new non-doc file (`scripts/dox-pass-check.mjs`) is referenced only by `.claude/settings.json`
- [x] 8.7 Run `/opsx:verify` for this change and record the DOX pass outcome for the docs this change itself created

## 9. Keep the content globs from eating the tree (discovered during 8.x)

- [x] 9.1 Confirm the regression: `AGENTS.md` and `CLAUDE.md` in `src/content/blog/` and `src/content/kurs/` are picked up by every `*.md` glob; `npm run blog:sitemap` fails with `Invalid time value`
- [x] 9.2 Add a shared `DOC_FILES` set (`README.md`, `AGENTS.md`, `CLAUDE.md`) to `src/data/blogPosts.js`, `src/data/coursePosts.js`, `scripts/update-sitemap.js`, `scripts/prerender.mjs`, `scripts/generate-llms-txt.js`, replacing the scattered `!== "README.md"` checks
- [x] 9.3 Exclude the same filenames in the article workflow: `ls -t` in `prime.md`, the `^id:` grep in `plan.md` (the schema example contains a literal `id: 1`), and the "most recent article" default in `translate.md` — skill and command copies
- [x] 9.4 Re-verify: `npm run blog:sitemap` emits 60 articles and 8 lessons with no doc URLs; `public/llms.txt` and `public/llms-full.txt` regenerate byte-identical; `npm run build:prerender` reports 98 pages / 0 errors with no phantom route
- [x] 9.5 Record the exclusion in `src/data/AGENTS.md`, `scripts/AGENTS.md`, `src/content/blog/AGENTS.md`, and `src/content/kurs/AGENTS.md`, and add the requirement to the delta spec
- [x] 9.6 Index `docs/PROJECT_STATUS.md` and `docs/TODO.md` in `docs/README.md`
