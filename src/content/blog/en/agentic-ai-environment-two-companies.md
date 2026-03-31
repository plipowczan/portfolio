---
id: 22
slug: agentic-ai-environment-two-companies
title: "My agentic environment — how I'm building an AI OS for two companies"
excerpt: "Two repositories, eight agents, zero vendor lock-in. How I built an agent system managing finances, legal, and marketing for two companies."
category: AI
author: Pawel Lipowczan
date: 2026-03-23
readTime: 14 min
image: /images/og-srodowisko-agentowe-ai-dwie-firmy.webp
tags:
  - AI
  - Claude Code
  - Agent Skills
  - Automation
  - Multi-Agent System
  - Git
lang: en
alternateSlug: srodowisko-agentowe-ai-dwie-firmy
---

# My agentic environment — how I'm building an AI OS for two companies

I sit down at my computer in the morning, open the terminal and say: "check the business account balance and compare it with the financial plan." The CFO agent loads context, connects to the Revolut API, analyzes recent invoices, and leaves three recommendations. Then I ask another agent about competitor monitoring — and get a briefing. A third checks legal deadlines and reminds me about an upcoming client contract deadline.

Each of these agents works under my supervision — I deliberately don't let them run fully autonomously yet. I believe that at this stage it's worth going through the operation under control a few times before you set up a scheduler for recurring tasks. But the fact that I have **eight specialized agents**, each managing a different area — finance, legal, marketing, content, product — is already a massive shift. And most importantly — the same set of agents serves **two different companies simultaneously**.

In the article about [Skills 2.0](/blog/skills-2-0-multi-agent-system-zarzadzanie-firma) I described how I built a multi-agent system. Now I'll show you something deeper — the **architecture** behind it. Because it's not the agents that are revolutionary. What's revolutionary is the separation of layers that makes the entire system portable, versioned, and independent of any AI provider.

In this article you'll see:

- The three-layer architecture (Skills → Context → Tools) and why this separation is crucial
- How the same set of agents serves two companies with completely different contexts
- Why Git is the foundation of trust in AI — and why I wouldn't give agents freedom without it
- How my approach compares to alternatives: Perplexity Computer, OpenClaw, Claude Dispatch

## Two companies, one system

I work daily with two hub-repositories that aren't typical code projects. They're **advisory systems built on AI agents**, centered around Markdown files and CLI scripts.

### 200IQ Labs — a technology company

**200IQ Labs** is a simple joint-stock company that develops the product **Qamera AI** (an AI virtual photography studio for e-commerce) and offers agentic environment implementations for businesses.

The `agentic-ai-system` repository contains the full company context — finances, team, brand, operations, clients. Everything in Markdown with "Last updated" headers so agents know whether the data is current.

Agents in this repo include: **CFO** (with Revolut Business API, Stripe, inFakt integrations), **Tax Advisor**, **Lawyer**, **Business Consultant**, **Product Manager**, **LinkedIn Content**, and **Marketing**. Each has its own `SKILL.md` with instructions, references, and tools.

### PLSoft — sole proprietorship

**PLSoft** is my sole proprietorship active since 2008 — training, consulting, and implementations in automation and AI. The `agentic-ai-private` repository has the same architecture but with a different business context.

The same **shared-skills** (CFO, Tax Advisor, Legal, Business Consultant) work here with PLSoft data instead of 200IQ Labs data. On top of that there's a unique skill **Coach The Five** — business coaching based on Tomasz Karwatka's methodology for the first 5 years of a company. There's also context for the **Tech News Weekly** newsletter (~700 subscribers) and personal brand on LinkedIn.

**Key insight:** same agents, different contexts. The CFO agent knows how to analyze finances — that's the skill. But **which** finances it analyzes — that's the context. This separation is the foundation of the entire architecture.

## Three-layer architecture

Both repositories are built on the same architectural pattern. Think of it as a stack:

```text
┌─────────────────────────────────────┐
│  IDE (Claude Code / Cursor / etc.)  │  ← User interface
├─────────────────────────────────────┤
│  Skills (SKILL.md + references/)    │  ← Domain knowledge (portable)
├─────────────────────────────────────┤
│  Context (context/*.md)             │  ← Company data (unique per company)
├─────────────────────────────────────┤
│  Tools (scripts CLI)                │  ← API integrations
└─────────────────────────────────────┘
```

Each layer has a clearly defined responsibility and is independent of the others. I can swap the IDE without changing skills. I can give a client the same skills with their company data. I can add a new tool without modifying domain knowledge.

### Skills — domain knowledge

