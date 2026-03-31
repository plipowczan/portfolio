---
id: 21
slug: skills-2-0-multi-agent-system-company-management
title: "Skills 2.0 - how I'm building a multi-agent system to manage my company"
excerpt: "How to go from scattered AI prompts to an organized system of agents managing your company's finances, legal, and marketing."
category: AI
author: Pawel Lipowczan
date: 2026-03-08
readTime: 14 min
image: /images/og-skills-2-0-multi-agent-system.webp
tags:
  - AI
  - Claude Code
  - Skills
  - Automation
  - Multi-Agent System
  - Agent Skills
lang: en
alternateSlug: skills-2-0-multi-agent-system-zarzadzanie-firma
---

For the past few days I've been building something I've been looking for a long time — a system where AI agents don't just answer questions, but **manage** specific areas of my companies. Both 200IQ Labs (qamera.ai) and PLSoft.

You know the problem if you run a business and use AI. You have a Claude Project with a CFO prompt. A separate one with marketing prompts. Obsidian full of notes. Five ad-hoc conversations a day where you explain context from scratch. Every session is a tabula rasa. Every agent knows nothing about what the other one is doing.

In [5 techniques for working with Claude Code](/blog/5-technik-pracy-z-claude-code) I described PRD-first development, modular rules, and turning repetitive tasks into commands. That was the foundation. Now I'm jumping to the next level — **Skills 2.0** + **Agent Skills standard** + **Git** = a multi-agent system that works like a team of specialists. Each agent knows its role, has its own tools, and doesn't step on the others' toes.

In this article I'll show you what it looks like from the inside — from the problem of scattered contexts, through the architecture of three repositories, to a practical example of building a CFO agent step by step.

## Why AI in business is still chaos

Anyone who seriously uses AI in business eventually hits the same wall. You have several Claude Projects — one with a CFO prompt, another with content creation prompts, a third for legal analysis. On top of that, Obsidian full of notes and ad-hoc chats in the browser. It looks like this:

```text
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│Claude Project│  │   Obsidian   │  │  Ad-hoc chat │
│   "CFO"      │  │   "Notes"    │  │  "Help me"   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
               ❌ Zero orchestration
               ❌ No shared context
               ❌ No versioning
```

Four fundamental problems with this approach:

- **No orchestration** — agents don't know about each other. The CFO agent doesn't know the marketing agent just planned a campaign that requires budget. Each one operates in a vacuum.
- **No versioning** — you change a system prompt in a Claude Project and have no idea what was there before. You don't know if the agent works better or worse after the change. No history, no diffs.
- **No testing** — how do you know your CFO agent generates good reports? You check manually, every time. Zero automation, zero repeatability.
- **No context separation** — a system prompt in a Claude Project is text in a field. No structure, no modularity. Everything in one place, with no data isolation between companies.

This isn't a tool problem. It's an **architecture** problem. Or rather — the lack of one.

I wrote about this in the context of knowledge management in the article about [Second Brain with Obsidian and Claude Code](/blog/second-brain-obsidian-claude-code-skills). There it was about organizing notes and personal knowledge. Now the stakes are higher — it's about managing a company.

## What are Skills in Claude Code

Before we get into the multi-agent system, let's clarify the fundamentals. **Skills** in Claude Code are modular instructions — recipes — that teach an AI agent specific workflows, processes, and abilities. These aren't ordinary prompts. A Skill has access to the file system, web search, scripts, and tools. It lives as a `SKILL.md` file in a repository, is versioned through Git, and loaded automatically when the agent needs it.

The evolution looked like this:

1. **Prompt** — text typed ad-hoc into a chat. Zero persistence, zero structure.
2. **CLAUDE.md rules** — instructions in a repository. Persistent, but monolithic — one file with everything.
3. **Skills 1.0** — modularity, on-demand loading. A step forward, but with serious limitations.
4. **Skills 2.0** — full standardization with evals, benchmarks, trigger tuning, and distribution.

