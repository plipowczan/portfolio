---
id: 16
slug: second-brain-obsidian-claude-code-skills
title: "Second Brain with Obsidian and Claude Code - how AI is changing knowledge management"
excerpt: "Discover how combining Obsidian, Claude Code, and Skills creates a powerful knowledge management system. A practical guide to building a private second brain."
category: AI
author: Pawel Lipowczan
date: 2026-01-26
modified: 2026-06-22
readTime: 14 min
image: /images/og-second-brain-obsidian-claude-code-skills.webp
tags:
  - AI
  - Claude Code
  - Obsidian
  - Second Brain
  - Skills
  - Productivity
lang: en
alternateSlug: second-brain-obsidian-claude-code-skills
---

Claude Code isn't just a coding tool. Sounds like clickbait, but it's one of the most important things I've realized in recent months. I discovered this thanks to Cole Medin and his approach to using Claude Code for literally everything - from managing notes to generating content.

The problem you probably know: notes scattered across dozens of tools, AI chat history disappears after every session, and switching between apps kills productivity. I was looking for a way to **organize knowledge** that doesn't require constant manual tidying up.

In this article, I'll show you how combining **Obsidian**, **Claude Code**, and **Skills** creates a powerful knowledge management system. This isn't theory - I use this setup every day. By the end, you'll have everything you need to build your own **second brain** with AI at the center.

## What is a Second Brain and Why You Need One

A **Second Brain** is an external system for storing and organizing knowledge. The concept comes from **PKM (Personal Knowledge Management)** - an approach to consciously collecting, organizing, and utilizing information.

A traditional second brain relies on three functions:

- **Capture** - quickly capturing thoughts, notes, ideas
- **Organize** - categorizing and connecting information
- **Retrieve** - finding knowledge when you need it

The problem? These three functions require a lot of manual work. You have to decide where to place a note, which tags to add, how to connect it with other documents.

AI changes the game. Instead of manually organizing, you can **ask Claude Code to process your notes**. Instead of finding connections yourself, the AI analyzes your vault and discovers relationships. Instead of creating documents from scratch, you generate them from existing notes.

A second brain with AI isn't just a place to store knowledge. It's a **system that actively helps you use that knowledge**.

## Why Obsidian and Claude Code are the Perfect Combination

### Obsidian as the Foundation

**Obsidian** is a note editor based on markdown files. Key features that make it an ideal foundation:

- **Local files** - notes are plain `.md` files on your computer
- **Offline-capable** - you don't need internet to work
- **Markdown** - the format LLMs understand best
- **Graph view** - visualization of connections between notes
- **No vendor lock-in** - your files are yours, you can open them in any editor

That last point is crucial. Unlike Notion or Evernote, your notes in Obsidian are **plain text files**. Claude Code can directly read, edit, and create new ones.

### Claude Code as the Brain

**Claude Code** is a CLI for working with Claude. But it's much more than a coding tool. Its capabilities go far beyond writing code:

- **File operations** - reading, editing, creating files
- **Search** - searching content and project structure
- **Terminal commands** - running scripts, tools
- **Web search** - research directly from the terminal

Only **code intelligence** (understanding syntax, refactoring suggestions) is specific to coding. The rest? These are universal capabilities of an AI assistant with access to your file system.

### Together - More Than the Sum of Parts

Combining Obsidian + Claude Code gives you something you can't achieve with other tools. Notion requires an MCP server to connect with AI. Obsidian? Claude Code just opens the folder and reads the files.

This means:

- **Direct access** to all notes without additional configuration
- **AI processes your knowledge base** - creates summaries, connects ideas
- **Structured outputs** from chaotic notes
- **Automatic connections** between documents

Example second brain folder structure:

```text
obsidian-vault/
├── 00-inbox/           # Quick captures
├── 01-projects/        # Active projects
├── 02-areas/           # Ongoing responsibilities
├── 03-resources/       # Reference material
├── 04-archive/         # Completed items
├── templates/          # Document templates
└── .claude/
    └── skills/         # Claude Code skills
```

This structure is based on the **PARA method** (Projects, Areas, Resources, Archive). The `.claude/skills/` folder is where you define capabilities for Claude Code.

## Skills - How to Extend Your Second Brain's Capabilities

**Skills** are the third pillar of the system that ties everything together. They're a way of giving Claude Code knowledge, processes, and guidelines specific to your workflow.

### What are Skills

Skills are markdown files that define workflows. They contain:

- A description of when the skill should be used (trigger)
- Step-by-step instructions
- References to other files (templates, style guides)
- Usage examples

A skill is **loaded dynamically** when Claude Code detects it's needed. You don't have to invoke it manually - just describe what you want to do.

### Progressive Disclosure - the Key to Efficiency

This is the concept that sets skills apart from other approaches to extending AI.

The problem with MCP servers: they load **all tools upfront**. If you have 50 tools, all their descriptions take up space in the context window. That's **context bloat** - you're wasting valuable space on things you're not using.

Skills work differently through **progressive disclosure**:

1. **Description** - a short description always visible (one line)
2. **SKILL.md** - full instructions loaded only when needed
3. **Reference files** - additional resources loaded for specific operations