A **Skill** is a modular instruction in a `SKILL.md` file with a `references/` directory containing detailed reference materials. The structure looks like this:

```yaml
---
name: cfo
description: >-
  Financial advisor and fractional CFO for business analysis.
  Use when analyzing cash flow, runway, costs, profitability.
---

# CFO Agent

## Quick Reference
| Aspect     | Value                          |
|------------|--------------------------------|
| Role       | Chief Financial Officer        |
| Integrations | Revolut, Stripe, inFakt      |
| Triggers   | finances, costs, revenue       |

## Workflow
1. Check data freshness (Last updated)
2. Load financial context
3. Perform analysis
4. Prepare recommendations
```

Key characteristics of skills:

- **Portability** — the CFO skill works identically at 200IQ Labs and PLSoft. Only the context (company data) changes, not the knowledge (how to analyze finances).
- **Progressive disclosure** — `references/` are loaded only when the conversation requires it. Saves context window, which is limited and expensive.
- **Shared vs private split** — `shared-skills` (Apache 2.0, open-source) is domain knowledge I can share with clients. `private-skills` is proprietary logic specific to my business.

### Context — company data

Context is data **unique to each company**. The directory structure looks like this:

```text
context/
├── company/
│   ├── overview.md          # Mission, structure, registration data
│   ├── team.md              # Team, roles, competencies
│   └── operations.md        # Operational processes
├── finance/
│   ├── current-state.md     # Current balances, runway
│   ├── budget-2026.md       # Financial plan
│   └── revenue-streams.md   # Revenue sources
├── clients/
│   ├── active/              # Active clients
│   └── pipeline/            # Potential clients
└── brand/
    ├── tone-of-voice.md     # Communication style
    └── linkedin-strategy.md # Social media strategy
```

Each Markdown file contains a **"Last updated: YYYY-MM-DD"** header. That's the minimum — the agent sees whether the data is a week or three months old and can warn that the context needs updating.

### Tools — API integrations

The third layer is **lightweight CLI scripts** (bash/Python) fetching live data from external systems. I deliberately chose this approach over heavy MCP frameworks.

```bash
#!/bin/bash
# tools/revolut-balance.sh — fetch current balances from Revolut Business API
curl -s -H "Authorization: Bearer $REVOLUT_TOKEN" \
  "https://b2b.revolut.com/api/1.0/accounts" \
  | jq '.[] | {currency, balance}'
```

Why lightweight scripts instead of MCP? Three reasons:

1. **Lower context window usage** — MCP tool definitions can take up 40,000+ tokens. A CLI script is a few lines.
2. **Easier debugging** — `bash -x tools/revolut-balance.sh` and you see exactly what's happening.
3. **Zero dependencies** — bash and curl are everywhere. No special frameworks needed.

That doesn't mean MCP is bad — for large organizations with dozens of integrations it makes sense. But at my scale, lightweight scripts win on pragmatism.

## One system, many IDEs

One of the design goals was **independence from any specific IDE**. Skills in Markdown format work in any tool that reads files. But for this to work in practice, synchronization is needed.

The architecture relies on **Git submodules** and **symlinks**:

- `shared-skills/` — Git submodule with open-source skills (CFO, Legal, Tax, Business Consultant)
- `private-skills/` — separate repository with proprietary skills
- Symlinks to IDE directories: `.claude/skills/`, `.github/copilot/`, `.cursor/skills/`, `.agent/skills/`

Automatic synchronization happens via a script and git hooks:

```bash
#!/bin/bash
# tools/sync-skills.sh — sync skills to all IDEs
SKILLS_DIR="shared-skills"
TARGETS=(".claude/skills" ".github/copilot" ".cursor/skills")

for target in "${TARGETS[@]}"; do
  mkdir -p "$target"
  for skill in "$SKILLS_DIR"/*/; do
    skill_name=$(basename "$skill")
    ln -sfn "../../$skill" "$target/$skill_name"
  done
done

echo "Skills synced to ${#TARGETS[@]} IDE targets"
```

Git hooks (`post-checkout`, `post-merge`) automatically run this script after submodule updates. The result? You update a skill in one place — the change propagates to Claude Code, Cursor, Copilot, and Antigravity simultaneously.

### Auto-triggering

You don't have to manually say "now I want to talk to the CFO." Agents **activate automatically** based on keywords in your query. Type "how much do we have in the account?" or "analyze costs" — and the CFO agent kicks in, loads the financial context, and responds from the position of a financial director.

This works thanks to the `description` field in the skill's metadata. Good descriptions with precise triggers ("cash flow", "runway", "costs", "revenue") ensure the orchestrator picks the right agent without user intervention.

