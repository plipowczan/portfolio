## ADDED Requirements

### Requirement: Root AGENTS.md is the DOX rail

The root `AGENTS.md` SHALL contain only the DOX contract: a statement that DOX is installed and binding, the Core Contract, the Read Before Editing protocol, the Update After Editing protocol, the Hierarchy rules, the Child Doc Shape (including the default section order), the Style rules, the Closeout checklist, a User Preferences section, and the top-level Child DOX Index.

The root `AGENTS.md` SHALL NOT contain: dependency version lists, folder trees, routing tables, npm command lists, component hierarchies, performance measurements, roadmaps, feature status lists, or contact details. All of these are either derivable from the repository or belong in `docs/`.

#### Scenario: Rail contains every DOX section

- **WHEN** an agent reads the root `AGENTS.md`
- **THEN** it finds headings for Core Contract, Read Before Editing, Update After Editing, Hierarchy, Child Doc Shape, Style, Closeout, User Preferences, and Child DOX Index

#### Scenario: Derivable content is absent from the rail

- **WHEN** the root `AGENTS.md` is searched for a dependency version string, an `npm run` command list, or a Core Web Vitals measurement
- **THEN** zero matches are found

#### Scenario: Rail is short enough to stay current

- **WHEN** the root `AGENTS.md` line count is measured
- **THEN** it is at most 120 lines

### Requirement: Non-derivable project status is migrated, not deleted

Content from the previous root `AGENTS.md` that is not derivable from the repository SHALL be preserved under `docs/` before the rail replaces it. Roadmap and priority items SHALL be merged into the existing `docs/TODO.md` rather than written to a new file. Performance measurements, deployment status, and the record of deliberately rejected ideas SHALL land in `docs/PROJECT_STATUS.md`.

#### Scenario: Measurements survive the rewrite

- **WHEN** the Core Web Vitals figures previously recorded in `AGENTS.md` are looked up after the change
- **THEN** they are found in `docs/PROJECT_STATUS.md` with the date they were measured

#### Scenario: Roadmap is not duplicated

- **WHEN** roadmap items from the old `AGENTS.md` are located after the change
- **THEN** they appear in `docs/TODO.md` and NOT in `docs/PROJECT_STATUS.md` or any `AGENTS.md`

### Requirement: DOX tree covers exactly the declared folder boundaries

An `AGENTS.md` SHALL exist at the repository root and in each of these folders: `src/`, `src/content/`, `src/content/blog/`, `src/content/kurs/`, `src/components/`, `src/data/`, `scripts/`, `tests/`, `api/`, `openspec/`, `remotion/`.

No other folder SHALL contain an `AGENTS.md` unless it is also added to its parent's Child DOX Index in the same change.

#### Scenario: Declared folders each own a doc

- **WHEN** the repository is scanned for `AGENTS.md` outside `node_modules/` and `.claude/worktrees/`
- **THEN** exactly 12 files are found, at the root and the 11 declared folders

#### Scenario: Undeclared doc is rejected

- **WHEN** an `AGENTS.md` exists in a folder that no parent's Child DOX Index names
- **THEN** the tree is invalid and the missing index entry is added or the file is removed

### Requirement: Child docs follow the DOX section shape

Every child `AGENTS.md` SHALL use the section order: Purpose, Ownership, Local Contracts, Work Guidance, Verification, Child DOX Index. A section whose content does not yet exist SHALL be present but empty rather than omitted or filled with placeholder prose.

The Verification section SHALL name only checks that already exist in the repository — an npm script, a grep gate, or a test file. It SHALL NOT describe checks that would have to be built.

#### Scenario: Section order is uniform

- **WHEN** any child `AGENTS.md` is read
- **THEN** its headings appear in the order Purpose, Ownership, Local Contracts, Work Guidance, Verification, Child DOX Index

#### Scenario: Verification names a real check

- **WHEN** `tests/AGENTS.md` Verification is read
- **THEN** it names `npm test` and the `npm run build:prerender` prerequisite, both of which exist in `package.json`

#### Scenario: Empty section stays empty

- **WHEN** a folder has no local contracts beyond what its parent already states
- **THEN** its Local Contracts heading is present with no bullets, rather than repeating the parent

### Requirement: Every AGENTS.md has a sibling CLAUDE.md import shim

Each folder containing an `AGENTS.md` SHALL also contain a `CLAUDE.md` whose first non-empty line is `@AGENTS.md`. Claude Code reads `CLAUDE.md` and not `AGENTS.md`, and loads subdirectory `CLAUDE.md` files on demand when it reads files in those subdirectories; the shim is what makes the tree reachable without duplicating content.

Child `CLAUDE.md` files SHALL contain the import and nothing else. The root `CLAUDE.md` SHALL carry the import first, then its existing project content.

Symlinks SHALL NOT be used in place of the import, because creating one on Windows requires Administrator privileges or Developer Mode.

#### Scenario: Child shim is one line

- **WHEN** `src/content/blog/CLAUDE.md` is read
- **THEN** its only non-empty line is `@AGENTS.md`