This means you can have **hundreds of skills** without overwhelming the context window. The agent specializes per session - loading only what it needs.

### Skill Structure

```text
.claude/skills/
└── document-generator/
    ├── SKILL.md           # Main instructions
    ├── assets/
    │   └── templates/     # Document templates
    └── references/
        └── style-guide.md # Style guidelines
```

Example SKILL.md file:

```yaml
---
name: document-generator
description: Generate structured documents from notes. Use when user asks to create summaries, outlines, or formatted documents from their knowledge base.
---

# Document Generator

## Triggers
- "create a summary of..."
- "generate a document from..."
- "summarize my notes on..."

## Workflow
1. Read source notes from specified location
2. Analyze key concepts and structure
3. Apply template from `assets/templates/`
4. Generate document following style guide
5. Save to specified location

## Templates Available
- `meeting-notes.md` - Meeting summary template
- `project-brief.md` - Project overview template
- `article-draft.md` - Blog article draft template
```

## Practical Skill Examples for a Second Brain

### Research Engine

A skill for gathering information from the internet and saving structured notes.

**What it does:**

- Searches the web on a given topic
- Gathers key information and sources
- Creates a note in markdown format
- Saves to the appropriate folder in the vault

**Example usage:** "Research the latest developments in AI agents and save notes to 03-resources/ai-agents/"

### Document Generator

Transforms raw notes into polished documents.

**What it does:**

- Reads specified source notes
- Analyzes structure and key concepts
- Applies template and style guide
- Generates a finished document

**Example:** Meeting notes -> document with action items and summary.

### Daily Review

Automates the daily review.

**What it does:**

- Scans today's notes
- Creates a day summary
- Identifies connections with existing knowledge
- Suggests next actions

### Content Creator

Generates content based on notes from the vault.

**What it does:**

- Analyzes notes on a given topic
- Generates content ideas
- Creates drafts (articles, posts, scripts)
- Maintains a consistent voice and style

Example of how a research skill trigger looks:

```text
User: "Research the latest developments in AI agents and
       save notes to 03-resources/ai-agents/"

Claude Code:
1. Loads research-engine skill
2. Searches web for recent AI agent news
3. Creates structured note with sources
4. Saves to specified folder
5. Links to related existing notes
```

## Connecting Your Second Brain with Other Tools via MCP

**MCP (Model Context Protocol)** is a way to connect Claude Code with external services. You can connect to Gmail, calendar, task managers.

The problem? MCP servers load all tools upfront - the same context bloat problem that skills solve.

### Two Approaches to Integration

**1. MCP servers** - direct connection to services

- Gmail/Outlook - through libraries or MCP servers
- Google Calendar - MCP server
- ClickUp - MCP server or API

**2. Skills with scripts** (my preferred approach)

- You write your own scripts in Python/Node.js
- You add them to skills as tools
- Full control over the logic
- Everything in one place (in the vault)

### Why I Prefer Scripts in Skills

Make.com lets you expose scenarios as MCP tools. But that's an extra layer. Scripts in skills are faster, simpler to debug, and I have everything in one place.

Example skill with a ClickUp script:

```text
.claude/skills/
└── clickup-tasks/
    ├── SKILL.md
    └── scripts/
        └── get_tasks.py    # Script for fetching tasks
```

SKILL.md file with script usage:

```yaml
---
name: clickup-tasks
description: Fetch and manage tasks from ClickUp. Use when user asks about tasks, deadlines, or project status.
---

# ClickUp Tasks

## Workflow
1. Run `scripts/get_tasks.py` with appropriate parameters
2. Process results and save to a note
3. Optionally: link with existing project notes

## Available Operations
- Fetch tasks from list/folder
- Filter by status, assignee, deadline
- Sync tasks to Obsidian notes
```

## My Personal Workflow with Obsidian and Claude Code

Let me show you what a typical work day looks like with this setup.

### Morning Routine

1. Open Obsidian + Claude Code
2. Run the daily review skill - check what's in ClickUp, what's on the calendar
3. Check important emails through the script skill

### During Work

- **Quick capture** to inbox in Obsidian - quick notes, ideas
- Ask Claude to process and place in the appropriate folder
- Generate documents from notes through skills
- Sync important tasks from ClickUp to project notes

### Research Sessions

- Define the topic I'm interested in
- Claude Code does research and saves notes
- I review and add my own thoughts

### Content Creation

- Notes -> drafts through skills
- Templates ensure consistency
- But the **human touch** remains essential

> "Obsidian is my canvas. Everything my second brain generates - documents, drafts, ideas - I manage here. This is where I add my human touch."

### Integrations I Use

- **ClickUp** - tasks and projects (through a script in a skill)
- **Gmail/Outlook** - important emails to process (directly through libraries)
- **Google Calendar** - meetings and deadlines

### Why Scripts Instead of Make.com/Zapier

Make.com lets you expose scenarios as MCP tools - it's an interesting option. But I prefer writing my own scripts:

- They're faster - no extra communication layer
- I have full control over the logic
- Everything in one place, easier to debug

