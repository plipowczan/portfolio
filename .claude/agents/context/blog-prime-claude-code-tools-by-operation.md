# Blog Prime — Claude Code Tools by Operation (weak spots + the tools that fix them)

> Prime artifact for the next blog article. Phase: PRIME complete → next `/blog-article-writer:plan`.

## Source materials analyzed

1. **Primary dossier** — `docs/blog/2026-07-12_claude-code-tools-i-use-by-operation.md`
   - First-person, richly detailed "article-input dossier" written by Pawel.
   - Thesis: Claude Code is excellent at code/files/commands/text reasoning, but **weak or blind at 5 things out of the box**: (1) Video, (2) Design, (3) Memory, (4) Research, (5) Token usage.
   - For each tool: **① How I use it** (Pawel's real workflow) + **② Source note** (what it is, install, gotchas). Includes a "Quick reference table" and a "Gaps/to-do" list.
   - This is the source of truth for the article's substance and for Pawel's personal takes/caveats.

2. **Transcript** — `docs/blog/transcript-5-open-source-repos-fix-claude-code.md`
   - YouTube auto-captions of Chase AI video "5 Open Source Repos That Fix 95% of Claude Code's Problems" (2026-07-08, 12:04). Source: https://www.youtube.com/watch?v=IRPEfl2BD_c
   - The video is the **angle inspiration**. Its 5 picks: Claude Video (watch), NotebookLM-py (research), Graphify (+ Obsidian Skills bonus) (memory), Impeccable (design), Ponytail (tokens).
   - Note the divergence: the video's by-weak-spot framing = same 5 buckets Pawel uses, but Pawel's tool picks are his OWN stack (broader, with hands-on caveats). The article should be Pawel's stack, NOT a recap of the video. Video can be credited as the spark.

## The article angle / unique value

**"Claude Code jest świetny, ale ślepy w 5 miejscach — oto narzędzia, których naprawdę używam, żeby to naprawić."**

- Structure by **operation / weak spot**, not by repo popularity. Each section = one gap + the tool(s) Pawel actually runs to close it.
- Differentiator vs generic listicles: **hands-on, opinionated, with caveats** ("I use X", "haven't tested Y yet", "full mode unreadable in Polish"). Honesty about what's tested vs catalogued is the personal-brand hook.
- Pawel's real experience credibility: his own second brain (`brain.lipowczan.pl`) IS the memory example; he runs UI UX Pro Max with Tailwind+React; he uses Caveman daily (this very session is in caveman mode).

## Target audience

- Devs / AI-curious builders already using Claude Code (or evaluating it) who feel the out-of-box gaps.
- Knowledge level: intermediate. Comfortable with CLI, skills, MCP, terminal. Not necessarily deep infra.
- Intent: "which tools are actually worth installing, and how does someone who tests dozens use them?"

## The 5 operations + tools (from dossier)

| Op | Weak spot | Tool(s) Pawel uses | Pawel's status / caveat |
|----|-----------|--------------------|-------------------------|
| 🎬 Video | Can't watch OR render video | **Claude Video** (`/watch`, bradautomates) — watch/understand + YT transcripts; **HyperFrames** (heygen) — HTML→MP4, on-brand render | Uses both. Video input + output split. |
| 🎨 Design | Generic "AI slop" frontends | **UI UX Pro Max** (design-system gen + UX audit); **UX RULER** (audience/value before features); **Impeccable** (design-language + anti-slop linter) | Uses all three. Framed as discovery→generation→guardrail. |
| 🧠 Memory | Session amnesia | **Second-brain / LLM Wiki** (this repo pattern; Karpathy Apr 2026); **NotebookLM-py** (NotebookLM inside CC + YT transcripts) | Second brain = his live system. NotebookLM-py just started; deep-research use = "to test". |
| 🔎 Research | Built-in web tools shallow/flaky | **Firecrawl** (scraper fallback → clean Markdown); **NotebookLM-py** (grounded deep research, to test); **research skill (agent swarm)** in this repo | Firecrawl = fallback. Swarm skill wired to his LLM Wiki. |
| 🪙 Token usage | Verbose output burns tokens/context | **Caveman** (output compression); catalogued-not-tested: Headroom, Ponytail, Graphify, Camofox, etc. | Caveman used — caveat: `full` mode unreadable, esp. Polish. Rest catalogued only. |

Repo/link details, install commands, and token dials are all in the dossier — pull verbatim-in-spirit when writing.

## CRITICAL: overlap with existing content (avoid duplication, do cross-link)

- **`5-repozytoriow-github-claude-code.md` (id 23, category Code, PL+EN)** — existing "5 GitHub repos" post. Its 5: UI/UX Pro Max, OpenSpec, Excalidraw, Obsidian Skills, Awesome Claude Code. **Only UI UX Pro Max overlaps.** New article's by-operation framing + different tool set = distinct. In the design section, briefly acknowledge/link the older post rather than re-explaining UI UX Pro Max from scratch.
- **Memory section overlaps 3 posts — LINK, don't re-teach:**
  - `second-brain-obsidian-claude-code-skills.md` (id 16) — the Obsidian+Claude second-brain build.
  - `llm-knowledge-base-brain-karpathy.md` (id 24) — Karpathy LLM Wiki + his 185-note vault.
  - `okf-standard-przenosnosc-bazy-wiedzy-ai.md` (id 29) — portable knowledge base.
- **Video section**: `remotion-explainer-videos-ai.md` (id 18) — Remotion for explainer videos. Dossier explicitly compares HyperFrames vs Remotion (license/HTML-native). Cross-link + note the tradeoff.
- **Research/RAG**: `rag-ragowi-nierowny.md` (id 30) — RAG nuance; LLM-Wiki-vs-RAG framing in memory section can nod to it.

→ 3-5 internal links, descriptive anchors (SEO rule). Memory + Video are the natural link hubs.

## Frontmatter plan (decide final in plan phase)

- **id**: `31` (max existing = 30; confirmed via grep of all `id:`).
- **slug** (candidate): `narzedzia-claude-code-slabe-punkty` — or by-operation flavor `narzedzia-claude-code-wideo-design-pamiec`. 3-6 words, keyword "Claude Code" + "narzędzia". Finalize in plan.
- **category**: **Code** (matches existing Claude-Code-tooling post id 23; fits agentic dev tooling).
- **lang**: `pl`. Default PL-only. `alternateSlug` set ONLY after EN counterpart exists (separate translate step).
- **date**: 2026-07-13. **modified**: omit at creation.
- **tags** (candidate): `Claude Code`, `Agent Skills`, `Developer Tools`, `Produktywność`, `AI` (+ maybe `Token Optimization`).
- **readTime**: ~13-15 min (this is a broad survey; standard length 2000-3000 words). Watch scope — 5 sections × multi-tool could bloat; may need to keep each tool tight.
- **image**: `/images/og-{slug}.webp` (OG generated in execute/generate-og-prompt step).

## Style patterns to follow (from copywriting skill + prosty-polski rules)

- **Voice**: first person, direct, practical, opinionated. Lead with concrete problem/number/own situation — never "W dzisiejszym świecie...".
- **Prosty polski (HARD RULES, source: `.claude/rules/content/10-prosty-polski.md`):**
  - Sentences avg ≤ ~20 words, one thought per sentence, active voice, cut deletable sentences.
  - **Definition at first use (REQUIRED)** for every hard term — including keep-list terms — as a parenthetical. Terms needing defs here: RAG, embeddings, MCP, skill, frontmatter, `/watch`, keyframe/frame, agent swarm, LLM Wiki, progressive disclosure, second brain, whisper/transcript, OG, token, context window.
  - **Keep in English** (UI/file test): Claude Code, MCP, RAG, skill, `/watch`, `/caveman`, commit, vault, frontmatter, markdown, product/tool names (Firecrawl, Impeccable, HyperFrames, NotebookLM, Caveman, Ponytail, Graphify). Tool/product names in backticks first mention.
  - **Never polonize verbs**: no ingestować/mergować/renderować/deployować/commitować → use PL verb or "robić <keep-list noun>". Watch dossier's own usage ("watchować" etc. — rewrite).
  - Adjectives must carry info (number/example/checkable trait). Max 1 metaphor per section.
- **AI-tell character ban**: no `—` (em dash), no `–` (en dash), no `…`. Use `-` with spaces and `...`. Keep Polish quotes `„ "`. Pre-save grep: `grep -nP '[\x{2014}\x{2013}\x{2026}]'` must be empty.
- **AI-tell phrase ban**: no antithesis-dash ("to nie X, to Y"), no empty openers/closers ("Podsumowując", "Warto zauważyć"), no forced rule-of-three, no "zanurzmy się".
- **Formatting**: paragraphs max 3-4 sentences; bullets for enumerations; numbered for sequences; bold key concepts+numbers; code blocks always language-tagged (`bash`, `powershell`, `html`, `text`); emoji sparingly (section headers OK — dossier already uses 🎬🎨🧠🔎🪙, fits).
- **Structure order at end**: Wnioski → CTA (HTML div, `/#contact`, "Umów bezpłatną konsultację", category=Code template) → `## Przydatne zasoby` → `## FAQ`.
- **FAQ (REQUIRED)**: 4-6 natural PL questions, `<details open>` + H3 in `<summary>`, answers 2-4 sentences key-info-first. AEO-optimized.

## Code / examples to include (from dossier, keep short <10-15 lines)

- Claude Video: `/watch <url> <question>` one-liner + the 4-mode `--detail` table (transcript/efficient/balanced/token-burner).
- HyperFrames: install `npx skills add heygen-com/hyperframes`; maybe the tiny HTML composition snippet (trim).
- UX RULER: install snippet (git clone → ~/.claude/skills) — keep short or link instead.
- NotebookLM-py: `uv tool install "notebooklm-py[browser]"` + `notebooklm login`.
- Firecrawl: `pip install firecrawl-py` + scrape line.
- Caveman: install (PowerShell `irm ... | iex` / bash `curl ... | bash`), `/caveman lite|full|ultra`.
- Obsidian MCP wiring (memory) — optional, may link to id 16 post instead to save length.

## Gaps / to-do flagged (from dossier — reflect Pawel's honesty)

- Caveman `full`-mode Polish readability problem — recommend `lite` as safe default. (Meta: this session is literally in caveman full mode — authentic.)
- NotebookLM-py deep research = untested by Pawel; mark as "candidate, to test", not endorsement.
- Token tools beyond Caveman (Headroom/Ponytail/Graphify) = catalogued, not personally verified → "candidates, not endorsements".
- No dataviz note yet (out of scope for this article).

## Scope risk (flag for plan)

5 operations × up to 3 tools each = ~11 tools. At 2000-3000 words this is tight. Options for plan:
- (A) Keep all 5 ops but 1 "hero" tool + 1-2 shorter mentions per op (recommended — matches dossier's "how I use it" primacy).
- (B) Cut to the tools Pawel actually uses hands-on; push catalogued/untested ones into a single "na radarze" list at the end.
Recommend (A)+(B) hybrid: hero tool per op with real workflow, untested ones bundled into a short "candidates" list (mirrors dossier's own token section).

## Success criteria — PRIME

- [x] Source materials identified + read (dossier + transcript).
- [x] Pawel's writing style understood (copywriting SKILL + writing-style + article-structure + prosty-polski).
- [x] Key topics + technical concepts extracted (5 ops, 11 tools, caveats).
- [x] Overlap with existing posts mapped (id 23 design; ids 16/24/29 memory; id 18 video; id 30 RAG).
- [x] Frontmatter plan drafted (id 31, category Code, slug candidates).
- [x] Prime artifact created.

## Next command

`/blog-article-writer:plan "Narzędzia Claude Code według operacji - wideo, design, pamięć, research, tokeny"`