#### Scenario: Shim loads the child doc on demand

- **WHEN** an agent reads or edits a file under `src/content/blog/` and then runs `/context`
- **THEN** `src/content/blog/CLAUDE.md` is listed under Memory files

#### Scenario: Root CLAUDE.md keeps its existing content

- **WHEN** the root `CLAUDE.md` is read after the change
- **THEN** it begins with `@AGENTS.md` and still contains the OpenSpec command reference table and the `.claude/rules/` index

#### Scenario: No symlink is introduced

- **WHEN** the repository is checked for symlinked `CLAUDE.md` entries
- **THEN** none are found

### Requirement: Child DOX Index is bidirectionally consistent

Each `AGENTS.md` Child DOX Index SHALL list every direct child `AGENTS.md` in its subtree, with the path and a one-line statement of what that child covers. Every child `AGENTS.md` SHALL be listed by exactly one parent.

The root Child DOX Index SHALL NOT be left in the upstream template's unindexed state.

#### Scenario: Parent names its direct children

- **WHEN** `src/content/AGENTS.md` Child DOX Index is read
- **THEN** it lists `src/content/blog/AGENTS.md` and `src/content/kurs/AGENTS.md` with a one-line scope for each

#### Scenario: No orphan and no double listing

- **WHEN** every Child DOX Index entry is cross-checked against the set of `AGENTS.md` files on disk
- **THEN** each file is named by exactly one parent, and every named path exists

#### Scenario: Root index is populated

- **WHEN** the root `AGENTS.md` Child DOX Index is read
- **THEN** it lists the direct children and does not contain the words "not yet indexed"

### Requirement: Agents read the DOX chain before editing

Before editing any path, an agent SHALL read the root `AGENTS.md`, then walk from the repository root to each target path reading every `AGENTS.md` on the route. The nearest doc SHALL govern local work details and parent docs SHALL govern repository-wide rules. Where docs conflict, the closer doc SHALL control local details, and no child doc SHALL weaken the DOX contract itself.

Agents SHALL re-read the applicable chain in the current session rather than relying on recall from an earlier session.

#### Scenario: Chain read before a blog edit

- **WHEN** an agent is asked to edit `src/content/blog/some-post.md`
- **THEN** it reads `AGENTS.md`, `src/AGENTS.md`, `src/content/AGENTS.md`, and `src/content/blog/AGENTS.md` before the first edit

#### Scenario: Closer doc wins on conflict

- **WHEN** `src/AGENTS.md` states a general convention and `src/content/blog/AGENTS.md` states a narrower one for blog markdown
- **THEN** the blog doc governs the edit, and the conflict is resolved in the docs rather than left standing

### Requirement: Every meaningful change ends with a DOX pass

After a change, the closest owning `AGENTS.md` SHALL be updated when the change affects purpose, scope, ownership, responsibilities, durable structure, contracts, workflows, operating rules, required inputs or outputs, constraints, artifacts, recorded user preferences, or the creation, deletion, move, rename, or index membership of an `AGENTS.md`.

Parent docs SHALL be updated when parent-level structure, ownership, workflow, or child index changes. Child docs SHALL be updated when a parent change alters local rules. Stale or contradictory text SHALL be removed in the same pass rather than annotated as history.

A change that alters no behavior or contract MAY leave docs unchanged, but the pass SHALL still be performed and the decision to leave docs unchanged SHALL be stated.

#### Scenario: New capability triggers a doc update

- **WHEN** a change adds a new required frontmatter field for blog posts
- **THEN** `src/content/blog/AGENTS.md` Local Contracts is updated in the same change

#### Scenario: New folder doc updates the parent index

- **WHEN** a change adds `src/hooks/AGENTS.md`
- **THEN** `src/AGENTS.md` Child DOX Index gains an entry for it in the same change

#### Scenario: No-op pass is reported

- **WHEN** a change only renames a local variable
- **THEN** the agent states that the DOX pass ran and no doc needed updating

### Requirement: Ownership boundary between the three context systems is declared

The root `AGENTS.md` SHALL state which system owns what, so the same rule is not written in two places:

- `openspec/specs/**` owns behavior contracts — what the system must do, versioned through changes.
- `AGENTS.md` files own folder work contracts — how to work inside a folder, what it owns, how to verify it.
- `.claude/rules/**` owns technology-generic style that carries no repository knowledge.

A rule that fits more than one system SHALL be written in exactly one of them, and the others SHALL link to it rather than restate it.

#### Scenario: Boundary is discoverable from the rail

- **WHEN** an agent reads the root `AGENTS.md` to decide where a new rule belongs
- **THEN** it finds the three-way boundary stated explicitly with an example of each

#### Scenario: Cross-cutting rule is linked, not copied

- **WHEN** `src/content/kurs/AGENTS.md` needs the plain-Polish rules
- **THEN** it links to `.claude/rules/content/10-prosty-polski.md` and does not restate the replacement table or keep-list

