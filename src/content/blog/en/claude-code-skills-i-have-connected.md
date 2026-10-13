---
id: 33
slug: claude-code-skills-i-have-connected
title: "Claude Code Skills: Competence Is Installed, Not Acquired"
excerpt: >-
  I don't know design, yet I built a CRM for the real estate industry.
  Skills moved my work from doing to judging. The list of skills and two install commands.
category: AI
author: Pawel Lipowczan
date: 2026-10-12
modified: 2026-10-13
readTime: 13 min
image: /images/og-skille-ktore-mam-podlaczone.webp
tags:
  - Agent Skills
  - Claude Code
  - Wtyczki
  - Open source
  - Rozwój zawodowy
lang: en
alternateSlug: skille-ktore-mam-podlaczone
---

I built a CRM with an agent for clients in the real estate industry. A **CRM** is a system for managing clients and offers. I would not have done this before.

The agent wrote the code, and that was not the obstacle. The obstacle was the look, because you still have to convince the client of an interface they will like. And I know my way around neither design nor **SEO** (getting pages to rank in search engines).

I did not learn either of them. I connected **skills**. A skill is a file with instructions that an agent reads and, thanks to it, starts doing something it did not do before.

For design I use three: `frontend-design`, `ui-ux-pro-max` and `impeccable`. For SEO, `claude-seo` helps me. The first three prepare design proposals from which the client chooses.

This text rests on two claims. The first is about the tool: competence can now be plugged in, not only built up over years of practice. The second is about my work: a skill added to an agent is competence added to me, so the way I plan my own development changes.

The question "what should I learn this quarter" is no longer first for me. The first one now is: what to connect, and what I still need to be able to evaluate.

The second claim has a limit. Expertise did not stop mattering. It shifted from execution to evaluating the result. I will not put forward a stronger thesis, because I have no grounds for it.

Next: what a skill is and why the format is cheap, what I have connected, two lists you can take with installation, and at the end what I do not give away.

## Agent Skills: an open format that works beyond Claude Code

