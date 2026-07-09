---
id: 30
slug: not-all-rag-is-equal
title: "Not All RAG Is Equal: a Graph for Code, an Index for Notes"
excerpt: >-
  RAG is a family, not one technique. Code favors structural retrieval
  (AST, LSP, graphs), notes a curated index. A map for matching
  mechanism to material.
category: AI
author: Pawel Lipowczan
date: 2026-07-09
readTime: 12 min
image: /images/og-rag-ragowi-nierowny.webp
tags:
  - AI
  - RAG
  - Claude Code
  - Second Brain
  - Retrieval
lang: en
alternateSlug: rag-ragowi-nierowny
---

## "RAG mostly means vector databases to me" - an objection that gets it right

While running my [free LLM Wiki course](/llm-wiki) (course in Polish), I got a comment from a technical reader, which I paraphrase: "RAG mostly means vector databases to me. But for code there are more interesting approaches, based on syntactic analysis - codebase-memory-mcp, for example, which its authors call Hybrid LSP. Probably mediocre for notes, but for coding it works quite well."

He's right. In both halves of that sentence. Instead of pushing back, I'd rather unpack it - inside that comment sits a map missing from most discussions of **RAG** (Retrieval-Augmented Generation - a technique where the model pulls content from an external source before answering, instead of relying only on what it memorized in training).

"Add RAG to the project" sounds like a decision. It isn't one. It's like saying "use a database" without specifying relational, document or graph. By the end of this article you'll be matching the retrieval mechanism to the material: one for code, another for notes. You'll also know when plain grep (searching files for an exact string) beats everything else.

## RAG is a family of techniques, not one thing

The "RAG = vector database" association comes from two years in which most deployments looked exactly like that. A vector database stores **embeddings** (numeric representations of text that let you search by similarity of meaning rather than exact words). That's one flavor of RAG, not its definition.

Take a broader definition: RAG is any solution that cuts **token** usage (tokens are the units in which a model meters text) and answer drift by pulling in the right content. Four substrates fit:

- **lexical** - grep and BM25 (a classic text-relevance scoring algorithm), searching by exact words;
- **semantic** - vectors and similarity of meaning;
- **structural** - graphs of symbols, definitions and calls, built from the code itself;
- **curated index** - an agent-maintained table of contents for the knowledge base, as in [LLM Wiki](/en/blog/karpathy-llm-wiki-knowledge-base).

My second brain (a knowledge base of markdown files, maintained by an agent) is RAG under this definition too. The mechanism just differs: instead of computing vector similarity, the agent reads a lightweight index and pulls 2-3 relevant notes. The argument is not about the goal. It is about the mechanism - and **the mechanism has to fit the material**.

## Code parses into symbols, notes don't

Code differs from notes in one property that changes everything: its grammar is formal, and a parser resolves it unambiguously. The call `user.profile.name()` resolves exactly - you know where the definition lives, what type comes back, who else calls it. From material like that you can build an **AST** (abstract syntax tree - the structure a parser breaks code into), and from many trees a **call graph** (a map of "who calls whom" across the whole repository). That structure is precise and verifiable.

Notes have grammar too - natural language grammar - but no machine resolves it unambiguously. The sentence "the decision was right because the client already ran PostgreSQL" does not decompose into symbols: no definitions, no types, no unambiguous references. That's why a curated index plus links between notes works for a knowledge base, and a syntax graph doesn't.

Researchers from Duke and Snowflake put it most sharply in the HOMER paper on agent memory: **similarity ≠ causality**. Two fragments being close in embedding space is not the same as one depending on the other. Ask "who calls this function" and a vector answers with similarity-based guessing, while a graph answers with facts. My reader noticed the same thing from the practical side: "mediocre for notes, works for coding". Code has structure you can index without guessing - notes don't.

## Case study: codebase-memory-mcp

The tool from the objection shows well what mature code retrieval looks like. `codebase-memory-mcp` (DeusData) is an **MCP** server (Model Context Protocol - the standard for plugging tools into an AI agent) that indexes an entire repository into a persistent knowledge graph of the code.