### Requirement: Blog and data rules move from .claude/rules into the tree

The blog content system documentation currently in `.claude/rules/data-storage/00-overview.md` — frontmatter schema including `description`, `modified`, and `alternateSlug` semantics, the FAQ section structure, the `import.meta.glob` loading mechanism, `_wsad.md` and underscore-prefix exclusion, and the static-data conventions — SHALL be relocated into `src/content/blog/AGENTS.md` and `src/data/AGENTS.md` according to which folder owns each rule.

`.claude/rules/data-storage/00-overview.md` SHALL then be deleted, and the root `CLAUDE.md` rules index SHALL no longer list it.

#### Scenario: Frontmatter schema is found in the owning folder

- **WHEN** an agent edits a file under `src/content/blog/` and needs the required frontmatter fields
- **THEN** the schema, including both `alternateSlug` hard rules, is present in `src/content/blog/AGENTS.md`

#### Scenario: Loader conventions live with the loader

- **WHEN** an agent edits `src/data/blogPosts.js`
- **THEN** `src/data/AGENTS.md` states the glob pattern, the exclusion rules, and the boundary-validation expectation

#### Scenario: Dissolved rules file is gone and unreferenced

- **WHEN** the repository is searched for `data-storage/00-overview`
- **THEN** zero matches are found and the file does not exist

### Requirement: Cross-cutting plain-Polish rules stay in .claude/rules

`.claude/rules/content/10-prosty-polski.md` SHALL remain at its current path and SHALL remain the single source of truth for plain-Polish content rules. It applies across `src/content/blog/`, `src/content/kurs/`, and course FAQ data in `src/data/`, so no single folder owns it.

Every existing reference to that path — in `openspec/specs/blog-content-style`, `openspec/specs/course-content-style`, `openspec/specs/llm-wiki-course`, and the `.claude/skills/` files that cite it — SHALL continue to resolve.

#### Scenario: Path is unchanged

- **WHEN** `openspec/specs/blog-content-style/spec.md` requirement naming the rules file is checked after the change
- **THEN** `.claude/rules/content/10-prosty-polski.md` exists at that exact path

#### Scenario: Tree does not fork the vocabulary list

- **WHEN** `src/content/blog/AGENTS.md` and `src/content/kurs/AGENTS.md` are searched for the replacement table or the validation grep expression
- **THEN** neither contains a copy; both link to the rules file

### Requirement: Polish per-folder READMEs are preserved and linked

The existing `README.md` files in `scripts/`, `tests/`, `src/data/`, `emails/`, and `src/content/blog/` SHALL remain in place and in Polish. `AGENTS.md` is the concise English contract for agents; `README.md` remains the human-facing guide.

Each `AGENTS.md` in a folder that has a `README.md` SHALL link to it and state that it is the human-facing Polish guide, so an agent knows which document is binding.

#### Scenario: README survives the change

- **WHEN** `tests/README.md` is checked after the change
- **THEN** it exists, is unchanged, and is still in Polish

#### Scenario: Contract points at the guide

- **WHEN** `scripts/AGENTS.md` is read
- **THEN** it links `scripts/README.md` and labels it the Polish human guide, while stating that `AGENTS.md` is the binding contract

### Requirement: A hook warns when a DOX pass is skipped

A non-blocking hook SHALL report, at the end of a session in which files were edited, any case where an edited path's nearest `AGENTS.md` was not itself edited. The hook SHALL emit a warning naming the edited path and the `AGENTS.md` that owns it.

The hook SHALL NOT block, fail the session, or prevent a commit. It SHALL be registered in `.claude/settings.json` so it is shared through version control.

#### Scenario: Missed pass is reported

- **WHEN** a session edits `src/content/blog/new-post.md` and does not touch `src/content/blog/AGENTS.md`
- **THEN** the hook prints a warning naming both paths

#### Scenario: Completed pass is silent

- **WHEN** a session edits `src/data/blogPosts.js` and also edits `src/data/AGENTS.md`
- **THEN** the hook prints nothing for that path

#### Scenario: Hook never blocks

- **WHEN** the hook finds a missed pass
- **THEN** the session completes normally and the exit status does not fail the turn

### Requirement: Tree content is verifiable against the repository

No `AGENTS.md` SHALL reference a file, directory, or npm script that does not exist. This is the failure mode that made the previous root `AGENTS.md` unusable: it cited `.cursorrules`, `src/utils/blogLoader.js`, `docs/maintenance/TODO.md`, and `docs/blog/BLOG_WORKFLOW.md`, none of which exist.

#### Scenario: Every cited path resolves

- **WHEN** every file path, directory path, and `npm run` script named across all `AGENTS.md` files is resolved against the repository and `package.json`
- **THEN** each one exists

#### Scenario: Known-dead references are absent

- **WHEN** all `AGENTS.md` files are searched for `.cursorrules`, `blogLoader.js`, `docs/maintenance/`, or `docs/blog/BLOG_WORKFLOW.md`
- **THEN** zero matches are found
