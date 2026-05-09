---
name: archive
description: Archive source materials from docs/blog/ to docs/blog/_archive/{slug}/ after publishing — moves all top-level entries (except _archive, README.md, .gitkeep) via git mv and writes a MANIFEST.md.
---

# Archive Subcommand

Final, manual step in the blog article workflow. Moves the source materials that produced an article (briefs, packs, drafts in `docs/blog/`) into a per-article archive folder so `docs/blog/` stays clean for the next article and history stays inspectable two years from now.

## Purpose

After `/blog-article-writer:translate` succeeds, the source materials in `docs/blog/` are no longer needed for the just-published article. This subcommand moves them to `docs/blog/_archive/{slug}/` using `git mv` (preserving history) and writes a small `MANIFEST.md` that links the archive back to the published PL/EN articles.

## When to Use

After `/blog-article-writer:translate` returns ✅ PASSED on both PL and EN articles. The step is **manual and skippable** — skip it if you plan to write a follow-up article that reuses the same source pack.

## Prerequisites

- Published PL article exists at `src/content/blog/{slug}.md`
- (Recommended) Published EN article exists at `src/content/blog/en/{slug}.md` — missing EN produces a warning, not a block
- Working directory is the repo root

## Inputs

- `{slug}` — required. The slug of the published article (matches `src/content/blog/{slug}.md` filename without extension).
- `--force` — optional. Allows the subcommand to proceed when `docs/blog/_archive/{slug}/` already exists; new entries are folded into the existing archive folder and `MANIFEST.md` is overwritten.

Invocation form:

```
/blog-article-writer:archive {slug} [--force]
```

## Steps

Execute strictly in order. Stop and report on the first failed precondition; do not move anything before all preconditions pass.

### Step 1: Precondition — published article exists

```bash
test -f "src/content/blog/{slug}.md" || { echo "ERROR: No published article found for slug '{slug}' (expected src/content/blog/{slug}.md)"; exit 1; }
```

If the file is missing, abort with the error above. Working tree is unchanged.

### Step 2: Precondition — archive folder collision

```bash
if [ -d "docs/blog/_archive/{slug}" ] && [ "$FORCE" != "1" ]; then
  echo "ERROR: docs/blog/_archive/{slug}/ already exists. Re-run with --force to fold new entries into it."
  exit 1
fi
```

If `--force` is passed, continue; the existing folder will be reused and the manifest overwritten.

### Step 3: Enumerate top-level entries to archive

List every top-level entry in `docs/blog/` and remove the whitelist:

- `_archive` — archive root, never moves itself
- `README.md` — folder-level documentation, if present
- `.gitkeep` — placeholder marker, if present

```bash
# PowerShell-friendly equivalent of `ls docs/blog/` minus the whitelist
ENTRIES=$(ls docs/blog/ | grep -vE '^(_archive|README\.md|\.gitkeep)$')
```

If `ENTRIES` is empty, this is the **empty source no-op**: print `Nothing to archive in docs/blog/` and exit 0 **without** creating `docs/blog/_archive/{slug}/` and **without** writing a manifest.

### Step 4: Create archive folder

```bash
mkdir -p "docs/blog/_archive/{slug}"
```

Idempotent — succeeds whether or not the folder already exists (it can already exist on `--force`).

### Step 5: Move each entry

For each `entry` in `ENTRIES`:

```bash
# Try git mv first (tracked entries — preserves history)
git mv "docs/blog/$entry" "docs/blog/_archive/{slug}/$entry" 2>/dev/null \
  || mv "docs/blog/$entry" "docs/blog/_archive/{slug}/$entry"
```

`git mv` fails for entries not yet tracked by git; the fallback `mv` handles that case so untracked source materials are also archived. Both forms preserve the original entry name.

### Step 6: Detect EN translation via alternateSlug

EN articles in this repo use translated slugs, not the PL slug. Resolve the EN counterpart by reading the `alternateSlug` field from the PL article's frontmatter:

```bash
# Extract alternateSlug from PL frontmatter (between the leading `---` fences)
EN_SLUG=$(awk '/^---$/{c++; next} c==1 && /^alternateSlug:/{print $2; exit}' "src/content/blog/{slug}.md")

if [ -n "$EN_SLUG" ] && [ -f "src/content/blog/en/${EN_SLUG}.md" ]; then
  EN_LINK="[EN article](../../../src/content/blog/en/${EN_SLUG}.md)"
else
  EN_LINK="(no EN translation)"
  if [ -z "$EN_SLUG" ]; then
    echo "WARNING: PL article has no alternateSlug field — manifest will record 'no EN translation'."
  else
    echo "WARNING: alternateSlug points to '${EN_SLUG}' but src/content/blog/en/${EN_SLUG}.md does not exist — manifest will record 'no EN translation'."
  fi
fi
```

