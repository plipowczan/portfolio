/**
 * Extracts the first prose paragraph from raw markdown content.
 *
 * - Skips leading frontmatter fences (`---\n...---`), headings (`#`),
 *   horizontal rules, HTML comments, code fences and blank lines.
 * - Strips inline markdown syntax (links, emphasis, backticks, images).
 * - Trims to maxChars at a word boundary and appends `…` when truncated.
 *
 * @param {string} markdown
 * @param {number} [maxChars=300]
 * @returns {string}
 */
export function extractFirstParagraph(markdown, maxChars = 300) {
  if (!markdown || typeof markdown !== "string") return "";

  let text = markdown;

  // Strip leading frontmatter if present
  if (text.startsWith("---")) {
    const end = text.indexOf("\n---", 3);
    if (end !== -1) {
      text = text.slice(end + 4);
    }
  }

  const blocks = text.split(/\n\s*\n/);

  for (const rawBlock of blocks) {
    const block = rawBlock.trim();
    if (!block) continue;
    if (block.startsWith("#")) continue;
    if (block.startsWith("```") || block.startsWith("~~~")) continue;
    if (/^[-*_]{3,}\s*$/.test(block)) continue;
    if (block.startsWith("<!--")) continue;
    if (block.startsWith(">")) continue;
    if (/^[-*+]\s+/.test(block) || /^\d+\.\s+/.test(block)) continue;
    if (block.startsWith("|")) continue;
    if (/^!\[.*\]\(.*\)\s*$/.test(block)) continue;

    const cleaned = stripMarkdown(block);
    if (!cleaned) continue;

    return truncateAtWord(cleaned, maxChars);
  }

  return "";
}

function stripMarkdown(input) {
  return input
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtWord(text, maxChars) {
  if (text.length <= maxChars) return text;
  const slice = text.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[\s,.;:!?-]+$/, "") + "…";
}
