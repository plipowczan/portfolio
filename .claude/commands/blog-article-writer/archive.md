# Command: /blog-article-writer:archive

## Purpose

Archive source materials from `docs/blog/` into a per-article folder `docs/blog/_archive/{slug}/` after the article is published in both PL and EN. Manual, skippable final step in the blog article workflow.

## Phase

ARCHIVE — manual cleanup after `/blog-article-writer:translate` succeeds.

## Trigger

Manually invoke after `/blog-article-writer:translate` completes successfully:

```
/blog-article-writer:archive {slug}
/blog-article-writer:archive {slug} --force
```

`{slug}` is required — it's the PL article slug (filename of `src/content/blog/{slug}.md` without extension).

`--force` is optional — allows folding new entries into a pre-existing `docs/blog/_archive/{slug}/` and overwrites its `MANIFEST.md`.

## Prerequisites

- `/blog-article-writer:translate` completed (recommended) — missing EN counterpart only warns, does not block
- PL article exists at `src/content/blog/{slug}.md`
- Working directory is repo root

## Steps

### 1. Verify Article Exists

Verify the PL article file exists. If not, abort with a clear error and **leave the working tree unchanged** (no directories created, no files moved).

```bash
test -f "src/content/blog/{slug}.md"
```

### 2. Check Archive Folder Collision

If `docs/blog/_archive/{slug}/` already exists and `--force` was NOT passed, abort with a clear error explaining the collision. Working tree unchanged.

If `--force` was passed, continue — the existing folder will be reused and the manifest overwritten.

### 3. Enumerate Top-Level Entries

List every top-level entry in `docs/blog/`, excluding the whitelist:

- `_archive` (the archive root itself)
- `README.md`
- `.gitkeep`

If the resulting list is empty, this is the **empty source no-op**: print `Nothing to archive in docs/blog/` and exit. Do **not** create `_archive/{slug}/` and do **not** write a manifest.

### 4. Create Archive Folder

```bash
mkdir -p "docs/blog/_archive/{slug}"
```

Idempotent. Works whether the folder is new or pre-existing (under `--force`).

### 5. Move Each Entry

For each non-whitelisted top-level entry, prefer `git mv` (preserves history). Fall back to a filesystem move if `git mv` fails — that catches untracked sources.

```bash
git mv "docs/blog/$entry" "docs/blog/_archive/{slug}/$entry" 2>/dev/null \
  || mv "docs/blog/$entry" "docs/blog/_archive/{slug}/$entry"
```

PowerShell equivalent (Windows / portfolio default shell):

```powershell
foreach ($entry in $entries) {
    $src = "docs/blog/$entry"
    $dst = "docs/blog/_archive/{slug}/$entry"
    git mv $src $dst 2>$null
    if ($LASTEXITCODE -ne 0) { Move-Item $src $dst }
}
```

### 6. Resolve EN Counterpart via alternateSlug

EN articles use translated slugs, **not** the PL slug. Read the `alternateSlug` field from the PL article's frontmatter and check whether the corresponding EN file exists:

```bash
EN_SLUG=$(awk '/^---$/{c++; next} c==1 && /^alternateSlug:/{print $2; exit}' "src/content/blog/{slug}.md")

if [ -n "$EN_SLUG" ] && [ -f "src/content/blog/en/${EN_SLUG}.md" ]; then
  EN_LINK="[EN article](../../../src/content/blog/en/${EN_SLUG}.md)"
else
  EN_LINK="(no EN translation)"
  echo "WARNING: EN counterpart not found — manifest will record 'no EN translation'."
fi
```

PowerShell equivalent:

```powershell
$plMd = Get-Content "src/content/blog/{slug}.md" -Raw
$enSlug = $null
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

### 7. Write MANIFEST.md

Write `docs/blog/_archive/{slug}/MANIFEST.md` using exactly this schema:

```markdown
# Archive — {slug}

- **Archived**: {YYYY-MM-DD}
- **Slug**: `{slug}`
- **PL article**: [PL article](../../../src/content/blog/{slug}.md)
- **EN article**: {EN_LINK}

## Archived top-level entries

- `{entry-1}`
- `{entry-2}`
- ...
```

Where:

- `{YYYY-MM-DD}` is today's date (local timezone).
- `{EN_LINK}` is the resolved link from Step 6, or the literal `(no EN translation)`.
- The bullet list contains only top-level entry names that were moved in this run (folders get a trailing `/` for readability). It is **not** a recursive tree.

On `--force`, this overwrites any existing manifest.

### 8. Final Summary

Print a short summary listing the archived entries and the manifest path; remind the user to inspect `git status` and decide whether to commit the archival alongside the article or as a follow-up commit:

```
Archived for slug '{slug}':
  - {entry-1}
  - {entry-2}
Manifest: docs/blog/_archive/{slug}/MANIFEST.md
Next: review with `git status` and commit when ready.
```

## Success Criteria

- [ ] Every non-whitelisted top-level entry of `docs/blog/` is now under `docs/blog/_archive/{slug}/`
- [ ] `docs/blog/` retains only entries from the whitelist (`_archive`, optionally `README.md`, `.gitkeep`)
- [ ] `docs/blog/_archive/{slug}/MANIFEST.md` exists with date, slug, PL link, EN link or "(no EN translation)", and a flat bullet list of moved top-level entries
- [ ] Tracked entries preserve git history (`git log --follow docs/blog/_archive/{slug}/{entry}` shows pre-archive commits)
- [ ] Working tree state matches expectations (`git status` shows only the renames + new MANIFEST.md, no surprise deletions)

## Failure Handling

| Failure                                          | Behavior                                                                                                                                |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/blog/{slug}.md` does not exist      | Abort at Step 1. Working tree unchanged. Suggest verifying the slug.                                                                    |
| `docs/blog/_archive/{slug}/` already exists      | Abort at Step 2 unless `--force`. Working tree unchanged. With `--force`, proceed and overwrite manifest.                               |
| `docs/blog/` is empty (modulo whitelist)         | Step 3 no-op. Print `Nothing to archive in docs/blog/` and exit.                                                                        |
| EN counterpart not resolvable                    | Step 6 warning. Archival proceeds. Manifest records `(no EN translation)`.                                                              |
| `git mv` fails partway through (e.g., perms)     | Stop on first failure. Inspect `git status`; finish manually with `git mv` or roll back with `git restore` / `git mv` back. No retries. |

## Common Pitfalls

- **Wrong slug** — typos abort safely at Step 1, but a typo that *coincidentally* matches another article's slug will silently archive the wrong materials. Verify the slug matches the article you just published.
- **Running before `:translate`** — produces "(no EN translation)" in the manifest. Translation can still be done afterward against `src/content/blog/`, which is unaffected by archival; the manifest will just be stale. Re-archive with `--force` to refresh the manifest after translation.
- **Materials for the next article already in `docs/blog/`** — the all-or-nothing whitelist will sweep them too. Move them out of `docs/blog/` (or into `docs/blog/_staging/`, etc.) before archiving the current article.
- **Manual `mv` instead of `git mv`** — loses history. Stick to the documented step order.
- **Editing `MANIFEST.md` by hand later** — fine for typo fixes, but anything you want to survive a re-run with `--force` should be expressible in the schema; otherwise it gets overwritten.

## Next Phase

After archive completes successfully:

- `docs/blog/` is clean and ready for the next article's source materials
- `docs/blog/_archive/{slug}/` holds the durable record (history + MANIFEST)
- Ready for commit. Suggested commit message: `chore(blog): archive sources for {slug}` (or fold into the article commit).