Despite the "syntactic analysis" label, it's a hybrid of three layers:

1. **Symbol graph** - the tree-sitter parser (breaks code into ASTs, supports 158 languages) plus "Hybrid LSP", a lightweight reimplementation of what **LSP** (Language Server Protocol - the engine behind "go to definition" and "find references" in your editor) does: resolving types, imports and inheritance without running a full language server.
2. **Vectors** - built-in `nomic-embed-code` embeddings, no API key needed.
3. **Full text** - BM25 word search.

The point: the tool uses vectors itself - it just doesn't start with them. It starts with structure and saves semantic similarity for fuzzy questions.

The number in the README headline is striking: **3,400 tokens instead of 412,000** on the same task. Five graph queries instead of grepping the repository file by file - a **99.2%** reduction. One caveat: that's the authors' own claim (README plus an arXiv preprint), not an independent measurement. The direction matches what I know from my own note base, though: switching from "search everything" to "index first" cuts the cost of a single question from ~35k to ~3k tokens, roughly **30x**. Two different materials, two pairs of numbers, one pattern: structure before brute-force reading.

```text
Question: "what breaks if I change the signature of update_profile()?"

grep file by file:  dozens of searches and reads  ->  ~412,000 tokens
symbol graph:       5 structural queries          ->    ~3,400 tokens

(numbers: claimed by the codebase-memory-mcp authors)
```

Honestly about the limits: full type resolution works for Python, TypeScript/JavaScript, Go, Rust, Java, C, C++, C#, Kotlin and PHP. For other languages the tool falls back to text matching - you'll get an answer, just a less precise one.

## A map of retrieval substrates

codebase-memory-mcp is one point on a larger map. A survey of code-retrieval research (arXiv:2510.04905) splits the methods into **graph-based** (the core is an explicitly built graph of code structure) and **non-graph** (the repository treated as a bag of text, searched lexically or semantically). Six practical approaches line up along that axis:

| Substrate | How it works | Examples |
|-----------|--------------|----------|
| AST graph (tree-sitter) | parse the code, build a graph of definitions and calls | codebase-memory-mcp, Graphify, Aider's repo map |
| LSP as context | the agent asks a language server about symbols and types | Serena, mcp-language-server |
| Persisted facts (SCIP/LSIF) | facts about code stored and queried like a database | Glean (Meta), srctx |
| Agentic grep | the agent generates and runs its own searches, zero index | Claude Code, Cline, GrepRAG |
| Vectors (semantic) | embedding similarity | classic RAG |
| Curated index next to code | a tree of `AGENTS.md` files; the agent descends from root to the edit site | DOX |

**SCIP and LSIF** are formats for persisting facts about code (who defines, who uses), storable in the repository and shareable across a team. The sixth row needs a word of explanation: `AGENTS.md` is an instruction file a coding agent reads automatically when it starts working in a repository. The DOX pattern (the `agent0ai/dox` repo) multiplies it - one `AGENTS.md` per folder, with the folder's purpose, local conventions and an index of subfolders - and the agent walks that tree from the root down to the edit site, updating the docs after each change. It's the same curated index as for notes, just versioned together with the code. There are more approaches - execution-path graphs, hybrids with team knowledge - but these six cover most decisions you'll actually make.

## Honestly: when grep beats the graph

If structure always won, this article would be shorter. It doesn't win.

The GrepRAG preprint (Zhejiang University, January 2026) flips the perspective. Instead of building any index, the model generates around 10 `ripgrep` commands itself, runs them against the raw repository and re-ranks the hits with BM25 weights. Zero index means zero stale index - nothing drifts out of sync with the code. According to the authors, the approach matched or beat graphs and vectors on code completion, with retrieval ~13x faster on average (35x in the extreme case). It's a preprint with self-reported results - I treat it as a claim, not a fact.