## Git as the foundation of trust

This is the section I consider the most important in the entire article. Because agent technology changes every week. But the **trust problem** will stay with us for years.

People are afraid to give AI access to their data and files. And they're right — I described real threats in the article about [OpenClaw](/blog/openclaw-bezpieczenstwo-agentow-ai), where 28 thousand instances were exposed to the internet. But the solution isn't to restrict AI to uselessness. The solution is **building control systems**.

Git gives me exactly that:

- **`git diff`** — I see exactly what the agent changed in every file
- **`git revert`** — I roll back at any time to any point
- **`git log`** — full change history with timestamps and descriptions
- **`git blame`** — I know who (or what) modified a specific line

This creates a trust loop: **the more control → the more freedom for the agent → the faster it delivers value → the more I gain**.

I wrote about a similar approach in the context of knowledge management in the article about [Second Brain with Obsidian and Claude Code](/blog/second-brain-obsidian-claude-code-skills). There it was about organizing notes. Here the stakes are higher — it's about financial, legal, and operational data of two companies.

### Claude.ai Dispatch — consciously limiting permissions

Besides Claude Code I also use the **Dispatch** feature in Claude.ai, which enables working with files and connected tools. But I **consciously limit autonomy and access**:

- **Read access:** ClickUp (tasks), Revolut (balances), Stripe (subscriptions), GitHub repositories
- **No write access** — the agent can analyze data but can't modify anything in those systems
- **Scope control** — I precisely select which tools are connected

Anthropic is the guarantor of environment security, but the final decision on scope of access is mine. That's a fundamental difference from the [OpenClaw](/blog/openclaw-bezpieczenstwo-agentow-ai) approach, where by default the agent has full system access — and the user is expected to do the sandboxing.

## How this compares to the market

The "AI agents" market exploded in the first quarter of 2026. To put my approach in context, let's compare four different models:

| Aspect | My environment | Claude Dispatch | Perplexity Computer | OpenClaw |
|--------|-----------------|-----------------|---------------------|----------|
| **Deployment model** | Self-managed repos + IDE | Cloud + local hybrid | Fully managed SaaS | Self-hosted runtime |
| **Data control** | 100% local (Git) | Hybrid (Anthropic servers + local) | Cloud provider | 100% local |
| **Cost** | $0 infrastructure + API calls | $20-200/mo | $200+/mo | $0 + API calls |
| **Vendor lock-in** | Zero (Markdown, YAML) | Anthropic ecosystem | Perplexity ecosystem | Low (open source) |
| **Security** | Git + conscious permissions | Sandbox VM, ~50% reliability | Isolated under K8s | Requires own sandboxing |
| **Multi-IDE** | Yes (symlinks) | No (only Claude) | No (web UI) | No (own runtime) |
| **For whom** | Tech leaders, developers | Claude users | Business without DevOps | Power users, self-hosted |

### Why I chose my approach

**Full control.** My data never leaves my repositories (except for API calls to models). Company contexts — finances, clients, strategy — live in Git, not on a provider's servers.

**Portability.** If Claude Code stopped existing tomorrow, my skills would still work in Cursor, Copilot, or any other tool that reads Markdown. Zero migration.

**Markdown as lingua franca.** A universal format, readable by both humans and LLMs. No vendor lock-in. No proprietary formats.

**Git as an audit layer.** Every change is tracked. I can compare state before and after an agent's action. I can return to any point in time.

Perplexity Computer is great for companies that want "plug and play" for $200/mo. OpenClaw offers incredible flexibility but requires solid DevOps. Claude Dispatch is an interesting direction but still a research preview. My approach requires more work upfront, but gives **full control and zero dependencies**.

## What works, what doesn't

After several weeks of intensive use of this system across two companies, I have a clear picture of what works well and what needs work.

### What works well

1. **Separation of skills from context** — I can give a client the same set of agents, they plug in their company data and it works. Tested on two companies.
2. **Git as a security layer** — full audit, rollback, change comparison. Fundamental for trust.
3. **Markdown as lingua franca** — universal, readable, no vendor lock-in. Works in every IDE and with every model.
4. **Lightweight bash/Python integrations** — lower context window usage than MCP, easier debugging.
5. **Progressive disclosure** — a skill loads references only when needed. Critical with a limited context window.
6. **Auto-triggering** — agents activate automatically. No need to manually choose "now I want to talk to the CFO."

### What needs improvement

