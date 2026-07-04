---
id: 24
slug: karpathy-llm-wiki-knowledge-base
title: "How Karpathy's LLM Wiki Helped Me Organize My Knowledge Base"
excerpt: "From hand-written notes in Obsidian to a system where an agent owns the structure, indexes, and standards. How the LLM Wiki concept helped me formalize what I'd been building for years."
description: "A walk-through of a PKM system that evolved from manual Obsidian notes into an agent-maintained knowledge base of 185 notes - the three-layer architecture, progressive disclosure indexes, four core workflows, and the CLAUDE.md schema document at the center of it all."
category: AI
author: Pawel Lipowczan
date: 2026-04-12
modified: 2026-06-22
readTime: 15 min
image: /images/og-llm-knowledge-base-brain-karpathy.webp
tags:
  - AI
  - Claude Code
  - Obsidian
  - Second Brain
  - PKM
  - Knowledge Management
lang: en
alternateSlug: llm-knowledge-base-brain-karpathy
---

## Karpathy described a framework. I had a living system to organize

In April 2026, Andrej Karpathy published [a thread about "LLM Wiki"](https://x.com/karpathy/status/2039805659525644595) on X - a concept where the LLM builds and maintains a persistent wiki from your sources. Instead of classic RAG, which retrieves fragments on demand, the LLM actively manages the knowledge base: it creates notes, updates cross-references, flags contradictions.

I read the thread and had déjà vu. Not because I'd built the same thing - but because, since 2022, I'd been organically evolving in that direction. My Obsidian vault started as a classic pile of hand-written notes - a few dozen Markdown files, manually linked, growing without a clear structure. Over time, **Claude Code** took over more and more of the work: first simple formatting, then indexing, eventually full management of structure and standards. At some point I realized the agent was doing more maintenance than I was.

Karpathy's repository - [LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) - wasn't the discovery of a new world for me. It was a **catalyst for tidying up**. Karpathy gave names to the layers that had existed chaotically in my setup. He helped me formalize the separation between raw sources and the processed wiki. To write down safety rules I'd only been keeping in my head. He described a navigation protocol that worked intuitively in my system but had never been documented.

> _"Boring part of maintaining a knowledge base isn't reading or thinking - it's bookkeeping."_ - Karpathy

This is the story of an evolution from manual PKM to an agent-powered knowledge system. With Karpathy as the catalyst who helped me organize what I'd been building for years. And with one central concept that changed everything: **progressive disclosure** - organizing notes so an AI agent can find them without cluttering its context window.

In this article I'll walk through that evolution: from the chaos of hand-written notes, through gradually handing maintenance to the agent, to a system with 185 notes, three navigation indexes, and four workflows. I'll show the actual architecture, the actual processes, the actual numbers - not theory.

## The problem with classic PKM

Anyone who has tried to maintain a knowledge base for more than a few months knows the pattern: enthusiasm at the start, growing chaos in the middle, abandonment at the end.

Why classic approaches don't scale:

- **Maintenance burden grows faster than value.** Every new note is a potential link to dozens of existing ones. At 50 notes I can still handle it. At 185 - no chance. The cost of keeping order grows exponentially; the value of each added note grows linearly.
- **Cross-references are always incomplete.** I write a note about context engineering and forget that three months ago I saved something related in a completely different folder. The link never gets created. And without that link, the knowledge is fragmented - as if it didn't exist.
- **Wikis die from maintenance, not from lack of value.** Nobody abandons a knowledge base because it's worthless. They abandon it because upkeep becomes sickening. I've seen it more than once - in companies, in open source, in my own projects.
- **Zettelkasten, BASB, Digital Garden - beautiful philosophies.** Tiago Forte's Building a Second Brain, Luhmann's Zettelkasten, Digital Garden - each of these methodologies makes sense on paper. But they all assume YOU are the maintenance bottleneck. And they're right - which is why systems die. Not because people are lazy. Because bookkeeping isn't work you have time for alongside writing code, running a business, and reading new things.

Karpathy put it precisely: the boring part of maintaining a knowledge base isn't reading or thinking. It's bookkeeping - updating cross-references, keeping summaries current, noting contradictions. **LLMs don't get bored.** And that's the key observation. It's not that AI is smarter at organizing knowledge. It's that AI has no problem with the repetitive, boring tasks humans put off until "someday."

Over three years with Obsidian, I went through every one of those stages. I started enthusiastic, then came the duplicates and orphan notes, and eventually I hit the point where finding anything took longer than writing it from scratch. My vault survived because at some point I stopped fighting maintenance manually - and handed it to the agent.

## The architecture - what it looks like after the cleanup

### Tech stack

The system rests on five pieces:

- **[Obsidian](https://obsidian.md/)** - editor and frontend (local, Git-based)
- **[Quartz 4](https://quartz.jzhao.xyz/)** - Static Site Generator → GitHub Pages
- **GitHub Actions** - automatic deploy on push to the `v4` branch
- **Claude Code** - agent maintaining the vault
- **Public URL:** [brain.lipowczan.pl](https://brain.lipowczan.pl)

Obsidian is the interface for me - this is where I read, browse graph view, jot ad hoc notes. Quartz 4 is the interface for the world - a static site on GitHub Pages, available at [brain.lipowczan.pl](https://brain.lipowczan.pl). Claude Code is the engine that keeps order between the two. The whole thing is a Git repo - every change tracked, every ingest a commit, full revertable history.

### Three layers - Karpathy's framework that helped me organize

These layers had existed organically in my setup for a long time. I had an inbox for raw material, processed content, and some form of configuration. But Karpathy gave them names and a formal structure - and that helped me sharpen them.

| Layer       | Karpathy (LLM Wiki)     | My implementation                                  |
| ----------- | ----------------------- | -------------------------------------------------- |
| Raw sources | Immutable drop zone     | `/content/_raw/inbox/` - drop zone, out of build   |
| Wiki        | LLM-generated .md files | `/content/<TOPIC>/` - built and published          |
| Schema      | Config document         | `CLAUDE.md` - 300+ lines of agent configuration    |

Separating raw sources from the wiki is the critical change I formalized after reading Karpathy. Before, raw material and processed notes mixed in one directory - sometimes the agent modified the source instead of creating a new note. Now the inbox is an immutable drop zone - the agent processes, but the original stays untouched in `_raw/processed/`. I can always go back to the source and compare it with what the agent made of it. It's a simple safety mechanism, but it gives peace of mind - I know nothing is lost.

### Progressive disclosure - why notes are organized FOR the agent

This is the central concept of the whole system. Notes aren't organized to look pretty in Obsidian's graph view. They're organized so the **AI agent can quickly find them WITHOUT cluttering its context window** with unnecessary information.

Three navigation indexes - from general to specific:

- **`vault-map.md`** (~80 lines) - a bird's-eye view of the entire vault. The agent ALWAYS reads this first. Enough to understand the structure and decide where to look next.
- **`catalog.md`** (~650 lines) - one line per note with title, category, and a short description. The agent reads this when it needs to find a specific note.
- **`graph.md`** - wikilink graph (outgoing + incoming edges). The agent reads this when it needs context on the connections between notes.

```text
_indexes/
├── vault-map.md   ← always first (~80 lines)
├── catalog.md     ← 1 line / note (~650 lines)
└── graph.md       ← wikilink edges
```

The agent navigates like a human with a table of contents - it doesn't grep 185 files. It reads vault-map (80 lines), decides which topic is relevant, reaches into catalog for specific notes, and if it needs context on connections - it opens graph. That keeps the context window clean, and answers get sharper.

Compare that with the naive approach: "dump all files into the context window and ask." At 185 notes of ~500 words each, that's ~92,500 tokens of notes alone. Most models either can't fit that, or they "get lost" halfway through - they start answering based on whichever fragments happen to land near the query in embedding space, ignoring the rest. Progressive disclosure solves this elegantly: the agent reads only as much as it needs, in order from general to specific.

That's **progressive disclosure** in practice. Minimizing context window usage isn't optimization - it's the foundation without which the agent drowns in noise. Without navigation indexes you have two options: either hand the agent the whole vault (too much context) or point it at specific files yourself (back to manual work). The indexes eliminate both problems.

## CLAUDE.md - "schema" as the heart of the system

Karpathy calls this the **"schema document"** - a file that defines how the agent should treat the knowledge base. In my case it's `CLAUDE.md` - 300+ lines of configuration injected into Claude Code's system prompt at every session.

What my CLAUDE.md contains - and why each section exists:

- **Directory structure** and the purpose of each folder - so the agent knows where to create notes and what not to touch
- **Navigation protocol** - progressive disclosure, the order for reading indexes, when to reach for full files - so the agent doesn't pollute its own context window
- **Writing style guidelines** - note writing style, EN/PL mix, emoji in headers, formatting - so all notes look consistent regardless of session
- **Frontmatter schema** - YAML metadata for each note (required fields, types, validation) - so the agent doesn't create notes with incomplete metadata
- **Workflow definitions** - INGEST, COMPILE, LINT, Q&A, ENHANCE with concrete steps - so every workflow is repeatable and deterministic
- **Safety rules** - what the agent should never modify or delete (e.g., indexes only updated, never rebuilt from scratch; don't change frontmatter on existing notes without confirmation)

```yaml
# Excerpt from the frontmatter schema in CLAUDE.md
required_fields:
  - title # Note title
  - category # Topical category (AI, BUSINESS, CODE...)
  - tags # Tag list
  - summary # 2-3 sentence summary
  - created # Creation date (YYYY-MM-DD)
  - updated # Last update date
  - source # Where the knowledge came from (URL, book, experience)
```

**Key insight:** CLAUDE.md isn't generated by an LLM. It's written by hand and evolves with experience. An ETH Zurich study (2026) showed that LLM-generated agentfiles _degraded_ agent performance while costing **20%+ more**. The reason is simple - LLMs generate verbose, redundant instructions that clutter the context window. Hand-written instructions are precise and universally applicable.

It's counterintuitive. It seems like if an LLM writes better prose than most people, it should write its own configuration. In practice - the LLM generates "just in case" instructions, repeats itself, adds edge cases that never occur. The result: 800 lines instead of 300, context window polluted, agent slower and less precise.

> _"Key insight: most agent failures aren't a model problem - they're a configuration problem."_

Less is more. Every line in CLAUDE.md must justify itself. I start simple, add only what I actually need, remove what doesn't work. It's a living document - not a spec written once and forgotten. My CLAUDE.md has been through a dozen-plus iterations - some rules I added after the agent deleted important metadata, others after it ignored existing connections. Every rule is a lesson from a concrete failure.

## Workflows - what the agent can do

### INGEST - from file to knowledge in 5 minutes

This is the most common workflow - and the one that best shows the system's value. Processing a single article into a note used to take me 20-30 minutes. Ten sources - a whole evening. With the agent? 5 minutes plus review.

What INGEST looks like step by step:

1. **Drop** - I drop a file into `_raw/inbox/` - an article, PDF, transcript, Web Clipper note, anything in a text format
2. **Trigger** - I type `ingest` in Claude Code
3. **Navigate** - the agent reads `vault-map.md`, checks `catalog.md` for overlap with existing notes. If the topic already exists - it proposes an update instead of a duplicate
4. **Create** - creates a note from the template, fills in frontmatter (category, tags, summary, source, date)
5. **Link** - adds wikilinks to related notes - and updates those notes to link back (bidirectional linking)
6. **Archive** - moves the source to `_raw/processed/YYYY-MM-DD_name` - the original stays, just out of the inbox
7. **Index** - updates all three indexes (vault-map, catalog, graph)

A single source can touch **10-15 files** in one pass. The note itself plus updates to related notes plus three indexes. By hand - 2 hours if you care about cross-references. With the agent - 5 minutes plus my review, which checks whether the agent understood the material correctly and placed it in the right context.

The review is critical. I don't accept INGEST output blindly. I check: is the category correct? Do the tags make sense? Do cross-references point to genuinely related notes, not loose associations? Does the summary capture the essence of the source? That takes 2-3 minutes, but it gives confidence that the vault keeps its quality. The agent does 95% of the work - I take care of the crucial 5% that requires human judgment.

### COMPILE - synthesize from many sources

The agent combines multiple notes into a compiled article. Example: my note on LLM Knowledge Bases is a compiled article pulled from Karpathy's thread, my notes on RAG, and context from the vault. The agent reads the sources, identifies common threads, synthesizes, and creates a `compiled-note` with full citations.

What that looks like in practice: I say "compile everything I have about context engineering into a single note." The agent reads the catalog, identifies 7 related notes, reads them, extracts the key concepts, and builds a coherent article with sections and citations. Result: one comprehensive note instead of 7 scattered fragments, with clear attribution to sources.

This is a workflow I'd never do regularly by hand - because it requires reading and cross-referencing several documents at once. Seven notes of 500 words each is 3,500 words to read, understand, and synthesize. The agent does it in minutes - and crucially, it doesn't skip notes I'd miss because I forgot they existed.

### Q&A - answers with citations in 30 seconds

"What do my notes say about context engineering?" - the agent reads the indexes, identifies candidates, reads the notes, synthesizes an answer with citations. Good answers can flow back into the wiki as new compiled-notes.

This turns the knowledge base from a passive archive into an **active thinking tool**. Instead of digging through folders, I ask a question and get a synthesis from my own notes - with links to sources. The crucial part: the agent answers based on MY knowledge, not the general internet. If three months ago I captured an important insight from a conference - Q&A will find it and bring it back up, even if I forgot I'd written it down.

Another example: "Compare what my notes say about RAG vs what Karpathy describes as LLM Wiki." The agent reads both notes, identifies points of agreement and disagreement, and presents the comparison. That's the kind of analysis which, by hand, would require opening two documents and comparing paragraph by paragraph.

### LINT - health check

A periodic health check of the vault: broken wikilinks, orphan notes (notes with no connections), missing summaries, TODO markers, incomplete frontmatter. The agent generates a report into `_outputs/reports/` and proposes fixes.

A typical LINT report after a month:

- 4 broken wikilinks (notes moved/renamed without updating references)
- 2 orphan notes (added but never linked to the rest of the vault)
- 7 missing summaries (notes with an empty summary field in frontmatter)
- 3 notes with TODO markers (unfinished processing)

LINT is a workflow you don't think about until you see a report of 23 broken wikilinks after a month of adding notes. It's hygiene - like code linting. Not sexy, but without it a vault degrades in silence. The agent does it for me - regularly, without forgetting.

## From hand-written notes to 185 files maintained by the agent

The evolution of this system wasn't planned. I didn't sit down in 2022 with an architecture in mind. It was an organic process where each phase solved a concrete problem from the previous one.

**Phase 1 (2022-2024): Hand-written notes in Obsidian.** Classic setup - topical folders, wikilinks, tags. I captured notes from books, conferences, courses. Worked up to ~50 notes. After that, growing chaos: incomplete cross-references, forgotten content, duplicates. Searching for specific information started taking longer than just Googling it again from scratch. The typical PKM trajectory - enthusiasm, plateau, frustration.

**Phase 2 (2024-2025): The agent starts helping.** When I started working intensively with Claude Code, I naturally began using it for simple tasks in the vault. First formatting and filling in frontmatter - boring work, perfect for an agent. Then linking new notes to existing ones - the agent is better at this than I am, because it reads the full catalog every time. Finally - full source processing from scratch: drop a file, say `ingest`, the agent handles the rest. This is the phase when the first CLAUDE.md was born - still simple, ~80 lines, but already defining the structure and core rules.

**Phase 3 (2026): Karpathy LLM Wiki → formalization.** Karpathy's thread gave me a framework to name what I already had. Three layers - raw sources, wiki, schema - suddenly had official names. The navigation protocol stopped being "the way I do it" and became a documented procedure. Safety rules I'd kept in my head landed in CLAUDE.md. I formalized the processes, filled in missing pieces, tidied up the indexes. CLAUDE.md grew from 80 to 300+ lines.

Where I stand today: **185 notes**, 13 topical categories. Breakdown:

- `AI/` - 19 notes (Claude Code, harness engineering, context engineering, skills)
- `LIFE/` - 40 notes (books, knowledge, tools)
- `BUSINESS/` - 26 notes
- `CODE/` - 23 notes
- `PROJECTS/` - 12 notes (Qamera AI, Brain, Agentic Systems)

Workflow comparison - before and now:

- **Before:** read an article → maybe save the link in bookmarks → forget where and in what context → search again when I need it → lose 20 minutes reconstructing context
- **Now:** click Obsidian Web Clipper → the article lands in `_raw/inbox/` → I type `ingest` in Claude Code → the agent weaves the note into the knowledge network with cross-references → when I ask: Q&A in 30 seconds with citations and links to sources

> _"Wiki is a persistent, compounding artifact - cross-references ready, contradictions flagged."_

What compounds: the agent guards structure and standards, every note lands in the right place with the right links. Knowledge accumulates, it doesn't scatter. The more notes, the richer the network of connections - and the more valuable each next note, because the agent has more context to link against. It's a reversal of the traditional PKM problem, where more notes = more chaos. Here, more notes = a richer graph.

## Notes organized for the agent, not for aesthetics

This is the key mindset shift that changed my approach to PKM. You don't organize notes so YOU can search them more easily. You organize them so the **AGENT can find them more easily**.

The agent is the primary consumer of your knowledge base. You are the curator - responsible for sourcing (what you drop into the inbox), exploration (what questions you ask), and decisions (what to compile, what to archive). The agent handles the bookkeeping: creating notes, updating indexes, watching cross-references, flagging contradictions. That division lets you focus on thinking, not on administration.

**Progressive disclosure** minimizes context window usage. The agent doesn't have to read 185 files to answer a question. It reads 80 lines of vault-map, identifies the relevant area, reads a few specific notes. Sharper answers, lower cost, faster execution.

To see it in numbers: if the agent read the whole vault on every query, that's ~185 files × ~500 words = ~92,500 words injected into the context window. With progressive disclosure: vault-map (80 lines) + 3-5 relevant notes = ~3,000 words. **30x less context, but sharper answers** - because the agent knows what it's reading and why.

The parallel with agentic coding is direct:

|       | Agentic Coding                                    | LLM Knowledge Base                   |
| ----- | ------------------------------------------------- | ------------------------------------ |
| You   | Environment architect (specs, context, guardrails) | Curator (sourcing, questions, decisions) |
| Agent | Implements code                                   | Bookkeeper, writer, cross-referencer |

The agent doesn't replace thinking - it replaces bookkeeping. That's not a subtle difference. The decision about WHAT to ingest, what questions to ask, what to compile - that's still your job. The agent is a machine for maintaining order, not a machine for thinking on your behalf.

When you try to hand the agent decisions - you get generic, "safe" answers. When you hand over maintenance and focus on curation yourself - you get a system that compounds with every new note. Every source enriches the existing knowledge network. Cross-references form automatically. Contradictions between notes get flagged. The summary is always up to date.

> _"Shift: from 'developer who writes code' to 'architect who designs systems for agents to write code.'"_

The same shift applies to knowledge: from "person who maintains notes" to "curator who designs systems for agents to maintain knowledge." You decide what's worth saving. The agent takes care of making sure what you saved stays accessible, linked, and current.

## Takeaways

Five conclusions after three years of building this system:

1. **Methodology > tool.** Zettelkasten, Building a Second Brain, LLM Wiki - these are philosophies, not apps. Obsidian, Notion, Logseq - these are tools. What matters is understanding _why_ you organize knowledge a certain way, not _what in_. You can build the same system in Notion with an agent, or in plain VS Code with Markdown files. The tool is interchangeable - the rules of navigation, indexing, and progressive disclosure work everywhere.
2. **CLAUDE.md is a contract with the agent.** It evolves from experience - you start simple, add based on what the agent does wrong, remove what doesn't work. After a month you have a solid configuration. After a year - a mature system.
3. **Progressive disclosure works.** Three index levels (vault-map → catalog → graph) is not over-engineering. It's the only thing that lets the agent operate sensibly over 185+ notes without grepping the whole directory and polluting its context window.
4. **The agent doesn't replace thinking.** It replaces bookkeeping. That's a fundamental difference. When you try to hand the agent _decisions_ - you'll get generic answers. When you hand over _maintenance_ - you'll get a system that compounds.
5. **A Git repo as the foundation.** Version history, branching, collaboration - for free. Quartz 4 as an SSG gives you a public digital garden on GitHub Pages. The entire vault is a Git repo - every change tracked, revertable, diffable. If the agent does something bad (and it will, especially early on) - `git diff` shows what it changed, `git revert` undoes it. A safety net without which I wouldn't hand over control of 185 files.

If you want to start from zero and don't have a vault with an agent yet, read [Second Brain with Obsidian and Claude Code](/en/blog/second-brain-obsidian-claude-code-skills) - I describe there how to start from installing Obsidian through your first Skills. This article shows where you can get to after a few years of iteration - from a simple vault with a dozen notes to a system with 185 files, three layers, and four workflows, maintained by an AI agent.

You don't have to build all of this at once. Start with a CLAUDE.md of 50 lines, one workflow (INGEST), and one index (vault-map). The rest will come organically - the way it came for me.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Want to build a similar knowledge management system?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I'll help you design a knowledge base architecture with an AI agent - from the CLAUDE.md structure through navigation indexes to workflows tailored to your needs.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Resources

- [Karpathy's X thread](https://x.com/karpathy/status/2039805659525644595) - the original post about LLM Wiki (April 2026)
- [LLM Wiki gist on GitHub](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) - configuration and documentation
- [brain.lipowczan.pl](https://brain.lipowczan.pl) - my public vault (Quartz 4 + GitHub Pages)
- [Quartz 4](https://quartz.jzhao.xyz/) - Static Site Generator for Obsidian vaults
- [Obsidian](https://obsidian.md/) - Markdown note editor
- Related article: [Second Brain with Obsidian and Claude Code Skills](/en/blog/second-brain-obsidian-claude-code-skills) - how to start from zero
- [second-brain-template](https://github.com/plipowczan/second-brain-template) - a ready template to start your own second brain

## FAQ

<details open>
<summary>

### How does LLM Wiki differ from traditional RAG over documents?

</summary>

RAG (Retrieval-Augmented Generation) fetches text fragments on demand - you get an answer based on the nearest embeddings, but without broader context. LLM Wiki is a persistent knowledge base in which the agent actively builds and maintains notes: it creates cross-references, synthesizes knowledge from multiple sources, and flags contradictions. It doesn't answer a single question - it maintains a complete, evolving knowledge system.

</details>

<details open>
<summary>

### Do I need Obsidian to build a similar AI-powered knowledge management system?

</summary>

No - Obsidian is a convenient frontend with graph view and plugins, but it's not required. Any text editor plus a Git repo with `.md` files is enough. The key pieces are CLAUDE.md (the schema document defining how the agent should treat the vault) and the navigation indexes (vault-map, catalog, graph). You can build the same system in VS Code, Cursor, or even straight from the terminal.

</details>

<details open>
<summary>

### How long does it take to write a CLAUDE.md for a knowledge base, and how do I start?

</summary>

The first version takes 1-2 hours - you define the directory structure, a basic frontmatter schema, and one workflow (INGEST is a good choice). But CLAUDE.md is a living document that evolves with experience. You start with simple rules, watch what the agent does wrong, add corrections. After a month of regular use you'll have a solid configuration. The key rule: write it by hand, don't generate it with an LLM.

</details>

<details open>
<summary>

### What is progressive disclosure and why is it critical for an AI-agent knowledge base?

</summary>

Progressive disclosure is the principle of organizing notes in layers - from a general table of contents (vault-map, ~80 lines) through a catalog (catalog, ~650 lines) down to specific files. The agent reads only as much as it needs, without cluttering the context window with unnecessary information. That's the key difference between a knowledge base that "works" and one where the agent gets lost among 185 files and returns generic answers.

</details>

<details open>
<summary>

### Does an LLM Wiki system require a technical background to set up?

</summary>

The basic setup requires familiarity with Git, the terminal, and Markdown files - you don't need to code. The hardest part is writing a good CLAUDE.md that precisely defines how the agent should treat your vault. This article describes a mature system after 3 years of iteration, but you can start small - a single folder, a simple frontmatter schema, and the INGEST workflow. The article [Second Brain with Obsidian and Claude Code](/en/blog/second-brain-obsidian-claude-code-skills) gives you a solid starting point.

</details>