The stronger argument came from practice. The Claude Code team dropped an early version built on RAG with a local vector database, because agentic search - grep plus file navigation - worked better and had no stale-index problem. Cline, another popular coding agent, published the same position in its "why we don't index your codebase" manifesto.

On the other side stands RepoGraph (ICLR 2025, peer-reviewed): adding a repository graph improved four agents' results by an average of **32.8%** on SWE-bench-Lite (a benchmark of fixing real bugs from GitHub projects). Grep versus graph - who's right?

Both camps. The task decides:

| Task | Winner | Why |
|------|--------|-----|
| Local completion of a fragment | agentic grep | cheap, no index, no drift - the answer is nearby |
| A change crossing many files | graph / LSP | you need the map of calls and types that a local window won't show |
| "Who calls X? What breaks after a change?" | LSP / definition graph | an exhaustive result, not a ranked list of candidates |
| Fuzzy "where's the login logic" | vectors | matching intent, not exact structure |

So in practice you don't choose "graph or grep". Grep takes the local work, structure takes changes that cross module boundaries, vectors take fuzzy questions about intent. codebase-memory-mcp quietly concedes the same: one tool ships a graph, embeddings and graph-augmented grep.

One gap I have to note. All these tools are verified on Python, TypeScript, Go or Rust. For C# and Roslyn (the .NET compiler) I found no confirmed deployment of any of them. The LSP bridges should work in theory; in practice that's a test to run, not a fact to cite. I barely write code by hand anymore - agents do it - but that doesn't void the problem: the retrieval an agent uses to read a repository still depends on language support. If your team lives in .NET, test before you trust the benchmarks.

## An agent's two layers of memory

Back to the objection. "Structural for code, mediocre for notes" - agreed. But the conclusion isn't "pick one". In a coding agent you want both layers at once, because they remember different things.

**The graph and LSP remember what the code looks like**: what calls what, where the definition lives, what breaks after a signature change. **The second brain remembers why the code looks that way**: which convention we adopted, what we tried before and what failed, why we picked this library and not that one.

The graph will give you the full call tree. It won't tell you that we enforced the current convention after the previous one blew up production in March. That information lives in no AST, because nobody wrote it there. It stayed in people's heads, in Slack threads or - if you keep a knowledge base - in a single note with a date and a rationale.

Code doesn't record intent. A brain does.

Where does the `AGENTS.md` tree live in this split? In between. Local folder conventions - "tests here are written like this, don't touch that module" - belong right next to the code, versioned with it, and that's exactly what the DOX pattern does. The brain keeps, one floor higher, what no single repository can hold: decisions and standards shared across projects, the history of approaches, lessons from failures. Two layers become three: the graph remembers structure, `AGENTS.md` remembers local conventions, the brain remembers knowledge above the project.

That's why my reader was right in both halves of his sentence - and his objection describes not competition but a division of labor between the memory layers of one agent. Keep the code's structure in a graph. Keep decisions, conventions and lessons in a note base - [portable and agent-readable](/en/blog/okf-standard-portable-knowledge-base). How to build one from scratch is what I show in my [free LLM Wiki course](/llm-wiki) (in Polish).

## Key Takeaways

1. **Not all RAG is equal.** Pick the substrate: lexical (grep/BM25), semantic (vectors), structural (AST/LSP/graph) or a curated index. A vector database is one flavor, not the definition.
2. **Code parses into symbols, notes don't.** Default to structure for changes crossing file boundaries; use an index and links for notes.
3. **Grep is a contender, not a backup.** No index beats a stale index for local work - Claude Code and Cline built their whole approach on that.
4. **Match the mechanism to the task, not the fashion.** Treat README and preprint benchmarks as the authors' claims until someone reproduces them independently.
5. **Give a coding agent both layers of memory.** The graph remembers structure, the brain remembers intent, and local folder conventions belong next to the code (an `AGENTS.md` tree). Only together do they answer both "what breaks" and "why it's like this".

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Wondering what retrieval to feed your AI agent?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I help teams pick their agents' memory layers for real projects: a graph for code, a knowledge base for decisions and conventions. I'll tell you what will work for your team before you buy another tool.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
  <p class="mt-4 text-sm text-gray-400">
    You can build the knowledge layer yourself - my <a href="/llm-wiki" class="text-primary-500 hover:text-primary-400">free LLM Wiki course</a> (in Polish) shows how, step by step. The course template pairs with a code repository.
  </p>