The difference between 1.0 and 2.0 isn't a cosmetic update. It's a paradigm shift.

### Skills 1.0 — the experimental era

Skills 1.0 appeared in the first versions of Claude Code and were **undocumented** in nature. The system relied on hidden pattern recognition mechanisms — "magic bootstrappy parts" — that interpreted markdown files, provided the metadata was configured perfectly.

Main problems:

- **Zero testing** — the skill lifecycle was based on guesswork. You'd write instructions, manually run a few prompts, and assume it worked. There was no empirical method to assess whether a change in instructions improved or worsened agent behavior.
- **Unvalidated context** — the context delivered to the model had "unvalidated" status. Combined with the natural tendency of models to hallucinate, unverified instructions led to systemic errors.
- **No taxonomy** — all skills were treated equally. There was no division into types, which made management and deprecation difficult.
- **Context bleed** — single, sequential runs caused context leakage between tasks.

### Skills 2.0 — the standardization era

Skills 2.0, deployed in early March 2026, introduce standards drawn from mature software engineering. Key changes:

| Dimension | Skills 1.0 | Skills 2.0 |
|--------|-----------|-----------|
| **Testing** | Manual attempts, guesswork | Automated evals, benchmarks, blind A/B testing |
| **Validation** | None — unverified context | Deterministic, tested context |
| **Triggering** | Manual description modification | Automated trigger tuning |
| **Taxonomy** | Flat, no division | Capability uplift vs encoded preference |
| **CI/CD** | No support | Native pipeline integration |
| **Test isolation** | Context bleed between runs | Multi-agent testing (Executor, Grader, Comparator, Analyzer) |

That last point is particularly interesting. The skill-creator in version 2.0 doesn't test a skill in a single instance. It spawns **four isolated sub-agents**:

1. **Executor** — runs the skill in a sterile environment, with no history from previous conversations
2. **Grader** — evaluates the output based on defined assertions, returns a pass rate
3. **Comparator** — runs blind A/B tests between skill versions — doesn't know which result is new and which is old
4. **Analyzer** — analyzes hundreds of results, looking for hidden patterns and anomalies in token usage

This isn't "check if it works." This is **quality engineering at the level of production software**.

### Two types of skills — and why it matters

Skills 2.0 introduces a formal **taxonomy** — a division into two categories with radically different lifecycles:

- **Capability uplift** — teaches AI a new skill, e.g., frontend design, code review, data analysis. Key characteristic: **subject to planned deprecation**. When the base model improves (the jump from Sonnet 4.5 to Opus 4.6 is a 190-point Elo difference in GDPval-AA tests), the skill loses its purpose. Evals detect this automatically — when the agent without the skill achieves the same results as with it, you get a signal to deprecate.
- **Encoded preference** — encodes your specific workflow. How you create reports, how you analyze data, how you write content. **Permanent, because it's specific to you.** A new model won't change the fact that you want reports in a specific format. Deprecation only happens when you change your process.

```text
System prompt:               Skill 2.0:
─────────────               ──────────
Text in a field             SKILL.md + files + evals
No testing                  Automated benchmarks
Copy-paste                  Git + versioning
One session                 Persistent across sessions
No validation               Validated context
Manual triggers             Trigger tuning
```

**Pro tip:** If you're building a system for a company, start with encoded preference. Your workflow, your formats, your processes — this won't become outdated with a new model. Add capability uplift later when you need to extend the agent's abilities.

## Agent Skills — an open standard for AI agents

Skills 2.0 is a Claude Code feature. But what about portability? What if a better tool appears tomorrow?