## Getting Started - First Steps

You don't need to build everything at once. Start with the basics and grow gradually.

### 1. Install the Tools

- **Obsidian** - free, download from [obsidian.md](https://obsidian.md)
- **Claude Code** - requires Claude Pro subscription or API access

### 2. Create a Folder Structure

Start with a simple PARA structure:

```text
obsidian-vault/
├── 00-inbox/       # Everything new goes here
├── 01-projects/    # Active projects
├── 02-areas/       # Ongoing responsibilities
├── 03-resources/   # Reference material
├── 04-archive/     # Completed items
└── .claude/
    └── skills/     # Your skills go here
```

### 3. Create Your First Skill

Start simple - e.g., a skill for summarizing notes:

```yaml
---
name: note-summarizer
description: Summarize long notes into key points. Use when user asks to summarize or extract key points from notes.
---
# Note Summarizer

## Workflow
1. Read the specified note
2. Extract key concepts (5-7 points)
3. Create bullet-point summary
4. Add to top of note or save separately
```

### 4. Build a Workflow

- Define daily routines (morning review, end-of-day)
- Create templates for repetitive documents
- Test and iterate

### 5. Grow Gradually

- Add skills when a real need arises
- Don't try to build everything at the start
- Each skill is an investment - make sure you'll actually use it

## Key Takeaways

1. **Claude Code isn't just for coding** - file operations, search, web search make it a powerful general-purpose assistant
2. **Obsidian + Claude Code = perfect match** - markdown files + local storage + AI processing is the ideal combination
3. **Skills provide context-efficient extensibility** - progressive disclosure prevents context bloat
4. **Start simple, grow gradually** - one skill at a time, iterate based on real needs
5. **Human touch remains essential** - AI augments, it doesn't replace your thinking
6. **File-based workflow is powerful** - everything under version control, portable, private

---

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Want to build your own AI-powered knowledge management system?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I'll help you design and implement a second brain tailored to your needs. From tool selection through skills configuration to workflow optimization.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Useful Resources

- [Obsidian](https://obsidian.md) - official website
- [Claude Code Documentation](https://docs.anthropic.com/claude-code) - Claude Code docs
- [Cole Medin / Dynamist](https://www.youtube.com/@ColeMedin) - inspiration for this article
- [5 techniques for working with Claude Code](/blog/5-technik-pracy-z-claude-code) - related article
- [PARA Method](https://fortelabs.com/blog/para/) - knowledge organization system
- [second-brain-template](https://github.com/plipowczan/second-brain-template) - a ready template to start building your own second brain in minutes

## FAQ

<details open>
<summary>

### Do I need programming skills to use Claude Code as a second brain?

</summary>

No, Claude Code is operated through natural language. Just describe what you want to do - "create a summary of my notes from the projects folder" - and Claude handles the rest. Knowing markdown is helpful but not required. You also write skills in markdown, not programming code.

</details>

<details open>
<summary>

### How does this approach differ from using ChatGPT or Claude.ai directly in the browser?

</summary>

The key difference is access to local files. Claude Code runs on your computer and has direct access to files in Obsidian - it can read them, edit them, create new ones. In the browser, you have to manually copy content. Additionally, skills enable automation of repeatable workflows without losing context between sessions.

</details>

<details open>
<summary>

### How do I connect a second brain with other tools like email or a task manager?

</summary>

You have two approaches: MCP servers (direct connection to Gmail, Outlook, ClickUp through libraries or MCP servers) or scripts in skills (my preference). You add Python/Node.js scripts to the skills folder and Claude Code runs them. Make.com lets you expose scenarios as MCP tools, but I prefer scripts - they're faster, simpler to debug, and I have everything in one place.

</details>

<details open>
<summary>

### Are my notes safe and private when using Claude Code?

</summary>

Yes, notes stay on your computer - Obsidian doesn't require the cloud. Claude Code processes files locally and sends to the API only what's needed for the given task. You don't have to sync your entire vault with an external service like you would with Notion. You have full control over your data.

</details>

<details open>
<summary>

### What's the best starting point if I've never used Obsidian or Claude Code?

</summary>

Start by installing Obsidian and creating a simple folder structure (inbox, projects, resources). Then install Claude Code and test basic operations - ask it to summarize a file, create a new note. Only when you feel comfortable should you add your first simple skill. The entire process can be spread over a week of learning at 30 minutes per day.

</details>

<details open>
<summary>

### Can I use this system with other markdown editors instead of Obsidian?

</summary>

Yes, Claude Code works with any markdown files. Obsidian is recommended because of its graph view (connection visualization), built-in linking, and extensive plugin ecosystem. Alternatives like Logseq or Foam will also work, but may require workflow adjustments. The key is using local markdown files, not cloud applications.

</details>

<details open>
<summary>

### How much does this setup cost and what are the hardware requirements?

</summary>

Obsidian is free for personal use. Claude Code requires a Claude Pro subscription ($20/month) or API access. Hardware requirements are minimal - any modern computer with 8GB RAM is sufficient. An Obsidian vault can have thousands of notes without performance issues.

</details>