</div>

## Useful Resources

- [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) - a code graph as an MCP server; preprint: [arXiv:2603.27277](https://arxiv.org/abs/2603.27277)
- [Retrieval-Augmented Code Generation - a survey](https://arxiv.org/abs/2510.04905) - the graph vs non-graph taxonomy
- [GrepRAG](https://arxiv.org/html/2601.23254v2) - index-free retrieval: the model generates its own ripgrep commands
- [RepoGraph](https://arxiv.org/abs/2410.14684) - peer-reviewed evidence that a repository graph improves agent results
- [Cline: why we don't index your codebase](https://cline.bot/blog/why-cline-doesnt-index-your-codebase-and-why-thats-a-good-thing) - the agentic-grep manifesto
- [Serena](https://github.com/oraios/serena) - LSP as agent tools (symbols, references, refactoring)
- [DOX](https://github.com/agent0ai/dox) - a self-documenting `AGENTS.md` tree: a curated index versioned with the code
- [Aider's repo map](https://aider.chat/docs/repomap.html) - the ancestor of repository maps with a token budget
- [How Karpathy's LLM Wiki helped me organize my knowledge base](/en/blog/karpathy-llm-wiki-knowledge-base) - a curated index in practice
- [I built a second brain. It matched Google's standard (OKF)](/en/blog/okf-standard-portable-knowledge-base) - a portable note base

## FAQ

<details open>
<summary>

### Is RAG always a vector database and embeddings?

</summary>

No. A vector database is one of four retrieval substrates, next to lexical (grep, BM25), structural (AST/LSP graphs) and a curated index. If you define RAG as pulling the right content before the model answers, then LLM Wiki with its index is RAG too - just without vectors.

</details>

<details open>
<summary>

### When is grep enough for searching code, and when do you need a symbol graph?

</summary>

Grep is enough for local work: completing a fragment, a known string, an answer near the edit site. You need a graph or LSP for changes crossing file boundaries and for questions like "who calls X, what breaks after a change". There grep returns false positives and vectors guess.

</details>

<details open>
<summary>

### How does retrieval for code differ from retrieval for notes?

</summary>

Code has a formal grammar that a parser resolves unambiguously, so you can build an exact graph of definitions, types and calls from it. A note's text doesn't decompose into symbols - the sentence "why we made this decision" has no definitions or types. That's why a curated index and links between notes work for a knowledge base, and structure works for code.

</details>

<details open>
<summary>

### Does LLM Wiki replace tools like codebase-memory-mcp?

</summary>

No, they're complementary memory layers for an agent. The code graph remembers structure: calls, types, dependencies between files. LLM Wiki remembers intent: decisions, conventions, rejected approaches. A coding agent uses both at once.

</details>

<details open>
<summary>

### What does "similarity ≠ causality" mean for vector databases?

</summary>

Two fragments being close in embedding space doesn't mean one depends on the other. On structural questions like "who calls this function", a vector answers with similarity - guessing - while a call graph answers with facts. The phrase comes from the HOMER paper (Duke + Snowflake) on agent memory.

</details>

<details open>
<summary>

### Where should project conventions live - in AGENTS.md files or in a second brain?

</summary>

Keep local folder conventions (test style, modules that must not be touched) next to the code - in an `AGENTS.md` tree versioned with the files, as in the DOX pattern. Keep what crosses a single repository in the second brain: architectural decisions with rationale, standards shared across projects, the history of rejected approaches. The symbol graph complements both - it remembers the structure no markdown describes.

</details>