PowerShell equivalent (when running from the PowerShell tool):

```powershell
$plMd = Get-Content "src/content/blog/{slug}.md" -Raw
if ($plMd -match '(?ms)^---\s*\n(.*?)\n---') {
    $fm = $matches[1]
    if ($fm -match '(?m)^alternateSlug:\s*(\S+)') { $enSlug = $matches[1] }
}
if ($enSlug -and (Test-Path "src/content/blog/en/$enSlug.md")) {
    $enLink = "[EN article](../../../src/content/blog/en/$enSlug.md)"
} else {
    $enLink = "(no EN translation)"
    Write-Warning "EN counterpart not found — manifest will record 'no EN translation'."
}
```

The warning is informational; archival proceeds regardless.

### Step 7: Write the manifest

Write `docs/blog/_archive/{slug}/MANIFEST.md` using the schema in the **Output** section below. On `--force`, this overwrites any existing manifest.

### Step 8: Final summary

Print a short summary listing the archived top-level entries and the manifest path, then suggest the user inspect `git status` and decide whether to commit the archival alongside the article or as a follow-up commit:

```
Archived for slug '{slug}':
  - {entry-1}
  - {entry-2}
Manifest: docs/blog/_archive/{slug}/MANIFEST.md
Next: review with `git status` and commit when ready.
```

## Output

### Files moved

Every non-whitelisted top-level entry from `docs/blog/` lands in `docs/blog/_archive/{slug}/`, preserving names. Tracked entries retain git history (verifiable via `git log --follow`).

### `docs/blog/_archive/{slug}/MANIFEST.md`

Auto-generated. Use exactly this schema:

```markdown
# Archive — {slug}

- **Archived**: {YYYY-MM-DD}
- **Slug**: `{slug}`
- **PL article**: [PL article](../../../src/content/blog/{slug}.md)
- **EN article**: {EN_LINK}  <!-- resolved from PL frontmatter alternateSlug -->


## Archived top-level entries

- `{entry-1}`
- `{entry-2}`
- ...
```

Where:

- `{YYYY-MM-DD}` is the archival date (today, in the local timezone).
- `{EN_LINK}` is `[EN article](../../../src/content/blog/en/{en-slug}.md)` when the PL article has an `alternateSlug: {en-slug}` field in frontmatter **and** that file exists on disk; otherwise the literal string `(no EN translation)`.
- The bullet list contains **only** the top-level entry names (files and folders) that were moved in this run — not the recursive tree. Folder entries get a trailing `/` in the bullet for readability (e.g., `- ` `ncp4-blog-pack/` ``).

## Edge Cases

| Scenario                                         | Behavior                                                                                                                                                                                       |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/blog/{slug}.md` does not exist      | Abort at Step 1 with a clear error. **Working tree unchanged.** No directory is created under `_archive/`, no files are moved.                                                                 |
| `docs/blog/` is empty (modulo whitelist)         | Step 3 detects no entries. Print `Nothing to archive in docs/blog/` and exit 0. **Do not** create `_archive/{slug}/`, **do not** write a manifest.                                             |
| `docs/blog/_archive/{slug}/` already exists      | Without `--force`: abort at Step 2 with an error. Working tree unchanged. With `--force`: proceed — new entries are folded into the existing folder; `MANIFEST.md` is overwritten.             |
| EN counterpart cannot be resolved (no `alternateSlug` in PL frontmatter, or the resolved `src/content/blog/en/{alternateSlug}.md` does not exist) | Step 6 emits a warning. Archival proceeds. Manifest records `(no EN translation)` instead of an EN link. |
| `README.md` or `.gitkeep` at top of `docs/blog/` | Whitelisted in Step 3 — never moved.                                                                                                                                                           |
| Untracked file or folder in `docs/blog/`         | `git mv` fails silently; the `mv` fallback in Step 5 still moves the entry into the archive. The entry will not have prior git history (it had none to preserve) but is no longer left behind. |
| `git mv` fails partway through (e.g., Windows permission)         | Stop on first failure. Run `git status` to see what moved and `git mv` / `git restore` to either complete or roll back the rest manually. No transactional rollback is attempted.              |

## See Also

- **Translate (Step 6):** `.claude/skills/blog-article-writer/subcommands/translate.md`
- **Validate (Step 5):** `.claude/skills/blog-article-writer/subcommands/validate.md`
- **Skill overview:** `.claude/skills/blog-article-writer/SKILL.md`