This is where **Agent Skills standard** comes in — an open standard published at [agentskills.io](https://agentskills.io). It's not tied to any vendor. It defines the structure of a SKILL.md file, the way context is loaded, and the trigger mechanism.

The key concept is **progressive disclosure** — three-level context loading:

1. **Description** — a short description (one line) always visible in the context window
2. **SKILL.md** — full instructions loaded only when the skill is needed
3. **Reference files** — additional resources (templates, data) loaded for specific operations

This means you can have **dozens of agents** without overwhelming the context window. Each agent is described in a single line. Only when you need it are the full instructions loaded.

The SKILL.md structure looks like this:

```yaml
name: "CFO Agent"
description: "Financial analysis and reporting for PLSoft"
triggers:
  - "financial report"
  - "budget analysis"
  - "cash flow"
instructions: |
  You are the CFO agent for PLSoft.
  Your role is to analyze financial data,
  generate reports, and provide advisory...
```

This isn't complicated. **SKILL.md is Markdown with a YAML header** — exactly like frontmatter in blog posts. If you can write a note in Obsidian, you can create an agent.

Portability and no vendor lock-in are the main goals of the standard. Currently best supported by Claude Code, but the specification is public. Other tools can implement it without any restrictions.

## Skill-creator — build agents like a professional

Writing SKILL.md manually works, but it's like writing code without an IDE. You can, but why?

**Skill-creator** is an official plugin from Anthropic that guides you through the entire process of building an agent. Installation is simple:

```bash
# In Claude Code
/plugins
# → search "skill-creator"
# → install
```

From that moment you have access to a workflow that turns a loose description of intent into a tested, optimized agent. The process looks like this:

1. **Intent** — you describe what the agent should do ("Agent for financial analysis and reporting")
2. **Interview** — skill-creator asks questions about the specifics of your workflow
3. **Draft** — generates the first version of SKILL.md
4. **Test** — you run the agent with real data
5. **Evaluate** — evals measure output quality
6. **Iterate** — you improve based on results
7. **Package** — ready skill for distribution

Three elements set this workflow apart:

- **Evals** — automated quality assessment. You define what a good result is, skill-creator tests and measures. You don't guess whether the agent works — **you know**.
- **Benchmarks** — pass rate, execution time, token usage. You compare agent versions, see what improved, what got worse.
- **Trigger tuning** — optimizing the description so the skill activates at the right moments. Too broad triggers = false positives. Too narrow = the agent doesn't activate.

From intent description to a working agent — **20 minutes**. That's not an exaggeration. I saw a live demo where from zero to a working skill generating PDF reports took exactly that long.

## My system — 8 agents, 3 repositories, zero chaos

Theory is one thing. Let me show you what my system looks like in practice.

I run two companies — **200IQ Labs** (a corporation, product qamera.ai) and **PLSoft** (sole proprietorship, freelance and consulting). Each has different needs, different data, different processes. But certain elements are shared — report templates, formatting standards, utilities.

The architecture is based on **three Git repositories**:

```text
┌─────────────────────────────────────────────┐
│     agentic-ai-system (200IQ Labs)          │
│     → qamera.ai product                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   CFO    │  │   Legal  │  │ Marketing│   │
│  └──────────┘  └──────────┘  └──────────┘   │
│         ▲                                   │
│         │ git submodule                     │
│  ┌──────┴───────────────────────────────┐   │
│  │         shared-skills (public)       │   │
│  │  Templates, Utilities, Standards     │   │
│  └──────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│     agentic-ai-private (PLSoft / JDG)       │
│     → freelance, portfolio, consulting      │
│  ┌──────────┐  ┌──────────┐                 │
│  │  Coach   │  │ LinkedIn │                 │
│  └──────────┘  └──────────┘                 │
│         ▲                                   │
│         │ git submodule                     │
│  ┌──────┴───────────────────────────────┐   │
│  │         shared-skills (public)       │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

- **`shared-skills`** (public, Apache 2.0) — shared skills, templates, utilities. Open source, anyone can use and contribute.
- **`agentic-ai-system`** (private) — skills specific to 200IQ Labs. Company data, internal processes, product strategies.
- **`agentic-ai-private`** (private) — personal and freelance PLSoft skills. Coaching, LinkedIn content, consulting.

`shared-skills` is attached as a **git submodule** in both private repositories. A change in shared-skills propagates to both companies.

The system includes **8 agents**, 4 of which are already operational:

1. **CFO** (finance) ✅ — financial reports, cash flow analysis, budgeting
2. **Tax Advisor** (taxes) 🔲 — tax optimization, settlements
3. **Legal** (law) 🔲 — contract analysis, compliance, regulations
4. **Marketing** (content) 🔲 — content strategies, campaigns, analytics
5. **Business Consultant** ✅ — strategic advisory, market analysis
6. **Product Manager** 🔲 — qamera.ai roadmap, user stories, priorities
7. **Coach The Five** ✅ — coaching based on The Five methodology
8. **LinkedIn Content** ✅ — generating and planning LinkedIn posts

The key is **context separation**. The CFO agent for 200IQ Labs doesn't see marketing content for PLSoft. Not because I forbid it — because it operates in a different repository. Physical isolation through Git.

And Git gives me something no Claude Project can — **versioning, code review, change history**. Every agent modification is a commit. Every major change is a pull request. I can go back to any version. I can compare what changed and when.

To build this system I use [OPSX Workflow](/blog/opsx-workflow-strukturyzowana-praca-z-ai) — the same approach I described earlier. OpenSpec gives me a structured process for creating artifacts, instead of ad-hoc prompting.

## Practical example — building a CFO agent step by step

Theory is important, but let me show you what building an agent looks like from A to Z. Let's take the CFO agent — the first one I launched.

### 1. Intent

I start with an intent description in skill-creator:

> "Agent for financial analysis and reporting for 200IQ Labs and PLSoft. Generates monthly reports, analyzes cash flow, compares budget plan vs actuals."

### 2. Interview

Skill-creator asks me questions:

- What financial data do you have available? (CSV from the bank, invoices in a folder)
- What report format do you prefer? (Markdown with tables, ASCII charts)
- How often do you generate reports? (Monthly, ad-hoc on demand)
- What metrics are key? (Revenue, expenses, runway, MRR)

### 3. Draft SKILL.md

Based on the interview, skill-creator generates a draft:

```yaml
# CFO Agent - SKILL.md excerpt
name: "CFO Agent"
version: "1.0.0"
description: "Financial analysis, reporting, and advisory for 200IQ Labs & PLSoft"
triggers:
  - "analyze financials"
  - "monthly report"
  - "budget review"
  - "cash flow projection"
```

Then come full instructions — report format, which files to read, how to format output, which metrics to calculate.

### 4. Test with real data

I feed in actual financial data and request a report. I compare with what I used to do manually. I check whether:

- The numbers add up
- The format is readable
- The conclusions make sense
- Nothing was missed

### 5. Evals — what I measure

I define evaluation criteria:

- **Accuracy** — are amounts and calculations correct
- **Completeness** — does the report contain all required sections
- **Actionability** — are the conclusions specific and useful
- **Format compliance** — does the output match my templates

### 6. Iteration

The first two iterations always need corrections. The agent was skipping expense categorization. I added instructions about cost grouping. The agent was generating too-general conclusions. I refined the prompts for specificity. After the third iteration — a report at a level that used to take me 2 hours of manual work.

### 7. Package

The finished skill lands in the `agentic-ai-system` repo. Commit, push, done. From that moment the CFO agent is available in every Claude Code session opened in that repository.

## How to start — from one agent to a full system

You don't need to build a system with 8 agents right away. That's the fastest way to get discouraged. Start with one.

1. **Identify one repeatable role** in your company — something you do regularly that can be described with a set of rules
2. **Install skill-creator** — `/plugins` → search → install
3. **Describe the intent** — what the agent should do, what data it works with, what output it generates
4. **Go through the interview** — skill-creator will ask you the right questions
5. **Test with real data** — not sample data. Real data quickly reveals gaps in instructions
6. **Iterate based on evals** — measure, improve, measure again
7. **Add more agents** — only when the first one is stable

One repo to start. One agent. One workflow. Scale up when you have the foundation.

**Tip:** Start with **encoded preference** — your specific workflow, your report format, your analysis process. This won't become outdated with a new model. Add capability uplift later.

I wrote about AI operationalization in the article about [AI trends 2026](/blog/trendy-ai-2026-od-eksperymentow-do-operacjonalizacji). Those concepts were theoretical — this system is their practical implementation.

## Key takeaways

1. **Skills 2.0 is a leap from prompts to modular, testable agents** — not just another iteration, but a paradigm shift in working with AI
2. **Agent Skills standard ensures portability and no vendor lock-in** — an open standard at agentskills.io, you're not locked into one tool
3. **Skill-creator turns hours of manual work into a 20-minute workflow** — from intent to a working agent with evals and benchmarks
4. **Git + skills = versioning, code review, and change history for AI** — every agent is a file in a repository, every change is a commit
5. **Start with one agent, not a full system** — one workflow, one repo, one agent, then scale
6. **Encoded preference > capability uplift** for specific workflows — your processes won't become outdated with a new model
7. **Open source + commercialization — you don't have to choose** — shared-skills are public, company skills are private

---

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Want to build a multi-agent system for your company?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I help companies design and deploy AI agent systems — from a single agent to full orchestration. Check out shared-skills on GitHub or book a consultation.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a consultation →</a>
</div>

## Useful resources

- [Agent Skills Standard](https://agentskills.io) — open standard for AI agents
- [Skill Creator Plugin](https://github.com/anthropics/skill-creator) — official Anthropic tool for building skills
- [shared-skills repo](https://github.com/200iqlabs/shared-skills) — open source multi-agent starter kit
- [Claude Code Skills docs](https://docs.anthropic.com/en/docs/claude-code/skills) — Skills 2.0 documentation

## FAQ

<details open>
<summary>

### How do Skills 2.0 differ from regular system prompts in Claude Projects?

</summary>

Skills 2.0 are modular agents with access to the file system, web search, and scripts — not just text in a field. They have versioning through Git, automated tests (evals), and can be shared across projects. A system prompt disappears when you close the session; a skill is persistent and works in every Claude Code session.

</details>

<details open>
<summary>

### Do I need programming skills to build a multi-agent system with Skills 2.0?

</summary>

You don't need to write code — skill-creator guides you through the entire process from intent description to a ready agent. Basic familiarity with the terminal and Git is helpful but not required. SKILL.md is Markdown with a YAML header, not a programming language.

</details>

<details open>
<summary>

### How much does it cost to maintain a multi-agent system based on Claude Code and Skills 2.0?

</summary>

Claude Code itself requires a Claude Max or Pro subscription. Skills and the Agent Skills standard are free — they're Markdown files in a Git repository. A typical system with 4-8 agents doesn't generate additional costs beyond the Claude subscription, because skills are just text files, not separate services.

</details>

<details open>
<summary>

### How do I ensure data separation between agents so they don't access information they shouldn't see?

</summary>

Context separation through separate Git repositories. The CFO agent for 200IQ Labs operates in the company's repo, the PLSoft agent in a separate repo — they physically can't see each other. Shared skills (shared-skills) contain only universal tools and templates, not company data. Each SKILL.md defines the scope and access restrictions of the agent.

</details>

<details open>
<summary>

### Does the Agent Skills standard work only with Claude Code or with other AI tools too?

</summary>

Agent Skills is an open standard published at agentskills.io, designed as vendor-agnostic. Currently best supported by Claude Code, but the specification is public and other tools can implement it. No vendor lock-in is one of the standard's main goals — your skills aren't locked into a single ecosystem.

</details>

<details open>
<summary>

### What's the best way to start building a multi-agent system for a small business or sole proprietorship?

</summary>

Start with one agent for your most frequently repeated role — e.g., financial analysis, content creation, or customer service. Install skill-creator in Claude Code, describe what the agent should do, and test with real data. Add more agents only when the first one works reliably and delivers real value.

</details>