A skill is not one vendor's feature or a secret piece of Claude's code. The format is called **Agent Skills** (an open standard for describing a skill). Anthropic created it and released it as open, and today it is supported by VS Code, GitHub Copilot, Cursor, Goose, Amp and OpenCode, among others. The current list is kept at [agentskills.io](https://agentskills.io).

A skill is a folder with a `SKILL.md` file. The file holds a name, a description and instructions written in **markdown** (plain text with simple markup). At startup the agent knows only the names and descriptions of skills, and reads the full instructions only when a task matches. The specification assumes about 100 tokens for this metadata per skill (a **token** is a unit of text that the model counts).

The format itself travels between tools. Installation does not always, as the next section shows.

## Why this format is cheap

A skill is markdown with a few fields at the top of the file. Writing your own costs as much as writing instructions.

Several skills, commands and other add-ons are packed into a **plugin** (a package installed as a whole). The simplest plugin consists of just markdown and JSON (a format for storing data in text files), with no build step. More elaborate ones add their own scripts.

```text
my-plugin/
├── .claude-plugin/plugin.json   # name, description, license
├── skills/<name>/SKILL.md       # the skill's instructions
└── commands/                    # commands typed in the session
```

Plugins are installed from a **plugin marketplace**. It is a repository with a `marketplace.json` file that says where to download each plugin from.

One caveat that is easy to miss. The plugin manifest, which is the `plugin.json` file, is a Claude Code convention, not part of the Agent Skills specification. The specification describes a skill folder and says nothing about installing packages or about the target directory. That is why tools look for skills in different places: Claude Code in `.claude/skills/`, Codex in `.agents/skills/`, Cursor in `.cursor/skills/` and `.agents/skills/`.

So a skill folder can be taken and placed in another tool's directory. The manifest and the install commands come from Claude Code.

## What I have connected: 29 plugins from 8 marketplaces

On my account I have **29 plugins from 8 marketplaces** connected globally (read on 12 October 2026). Twenty-two come from Anthropic's official marketplace. Many of them are integrations with services, for example GitHub, Stripe or Cloudflare.

I do not treat that number as proof. The proof is something else: for design and SEO I did not have to learn the field, because I simply connected the items that do it.

A note so you do not count twice. The tables below are not a breakdown of those 29. They are two separate lists: 19 items from my repository and 10 from other people that I use myself. That together they make exactly 29 is a coincidence.

Three of those ten (OpenSpec, `impeccable` and `hyperframes`) are skills installed separately, not plugins from a marketplace. **OpenSpec** is a tool for writing a change specification before the code.

Connecting has a cost. The name and description of every enabled skill sit in the agent's context on every turn, even when the skill is not used. A plugin also runs code with the user's permissions, so it is worth reviewing before installing. I wrote about the risks of agents in [OpenClaw: the security lesson the AI agent world needed](/en/blog/openclaw-ai-agent-security).

## My skills you can take for free

The repository [`200iqlabs/shared-skills`](https://github.com/200iqlabs/shared-skills) is public and released under the Apache-2.0 license (it allows using, changing and distributing the code while keeping the license notice). Installation is two **slash commands** (commands typed in the session that start with `/`):

```text
/plugin marketplace add 200iqlabs/shared-skills
/plugin install ss@shared-skills
```

The same in the terminal: `claude plugin marketplace add 200iqlabs/shared-skills` and `claude plugin install ss@shared-skills`. After installation every item has the `ss:` prefix.

Below are 19 items. I folded the `research*` and `prepare-goal*` variants into single rows, because each group is one flow.

| Item | What it does |
|---|---|
| `/ss:cfo` | cash flow, cash runway for the coming months, costs, profitability, budget |
| `/ss:tax-advisor` | PIT, VAT, ZUS, health insurance contribution, IP Box, lump-sum versus flat tax |
| `/ss:legal` | B2B contracts and NDAs, GDPR, copyright in code, unpaid invoices |
| `/ss:business-consultant` | meeting notes into a solution architecture and an implementation estimate |
| `/ss:process-mapping` | a process into a diagram: who, what and with which tool (Excalidraw or Mermaid) |
| `/ss:slides` | markdown into a finished PDF presentation: carousels and conference slides, through Marp |
| `/ss:prd` | a two-page product description for a solution built in a week |
| `/ss:research` | analysis with a plan: items, fields and the structure of the result |
| `/ss:research-deep` | a separate agent for every item in the plan, then a report (`research-report`) |
| `/ss:review-fix` | one review of a branch through Codex (an OpenAI plugin for code review, condition below the table): fixes what holds up, rejects the rest with a reason, then a commit and push |
| `/ss:review-loop` | a loop between Claude and Codex on a pull request until nothing important is left. It ends with a sign-off issue that only a person closes |
| `/ss:prepare-goal` | a loose task description into a completion condition that can be checked in the session transcript (the `prepare-openspec-goal` variant is for OpenSpec changes) |
| `/ss:find-skills` | searches for skills in the ecosystem and installs them after a security audit |
| `/ss:vibe-coding` | the visible layer of an app without design knowledge: guidelines, design tokens, components |
| `/ss:environment-setup` | a wizard for configuring context files |
| `/ss:decisions` | pulls out open decisions one at a time, with a recommendation, and waits for an answer (in Polish) |
| `/ss:explain-diff` | walks through code changes file by file, in plain Polish |
| `/ss:explain-design` | walks through an OpenSpec design document topic by topic (in Polish) |
| `/ss:working-mode` | switches the session to Polish and a fixed answer skeleton |

Abbreviations from the table: **PIT** is personal income tax, **ZUS** is the Polish social insurance institution, **IP Box** is a preferential tax rate on income from intellectual property, **NDA** is a non-disclosure agreement, and **PRD** is a document describing the requirements for a product. Excalidraw and Mermaid are diagram tools, and Marp turns markdown into a presentation. **Design tokens** are named values for colors, spacing and fonts.

**A condition for two items.** `/ss:review-fix` and `/ss:review-loop` review code through the Codex plugin and require a ChatGPT plan that includes Codex. The skills are free, the reviewer is not: every review round uses up that plan's allowance. Without an installed and signed-in plugin, both skills stop and point to `/codex:setup`.

## Other people's skills and tools I use

The second table is the ecosystem: other people's tools, public, with authors. I kept only what I use in it. I struck out the rest of what was installed, because I practically do not use it.

| Item | Author | What it does |
|---|---|---|
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | Fission-AI, MIT | specification before code; leaves a file, not a conversation |
| [claude-seo](https://github.com/AgriciDaniel/claude-seo) | AgriciDaniel | SEO audit, Core Web Vitals (metrics of a page's speed and stability), structured data (markup that describes a page's content to search engines), visibility in AI answers |
| `frontend-design` | Anthropic | the visual layer of an interface |
| [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | nextlevelbuilder | styles, palettes, font pairs and design patterns |
| `commit-commands` | Anthropic | commit, push and a pull request with one command |
| `document-skills` | Anthropic | xlsx, docx, pptx and pdf: reads and writes |
| [impeccable](https://github.com/pbakaus/impeccable) | pbakaus, Apache-2.0 | designing and polishing interfaces: hierarchy, typography, color, motion, accessibility. Site: [impeccable.style](https://impeccable.style), run with: `npx impeccable` |
| [hyperframes](https://github.com/heygen-com/hyperframes) | HeyGen, Apache-2.0 | video in HTML: compositions, captions synced to audio, voice-over, transitions. Also processing finished footage. Run with: `npx hyperframes` |
| `skill-creator` | Anthropic | makes a skill from a description of the behavior |
| [superpowers](https://github.com/obra/superpowers) | Jesse Vincent, MIT | brainstorming before code, step-by-step bug hunting, tests before code, implementation plans |

I described three of them separately in [5 Weak Spots of Claude Code and How to Fix Them](/en/blog/claude-code-weak-spots): `ui-ux-pro-max`, `impeccable` and `hyperframes`.

I use both OpenSpec and superpowers, but for different things. For brainstorming before code I use `/opsx:explore` from OpenSpec, because it leaves a file and not a conversation. I write more about this approach in [OPSX Workflow - a structured approach to working with AI coding assistants](/en/blog/opsx-workflow-structured-ai-work).

I reach for superpowers less often. I have not measured which works better, so I do not compare the two.

## What I do not give away

Not everything I have can be given away. Session closing, a task register, a context-consistency check and the publishing loop live in my private repository. They are versioned privately and have no distribution channel, so they are in neither table and there will be no link to them.

I write about them only as a pattern, not as items to take. I do not want to promise something I cannot deliver.

I described the split between the shared and the private part earlier in [Skills 2.0 - how I'm building a multi-agent system to manage my company](/en/blog/skills-2-0-multi-agent-system-company-management). The shared skills were hooked in there as a git submodule. In this text I show installation as a plugin, which anyone can do.

## What this changes in planning my own development

Both questions stayed, their order changed. You can see it best in the CRM. The agent writes the code.

The design proposals are prepared by `frontend-design`, `ui-ux-pro-max` and `impeccable`, and the client picks from a few of them. Video is handled by `hyperframes`. Four of the connected items do what I cannot do myself: three design the interface, one deals with SEO.

Skills have not changed how fast I work. They changed which jobs I consider at all. They helped me think about jobs like a CRM for the real estate industry, a complex tool I would not have taken on before.

The second half of the question stays on my side. I do not need to be able to design an interface. I need to be able to evaluate what a skill gives me before I show it to anyone.

In the CRM project the client took over part of that evaluation, because they choose from a few proposals. I am responsible for the rest.

I check the result of `claude-seo` on my own domain, pawel.lipowczan.pl. The effect is visible only after publication, so I give no results in this text.

Evaluation takes more than a feeling that the result looks good. I wrote about this in [Measured, Not Assumed. Three Conclusions I Overturned Myself](/en/blog/measured-not-assumed), where conclusions that sounded confident had to be withdrawn after another measurement. It applies to me as much as to the agent.

## Getting started

In a Claude Code session type `/plugin marketplace add 200iqlabs/shared-skills`, then `/plugin install ss@shared-skills`, and look through the [shared-skills repository](https://github.com/200iqlabs/shared-skills) to see what will be useful to you. Start with an item from a field where you can evaluate the result. Only then reach for one in a field you do not know.

## Key takeaways

1. **A skill added to an agent is competence added to me.** That is why I start my development plan from the question of what to connect.
2. **Connecting does not remove the need to evaluate.** Expertise shifts from execution to evaluating the result.
3. **The format is open and cheap.** A skill is a folder with `SKILL.md`, while the plugin manifest and install paths are conventions of a specific tool.
4. **Connecting costs.** A skill's name and description are in context on every turn, and a plugin runs code with the user's permissions. Keep what you use.
5. **The list is yours to take.** Two commands install the `ss` plugin, and two items additionally need a ChatGPT plan with Codex.

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Want to know which skills to connect in your own work?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I will help you pick skills for your projects and work out what you still need to evaluate yourself before you show anyone the result.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Useful Resources

- [shared-skills](https://github.com/200iqlabs/shared-skills) - the repository with the `ss` plugin, installation and the list of items.
- [Agent Skills](https://agentskills.io) - the format specification and a list of tools that support it.
- [Claude Code plugins documentation](https://code.claude.com/docs/en/plugins) - what a plugin and a marketplace are, context cost, trust in plugins.
- [impeccable](https://impeccable.style) - designing and polishing interfaces.
- [hyperframes](https://github.com/heygen-com/hyperframes) - video written in HTML.
- [OpenSpec](https://github.com/Fission-AI/OpenSpec) - specification before code.
- [5 Weak Spots of Claude Code and How to Fix Them](/en/blog/claude-code-weak-spots) - three of the other people's skills described separately.
- [Measured, Not Assumed](/en/blog/measured-not-assumed) - how to evaluate a result by measurement, not by conviction.
- [Pre-revenue startup without a finance department. AI agent system anatomy.](/en/blog/ai-agent-system-skills-rules-shared-context) - the system the skills plug into.

## FAQ

<details open>
<summary>

### What is a skill in Claude Code, and how exactly does it differ from a plugin installed from a marketplace?

</summary>

A skill is a folder with a `SKILL.md` file that holds a name, a description and instructions for the agent. A plugin is a package installed as a whole that can contain many skills, commands and other add-ons. So a skill is a unit of knowledge, and a plugin is a way of delivering it.

</details>

<details open>
<summary>

### Will skills written for Claude Code work in other tools, for example in Cursor or in Codex?

</summary>

The format itself does, because Agent Skills is an open standard supported by many tools. The plugin manifest and install commands, however, are a Claude Code convention, and directories differ: Codex looks in `.agents/skills/`, and Cursor in `.cursor/skills/` and `.agents/skills/`, but it also reads `.claude/skills/`. You carry the skill folder over, while the plugin installer stays in Claude Code.

</details>

<details open>
<summary>

### Can I use the skills from the shared-skills repository in commercial projects and for clients?

</summary>

The repository is licensed under Apache-2.0, and the full license text is in its `LICENSE` file. That license allows using, changing and distributing code, commercially too, while keeping the license notice. If you use the skills in a company, read its terms before rollout.

</details>

<details open>
<summary>

### Are `/ss:review-fix` and `/ss:review-loop` free, given that they review code through Codex?

</summary>

The skills themselves are free, but the reviewer is not. The review is done by the Codex plugin, which requires a ChatGPT plan that includes Codex, and every review round uses up that plan's allowance. Without an installed and signed-in plugin, both skills stop and point to `/codex:setup`.

</details>

<details open>
<summary>

### Is installing other people's skills and plugins for Claude Code safe, and what should I check before installing?

</summary>

A plugin can run code with the user's permissions, so it is not as harmless as a plain text file. The Claude Code documentation notes that this applies to every marketplace and describes how to review a plugin before installing. The `/ss:find-skills` skill searches the ecosystem for skills and installs them after a security audit.

</details>

<details open>
<summary>

### How many skills and plugins is it worth having connected at once so the agent does not lose room in its context?

</summary>

There is no single number, because the cost depends on how many descriptions there are and how long they are. The name and description of every enabled skill sit in the agent's context on every turn, even when the skill is not used, while the full instructions load only on use. The documentation shows how to measure a plugin's cost and which plugins have not been used for a long time. In the second table of this text I kept only the ones I use.

</details>
