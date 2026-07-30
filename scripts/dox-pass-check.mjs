#!/usr/bin/env node
/**
 * DOX pass check — warns when files were edited under a folder whose nearest
 * `AGENTS.md` was not itself edited.
 *
 * Reads git state rather than the session transcript: one command,
 * cross-platform, and self-clearing — the warning stops once the DOX pass is
 * committed alongside the change. It also flags files left dirty by an earlier
 * session, which is deliberate: dirty-and-undocumented is worth surfacing.
 *
 * Registered as a `Stop` hook in `.claude/settings.json`. It ALWAYS exits 0 —
 * it must never fail a turn or block a commit.
 *
 * Usage:
 *   node scripts/dox-pass-check.mjs          # human-readable, for manual runs
 *   node scripts/dox-pass-check.mjs --json   # {"systemMessage": "..."} for the hook
 */

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const JSON_OUT = process.argv.includes("--json");

// Build output and generated artifacts are not owned by any DOX doc.
const IGNORED_PREFIXES = [
  "node_modules/",
  "dist/",
  "dist-test/",
  "playwright-report/",
  "test-results/",
  ".claude/worktrees/",
];

const MAX_FILES_LISTED = 5;

function git(args) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

/** Repo-relative paths touched in the working tree, staged or not. */
function changedPaths(root) {
  const out = new Set();

  // `--porcelain=v1 -z`: NUL-separated `XY path` entries. A rename or copy is
  // `XY <destination>\0<source>\0` — note the order is destination first, the
  // reverse of the `old -> new` form printed without `-z`. Both paths matter:
  // moving a file out of a folder changes that folder's scope just as much as
  // moving one in, so both owning docs should be flagged.
  const status = git(["status", "--porcelain=v1", "-z"]);
  if (status) {
    const parts = status.split("\0");
    for (let i = 0; i < parts.length; i += 1) {
      const entry = parts[i];
      if (!entry) continue;
      const code = entry.slice(0, 2);
      const destination = entry.slice(3);
      if (destination) out.add(destination);
      if (code[0] === "R" || code[0] === "C") {
        i += 1; // the source path is a payload, not the next status entry
        const source = parts[i];
        if (source) out.add(source);
      }
    }
  }

  const diff = git(["diff", "--name-only", "-z"]);
  if (diff) {
    for (const file of diff.split("\0")) {
      if (file) out.add(file);
    }
  }

  return [...out].filter(
    (file) => !IGNORED_PREFIXES.some((prefix) => file.startsWith(prefix))
  );
}

/** Nearest `AGENTS.md` at or above a file, repo-relative, or null. */
function owningDoc(root, file) {
  let dir = path.posix.dirname(file);
  for (;;) {
    const candidate = dir === "." ? "AGENTS.md" : `${dir}/AGENTS.md`;
    if (existsSync(path.join(root, candidate))) return candidate;
    if (dir === "." || dir === "/" || dir === "") return null;
    const parent = path.posix.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function report(missing) {
  const lines = [
    `DOX pass: ${missing.size} doc(s) own edited files but were not updated.`,
  ];
  for (const [doc, files] of missing) {
    const shown = files.slice(0, MAX_FILES_LISTED);
    const rest = files.length - shown.length;
    lines.push(`  ${doc}`);
    for (const file of shown) lines.push(`    edited: ${file}`);
    if (rest > 0) lines.push(`    ... and ${rest} more`);
  }
  lines.push("  Update the doc, or state that the pass ran and nothing changed.");
  return lines.join("\n");
}

function main() {
  const root = git(["rev-parse", "--show-toplevel"])?.trim();
  if (!root) return;

  const changed = changedPaths(root);
  if (changed.length === 0) return;

  const changedSet = new Set(changed);
  const missing = new Map();

  for (const file of changed) {
    const base = path.posix.basename(file);
    // Editing a doc is the pass, not a trigger for one.
    if (base === "AGENTS.md" || base === "CLAUDE.md") continue;

    const doc = owningDoc(root, file);
    if (!doc || changedSet.has(doc)) continue;

    if (!missing.has(doc)) missing.set(doc, []);
    missing.get(doc).push(file);
  }

  if (missing.size === 0) return;

  const text = report(missing);
  process.stdout.write(
    JSON_OUT ? `${JSON.stringify({ systemMessage: text })}\n` : `${text}\n`
  );
}

try {
  main();
} catch {
  // A warning must never fail a turn. Swallow everything.
}
process.exit(0);