1. **Memory portability across platforms** — skills work in many IDEs, but memory and conversation state are locked per platform. Claude Code doesn't know what I said in Cursor.
2. **Context freshness** — "Last updated" headers are the bare minimum. Missing automatic warnings when data is stale and auto-update mechanisms.
3. **Client onboarding** — onboarding a new client is ~4h of work. Too much. The `environment-setup` skill helps, but I need a more automated process.
4. **No CI/CD for skills** — skill quality verification is manual (via skill-creator evals). Missing an automated pipeline that tests whether a skill still works after a change.
5. **Sandbox** — Nanoclaw (sandbox from NVIDIA) has potential for autonomous overnight tasks (analyses, reports), but the security model needs refinement before I trust it with real data.

## Six principles of agentic environment design

Based on these experiences, six principles crystallized that I treat as foundations:

1. **Version control is fundamental** — without Git there's no trust. Without trust there's no autonomy for the agent. Without autonomy the agent is useless.
2. **Separate knowledge from data** — skills (portable, open-source) vs context (unique per company, private). This is the same principle as separation of concerns in programming.
3. **Limit permissions consciously** — read yes, write with control, autonomy proportional to the level of audit. Don't give the agent full access "because it's convenient."
4. **Build on open formats** — Markdown, YAML, CLI scripts. Zero vendor lock-in. Tomorrow you can switch AI providers without changing architecture.
5. **Progressive disclosure** — don't load everything at once. Context window is limited and expensive. A skill should load references only when needed.
6. **Code-first, no-code when necessary** — agents should be tools for technical people, not substitutes for them. For clients without a technical team — no-code alternatives.

## What's next

This isn't a finished product — it's a **living system** that evolves every day. A few directions I'm actively working on:

- **Standardizing agent memory** — how to make memory and conversation context portable across platforms? Today Claude Code, Cursor, and Copilot have separate memories. This needs solving.
- **Sandbox for autonomous tasks** — Nanoclaw from NVIDIA has potential for overnight analyses and reports. But the security model needs more work before I trust it with real data.
- **Scaling to a team** — shared skills, different contexts, different permission levels. How to give a junior read-only access to the legal agent, and a senior full permissions?
- **Measuring ROI** — how much time am I saving? What's the decision quality? How much less context-switching? I need metrics, not hunches.

I'll share progress as I go. If you're building something similar or considering deploying an agentic environment at your company — I also describe technical details in the article about [OPSX Workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai) and [5 techniques for working with Claude Code](/blog/5-technik-pracy-z-claude-code).

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Want to build an agentic environment for your company?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I'll help you design an AI agent architecture tailored to your business — from process analysis through skill building to integration with the tools you already use.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## FAQ

<details open>
<summary>

### What is an agentic AI environment and how does it differ from a single chatbot?

</summary>

An agentic environment is a system of multiple specialized AI agents with access to tools, company data, and integrations with external systems. Unlike a chatbot, agents have persistent memory (they remember context between sessions), automatic triggers (they activate on keywords), and can manage specific areas of a company — finance, legal, marketing. A chatbot answers questions; an agentic environment **manages processes**.

</details>

<details open>
<summary>

### How much does it cost to build your own agentic environment based on Agent Skills?

</summary>

Infrastructure costs are $0 — skills and contexts are Markdown files in a Git repository, requiring no special hardware. The only cost is API calls to AI models (Claude, GPT, Gemini). For typical business use that's $20-200/mo for the API, depending on intensity and chosen model. On top of that, there's configuration time — the first deployment requires ~4h of technical work.

</details>

<details open>
<summary>

### Do I need programming skills to deploy an agent system at my company?

</summary>

Yes, basic technical skills are needed — terminal operation, Git, and editing Markdown files. This is a code-first approach where agents are tools for technical people. For companies without a technical team, ready-made SaaS solutions like Perplexity Computer ($200/mo) or Claude Dispatch may be a better choice — they give less control but zero configuration.

</details>

<details open>
<summary>

### How do I ensure the security of company data when working with AI agents?

</summary>

Three key elements: Git as an audit layer (you see exactly every change an agent makes to files), consciously limiting permissions (read-only API access, zero writes to external systems without approval), and context separation (company data separated from domain knowledge in skills). Version control eliminates fear — you can always roll back changes via `git revert`.

</details>

<details open>
<summary>

### Does this system work only with Claude Code, or can I use Cursor or another IDE?

</summary>

The system is deliberately independent of any specific IDE. Skills in Markdown format work in Claude Code, Cursor, GitHub Copilot, and Antigravity simultaneously thanks to symlinks and git hooks. Changing IDEs doesn't mean losing configuration or agent knowledge. That's a key advantage of the approach based on open formats — zero vendor lock-in.

</details>
