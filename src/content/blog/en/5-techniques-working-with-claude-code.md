---
id: 10
slug: 5-techniques-working-with-claude-code
title: "5 Techniques That Will Transform How You Work with Claude Code"
excerpt: "Most developers use only 20% of Claude Code's potential. Learn 5 advanced techniques used by the best AI engineers."
category: AI
author: Pawel Lipowczan
date: 2026-01-09
readTime: 14 min
image: /images/og-5-technik-pracy-z-claude-code.webp
tags:
  - AI
  - Claude Code
  - Automation
  - Developer Tools
  - PIV Methodology
lang: en
alternateSlug: 5-technik-pracy-z-claude-code
---

There's a very high probability that you're leaving most of your AI coding assistant's potential on the table. When I started working with Claude Code to build this portfolio, I was doing exactly the same thing - typing simple prompts, getting code back, sometimes it worked, sometimes it didn't. Reactive prompting. No system.

Then I discovered that the best AI engineers work completely differently. They have a **system**. They use methodologies that make their coding agents more powerful with every iteration.

In this article, I'll show you 5 concrete techniques that completely change how you work with Claude Code. These aren't theoretical concepts - they're practical methods used by teams building production applications with AI. And the best part is that all these techniques are already packaged into a ready-to-use framework you can deploy in your project today.

## PRD-First Development: Your Project's North Star

Most developers just dive into code. They open Claude Code and start: "Add a login button," "Add form validation," "Fix this bug." Each iteration is disconnected from the previous one. There's no big-picture vision.

A **PRD (Product Requirement Document)** in the context of working with AI is something much simpler than a 50-page corporate document. It's simply a **markdown file with the full project scope**. A single file that becomes the north star for every feature you build.

### Benefits of PRD-First Development

Previously, I used an assistant that generated PRDs and rules for the AI agent, but it required working with two different tools. I had to switch between contexts, sync information manually. It was frustrating.

Now? Everything in one place. The PRD lives in my repository. Claude Code reads it at the start of every session. And suddenly everything makes sense.

### What It Looks Like in Practice

For new projects (greenfield development), the PRD contains:

- **Target Users** - who you're building for
- **Mission** - what the product should do
- **In Scope / Out of Scope** - what's in the MVP, what's for later
- **Architecture** - high-level tech stack and structure

For existing projects (brownfield), the PRD documents:

- **What we already have** - current system state
- **What we're building next** - upcoming features in the pipeline
- **Long-term vision** - where we're heading

Minimal PRD structure example:

```markdown
# PRD: Habit Tracker Application

## Target Users

People who want to build better habits through consistent tracking

## Mission

A simple, elegant app for tracking habits with progress visualization

## In Scope (MVP)

- Creating habits with name and frequency
- Marking daily habit completion
- Calendar showing history (streak tracking)
- Local data storage

## Out of Scope (v1)

- Sharing with other users
- Advanced statistics
- Push notifications
- Integrations with other apps

## Architecture

- Frontend: React + TypeScript
- State: React Context
- Storage: localStorage
- Deploy: Vercel
```

### The Magic Question

When you have a PRD, you can start every session with a question that changes everything:

> "Based on PRD, what should we build next?"

Claude Code reads the PRD, understands where you are, what you've already built, and suggests the next logical step. You don't have to remember. You don't have to explain context from scratch. **The PRD remembers for you**.

### Key Benefits

- **Single source of truth** - one project definition for the entire team (and for AI)
- **Natural decomposition** - easy to extract the next features to implement
- **Context for the agent** - Claude Code always knows what you're working on
- **Bird's eye view** - every feature connects to the bigger vision

The PRD is the foundation. Without it, you're building a house on sand. With it - you have a solid foundation, and every line of code has purpose and direction.

## Rule Modularity: Lighter Context, Smarter Agent

I've seen this dozens of times. A developer creates a `CLAUDE.md` or `agents.md`, dumps every possible rule, guideline, and convention in there. After two months, the file is 1,500 lines long. All of it gets loaded **at the start of every conversation**.

The problem? **You're overwhelming the LLM with irrelevant context.**

### The Problem with Long Global Rules

When you're working on the frontend, you don't need to know API design patterns. When you're working on the database, you don't need React component naming conventions in context. But if everything is in one global rules file? Claude Code loads it all. Every time.

That's wasting the **context window** - something many developers seriously underestimate, but which is absolutely critical for agent output quality.

### The Solution: Modular Architecture

Instead of one monstrous file, split your rules into two categories:

**1. Global rules (CLAUDE.md)** - keep it as light as possible, ~200 lines

- Project tech stack
- Folder structure
- Commands to run (npm run dev, npm test)
- Testing strategy (philosophy, not details)
- Logging standards

**2. Reference folder** - detailed context loaded only when needed

- `reference/api-design.md` - REST API patterns, error handling, loaded only when working on APIs
- `reference/frontend-components.md` - component patterns, styling guidelines, only for UI work
- `reference/database-patterns.md` - schema design, migrations, query optimization, only for DB work
- `reference/testing-patterns.md` - detailed test examples, setup, mocking

### How to Set It Up

In your main `CLAUDE.md`, add a reference section:

```markdown
# CLAUDE.md

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS 3
- Vite 7

## Project Structure

src/
├── components/
├── pages/
├── utils/
└── data/

## Reference Documentation

When working on specific areas, consult these documents:

- **API endpoints**: `.claude/reference/api-design.md`
- **Frontend components**: `.claude/reference/frontend-components.md`
- **Database operations**: `.claude/reference/database-patterns.md`
- **Testing**: `.claude/reference/testing-patterns.md`
```

Claude Code is smart enough to understand: "OK, I'm working on an API endpoint now, I should read api-design.md." And it does so automatically.

### Benefits of Rule Modularity

Having everything in one place (like in claude-piv-skeleton, which I'll tell you about shortly) vs. scattered across different tools is an **enormous difference**. Everything is in the repo. Everything is versioned. Everything evolves alongside the project.

And most importantly? **You're protecting the context window** for things that actually matter during the implementation of a specific feature.

## Commandification: Stop Repeating the Same Prompts

If you're sending the same prompt to your coding agent more than twice, that's a screaming signal: **"Turn me into a command!"**

### What Are Commands

Commands are simply **markdown files that define a workflow**. You load them as context, and Claude Code executes the defined process step by step. They're like macros for prompts.

This doesn't require any new tools. It's just a better way of organizing your work.

### What's Worth Commandifying

Practically everything you do regularly:

**Core workflow:**

- `/prime` - Load project context at the start of a session
- `/plan-feature` - Create a structured implementation plan for a feature
- `/execute` - Implement according to the plan
- `/validate` - Run tests and verify functionality

**Git operations:**

- `/commit` - Create a meaningful commit message based on changes
- `/review-pr` - Analyze a pull request before merging

**Maintenance:**

- `/update-docs` - Update documentation after code changes
- `/refactor` - Refactor according to project best practices

### Example: The /prime Command

```markdown
# Command: /prime

Load codebase context to prepare for feature development work.

## Objective

Ensure Claude Code understands current project state before starting any development.

## Steps

1. Read PRD from `docs/PRD.md` to understand project scope and vision
2. Read architecture documentation from `docs/ARCHITECTURE.md`
3. Scan recent commits: `git log -10 --oneline` to see latest changes
4. List current todos from `docs/TODO.md` to understand priorities
5. Check git status to see any uncommitted work
6. Confirm context successfully loaded with summary of project state

## Expected Output

Brief summary including:

- Project name and current phase
- Last 3 features implemented
- Current priorities from TODO
- Any blockers or issues noted
```

Instead of typing out every time: "Read the PRD, then the architecture, then check what changed recently..." - you just call `/prime` and you're done.

### Key Observation

Since the assistant is essentially just a prompt, you can use that prompt as a command. That's the beautiful property of markdown commands - they're portable, human-readable, and you can iteratively improve them.

### Typical Workflow with Commands

Here's what my daily work cycle with Claude Code looks like:

```text
/prime
->
"Based on PRD, what should we build next?"
->
/plan-feature "Add user authentication"
->
[Context Reset - new conversation]
->
/execute plan-auth.md
->
/validate
->
/commit
```

### Benefits of Commandification

- **Consistency** - the same process every time, zero missed steps
- **Zero forgetting** - you don't have to remember the sequence, the command remembers
- **Onboarding** - a new developer on the team gets ready-made commands and is productive immediately
- **Continuous improvement** - commands evolve and get better over time

You literally save **thousands of keystrokes** per year. And more importantly - you save mental energy for things that actually require thinking.

## Context Reset: The Most Important Step You're Not Taking

This sounds counterintuitive: **Always reset the conversation between planning and execution.**

Most developers do this wrong. They plan a feature in a long conversation with Claude Code - reading files, discussing architecture, exploring different approaches. And then, in the same conversation, they immediately start implementing.

The problem? **The context window is cluttered** with the entire exploration process.

### Benefits of Context Reset

During planning, you load TONS of context:

- Reading many files from different parts of the project
- Exploring existing architecture
- Discussing various approaches
- Reviewing similar implementations in the codebase

But during execution, you want:

- **Maximum reasoning space** for the LLM
- **Room for self-validation** - the agent should be able to check its own solutions
- **A clean mental model** - only what's needed to implement this specific feature

### The Right Workflow

```text
[Planning Session]
->
/prime - Load codebase context
->
Conversation: "Based on PRD, let's plan authentication feature"
->
/plan-feature - Output: structured plan as a markdown document
->
[NEW CONVERSATION] <- This is the key!
->
/execute plan-auth.md - The ONLY context is the plan
->
Implementation with full reasoning space
```

### What the Plan Document Contains

The plan must be self-contained - containing EVERYTHING needed for implementation:

```markdown
# Plan: User Authentication Feature

## Feature Description

Implement JWT-based authentication with email/password login.

## User Story

As a user, I want to securely log in to access personalized content.

## Context to Reference

- `src/utils/api.js` - API utility functions
- `src/context/AuthContext.jsx` - existing auth context (modify)
- `docs/reference/api-design.md` - API patterns

## Technical Approach

1. Backend: Create /api/auth/login and /api/auth/register endpoints
2. Frontend: Login form component with validation
3. State: Store JWT token in AuthContext
4. Protected routes: Add authentication middleware

## Task-by-Task Breakdown

### Task 1: Backend Auth Endpoints

- Create `src/api/auth.js` with login and register functions
- Implement JWT token generation
- Add password hashing with bcrypt
- Error handling for invalid credentials

### Task 2: Login Form Component

- Create `src/components/LoginForm.jsx`
- Form validation using Formik
- Connect to auth API
- Handle loading and error states

### Task 3: Auth Context Updates

- Modify `src/context/AuthContext.jsx`
- Add login/logout/register methods
- Persist token to localStorage
- Auto-refresh token logic

### Task 4: Protected Routes

- Create ProtectedRoute component
- Redirect to /login if not authenticated
- Update router configuration

## Testing Requirements

- Unit tests for auth API functions
- Integration tests for login flow
- E2E test: complete registration and login
- Error handling tests: invalid credentials, expired token

## Success Criteria

- User can register with email/password
- User can login and access protected pages
- Token persists across page refreshes
- Logout clears token and redirects to home
```

### Benefits of a Self-Contained Plan

The LLM has **maximum token count** for reasoning during the critical coding phase. There's no contamination from exploratory context. And most importantly - **it forces you to create complete, self-contained plans**.

It's discipline. But discipline that makes your AI coding sessions incomparably more effective.

I've tried it both ways. The difference is enormous. Context reset is the technique I took the longest to learn, but which gave the biggest boost in output quality.

## System Evolution: Every Bug Is a Lesson for the Agent

This is the most important technique of all. And the most commonly overlooked. For me, it was unknown until recently. Perhaps for you too, or you don't realize its significance.

The traditional approach looks like this:

1. The AI agent makes a mistake
2. You fix it manually
3. You move on
4. **The same mistake repeats a week later**

The evolutionary approach:

1. The AI agent makes a mistake
2. You analyze: **What in the system allowed this mistake?**
3. You update rules/commands/process
4. **This class of bugs is eliminated forever**

### The Mindset Shift

Don't fix the bug. **Fix the system that allowed the bug.**

Your AI agent is not a static tool. It's an **evolving system** that can become more powerful with every iteration. But only if you actively improve it.

### Examples of System Evolution

**Scenario 1: Wrong import styles**

```text
Bug: Agent uses require() instead of import in an ES6 project

Analysis: No clear rule about the module system

Fix: Add to CLAUDE.md:
"Always use ES6 import/export syntax.
Never use require() or module.exports."

Result: Never again a problem with import styles
```

**Scenario 2: Forgets to run tests**

```text
Bug: Agent implements a feature without tests

Analysis: No "testing" step in the workflow

Fix: Update the /execute command template:
## Testing Phase
1. Write tests first (TDD when appropriate)
2. Run full test suite: npm test
3. Ensure all tests pass before completion
4. Add test coverage report to plan

Result: Tests become an automatic part of the workflow
```

**Scenario 3: Doesn't understand the auth flow**

```text
Bug: Agent implements incorrect authentication

Analysis: No documentation of the authentication flow

Fix:
1. Create reference/authentication.md with a flow diagram
2. Add to CLAUDE.md:
   "When working on authentication, read reference/authentication.md"

Result: Auth implementations are consistently correct
```

### The Reflection Workflow

After finishing each feature, instead of immediately rushing to the next one:

```markdown
"Hey Claude, I noticed that XYZ wasn't working correctly and I had to fix it.

Let's analyze:

1. Read the commands we used
2. Read the current rules
3. Identify what we can improve so this doesn't repeat
4. Suggest specific changes to rules/commands"
```

Claude Code analyzes the session, finds gaps in the process, and proposes fixes. Sometimes it's a new rule. Sometimes an extra step in a command. Sometimes a new reference document.

### Benefits of System Evolution

- **Your agent gets smarter over time** - reliability grows with every iteration
- **You build institutional knowledge** - the whole team benefits from learning from mistakes
- **Transformation from reactive to proactive** - instead of fighting fires, you prevent them
- **Compound effect** - after 3 months, you have a system that makes fewer mistakes than a junior developer

This is more than a technique. It's a **mindset**. Treat your AI agent's system like production code that requires continuous improvement.

From my own experience, the biggest mistake is ignoring patterns in agent errors. The first time is an accident. The second time is a signal. The third time is your fault for not fixing the system.

## Claude PIV Skeleton: Everything in One Place

Now the best part. All these techniques I've been talking about - PRD-first development, rule modularity, workflow commandification, context reset, system evolution - are already implemented in a ready-to-use framework.

It's called **Claude PIV Skeleton** and is available on GitHub: [https://github.com/plipowczan/claude-piv-skeleton](https://github.com/plipowczan/claude-piv-skeleton) (fork from [galando](https://github.com/galando/claude-piv-skeleton))

### The Problem It Solves

Previously, I used an assistant that generated PRDs and rules for the AI agent, but it required using two different tools. I had to copy output between applications, sync manually, lose context.

Having everything in one place is an **enormous advantage**. And since the assistant is essentially just a prompt, you can use that prompt as a command - and that's exactly what PIV Skeleton does.

### What Is the PIV Methodology

PIV stands for **Prime-Implement-Validate** - a methodology created by [Cole Medin](https://github.com/coleam00) specifically for development with AI assistants:

- **Prime**: Load and understand the codebase context
- **Implement**: Plan features and execute implementation
- **Validate**: Automatically test and verify

This isn't an abstraction. It's a concrete workflow that Cole proved in production projects like [woningscoutje.nl](https://woningscoutje.nl).

### What You Get in claude-piv-skeleton

The repository implements all 5 techniques as a ready-to-use framework:

**Universal methodology** - works with any tech stack (Spring Boot, Node.js, React, Python FastAPI, etc.)

**Modular rules system** - path-based rule loading depending on what you're working on

**Pre-built commands** - a complete set of commands for the entire PIV workflow

**Technology templates** - ready-made configurations for popular stacks

### Repository Structure

```text
.claude/
├── CLAUDE.md                  # Lightweight global rules
├── PIV-METHODOLOGY.md         # Full methodology documentation
├── commands/                  # All workflows as commands
│   ├── piv_loop/              # Core PIV workflow
│   │   ├── prime.md           # Prime phase command
│   │   ├── plan-feature.md    # Planning command
│   │   └── execute.md         # Execution command
│   ├── validation/            # Validation & testing
│   │   ├── validate.md        # Full validation pipeline
│   │   ├── code-review.md     # Technical review
│   │   └── system-review.md   # Process improvement
│   └── bug_fix/               # Bug fix workflow
│       ├── rca.md             # Root cause analysis
│       └── implement-fix.md   # Fix implementation
├── rules/                     # Modular rules by technology
│   ├── 00-general.md          # Universal principles
│   ├── 10-git.md              # Git workflow
│   ├── 20-testing.md          # Testing philosophy
│   └── backend/               # Backend-specific rules
└── reference/                 # Best practices loaded on-demand
    └── patterns/              # Design patterns reference
```

### The Workflow It Enables

Complete development cycle with PIV Skeleton:

```bash
# 1. Prime workspace
"Run /piv_loop:prime to load the project context"

# 2. Plan feature
"Use /piv_loop:plan-feature to create a plan for adding user authentication"

# 3. Execute (automatic context reset!)
"Use /piv_loop:execute to implement the plan"

# 4. Validation runs automatically
# No manual step needed - testing happens in the workflow

# 5. Bug fix with system evolution built in
"Run /bug_fix:rca for issue #123"
"Use /bug_fix:implement-fix to implement the fix"
```

### Benefits of PIV Skeleton

- **You don't have to build from scratch** - ready structure, tested in production
- **Battle-tested patterns** - workflow developed by top AI engineers
- **Community-driven** - contributions from many developers, continuous improvements
- **Extensible** - easy to adapt to your tech stack and needs

PIV Skeleton isn't just code. It's a **system of thinking** about working with AI agents, packaged into a reusable framework.

## How to Start: First Steps

Great, you know the 5 techniques and you know there's a ready framework. But how do you actually put it all into practice?

### Path 1: Use PIV Skeleton (Recommended)

If you're starting a new project or can migrate an existing one:

```bash
# Clone the repository
git clone https://github.com/plipowczan/claude-piv-skeleton.git my-project
cd my-project

# Remove git history to start from a clean slate
rm -rf .git
git init

# Install your tech stack
# (Follow the technology-specific guides in the technologies/ directory)

# Start your first feature
# Open Claude Code and:
```

1. `"Run /piv_loop:prime to load project context"`
2. `"Based on PRD, what should we build first?"`
3. `"Use /piv_loop:plan-feature to plan it"`
4. `"Use /piv_loop:execute to implement"`

And that's it. You have a working system with your first feature in production.

### Path 2: Implement Incrementally

If you have an existing project and don't want to move everything at once, adopt the techniques step by step:

**Week 1: Create a PRD**

- Document the current state of the project
- Define the next features to build
- Make the PRD your north star

**Week 2: Create a Prime Command**

- What context should always be loaded?
- Create a `/prime` command in `.claude/commands/`
- Use it at the start of every session

**Week 3: Modularize Rules**

- Split your CLAUDE.md into global + reference
- Move task-specific rules to `reference/`
- Add a reference section to global rules

**Week 4: Add Feature Workflow**

- Create a `/plan-feature` command
- Practice context reset between planning and execution
- Create an `/execute` command

**Week 5: System Evolution**

- After every bug, do a reflection
- Update rules/commands based on findings
- Track improvements in CHANGELOG

### Key Success Factors

1. **Start small** - Don't try to implement all 5 techniques at once. Begin with the PRD, then add the prime command, etc.
2. **Document as you go** - Write down what works and what doesn't. Your notes will become part of the system evolution.
3. **Iterate on commands** - Your workflows will improve. That's normal. After a month, your `/prime` will be better than at the start.
4. **Be consistent** - Use the system every time. Don't fall back into old habits of "quick fixing" without process.
5. **Share with the team** - If you work in a team, make sure everyone uses the same commands and processes. You multiply the benefits.

### Your First Feature with PIV

A concrete example - let's say you're building a habit tracker and want to add streak tracking:

```text
Session 1 - Planning:
-> /prime
-> "Based on PRD, let's plan streak tracking feature"
-> /plan-feature "Streak tracking - show consecutive days"
-> Plan saved: .claude/agents/plans/streak-tracking.md

[Restart conversation]

Session 2 - Execution:
-> /execute .claude/agents/plans/streak-tracking.md
-> [Implementation happens with tests]
-> /validate
-> All tests pass

Session 3 - Commit:
-> /commit
-> "feat: Add streak tracking with visual indicators"
```

In an hour, you have a feature in production. With tests. With a proper commit message. With everything.

## Key Takeaways

1. **PRD-first development** ensures consistency and direction for all iterations with the AI agent. It's the north star that makes every feature meaningful in the context of the whole.
2. **Rule modularization** protects the context window and loads only needed knowledge. Stop wasting tokens on irrelevant context - load what matters, when it matters.
3. **Workflow commandification** saves thousands of keystrokes and ensures consistency. If you do something more than twice, it should be a command.
4. **Context reset** between planning and execution gives the agent maximum reasoning space. Counterintuitive, but one of the most impactful techniques.
5. **System evolution** turns every bug into a lesson that makes the agent smarter. Don't fix the bug - fix the system that allowed it.
6. **PIV Skeleton** offers a ready implementation of all techniques in one place. You don't have to build from scratch - you can start today.
7. Most importantly: **a systematic approach** vs. reactive prompting is the difference between using 20% and 80% of Claude Code's potential.

### My Experience

When I started building this portfolio with AI assistance, I had no system. Simple prompts, ad-hoc fixes, zero processes. Then I discovered these techniques. And everything changed.

Now my workflow with Claude Code is predictable. Effective. And most importantly - **the agent gets better with every session**, instead of making the same mistakes over and over.

This is a transformation you can have on your team. It requires a mindset shift from "AI is a faster Google" to "AI is an evolving development partner." But if you make that shift? The difference will be enormous.

## FAQ

<details open>
<summary>

### How do I start with PRD-first development if I've never created project documents before?

</summary>

Start with a minimal PRD with four sections: Target Users (who it's for), Mission (what it does), In Scope (MVP features), and Out of Scope (what's for later). You don't need a 50-page document - a simple markdown with key decisions is enough. A PRD for a small project can literally be 20-30 lines and already delivers enormous value as a single source of truth for AI.

</details>

<details open>
<summary>

### Exactly how many rules should I have in the main CLAUDE.md file to avoid overwhelming the LLM context?

</summary>

A maximum of 200 lines in the main CLAUDE.md - tech stack, project structure, basic commands, and links to reference docs. Move all detailed patterns (API design, component patterns, testing) to separate files in a reference folder. Claude Code will automatically load them only when you're working on that area, saving precious context window space.

</details>

<details open>
<summary>

### Does workflow commandification only work with Claude Code, or can I use the same commands with ChatGPT or other LLMs?

</summary>

Commands are plain markdown files with workflow instructions, so they work with any LLM (ChatGPT, Claude, Cursor, Windsurf). The only difference is how you load them - in Claude Code it's slash commands, in ChatGPT you copy the contents as a prompt. The methodology and command structure itself is universal and portable across tools.

</details>

<details open>
<summary>

### Why do I need to reset context between planning and execution instead of doing everything in one session?

</summary>

During planning, you load TONS of exploratory context (reading many files, discussing various approaches), which clutters the LLM's context window. A reset gives the agent a clean slate with maximum reasoning and self-validation space during implementation. It's counterintuitive, but empirically delivers significantly better results - the agent has room for quality checks instead of fighting with an overloaded context.

</details>

<details open>
<summary>

### What exactly makes claude-piv-skeleton different from just using Claude Code without any system?

</summary>

PIV Skeleton is a ready framework with predefined commands (/prime, /plan-feature, /execute, /validate), folder structure (.claude/commands, .claude/agents), document templates (PRD, rules), and a system evolution process. Instead of inventing a workflow from scratch, you get a proven system used by teams in production - you simply fork the repo and have ready-made best practices. It's like the difference between writing your own framework and using Next.js.

</details>

<details open>
<summary>

### How long does it realistically take to implement these 5 techniques in an existing project that's been running for several months?

</summary>

Start small - day 1: create a minimal PRD (1-2h), day 2: lightweight CLAUDE.md + one /prime command (1-2h), week 1: add /plan-feature and /execute (2-3h total). Don't implement everything at once. After 2 weeks of working with the system, you'll see natural places to add more commands and rules. Brownfield projects require about 5-8 hours total setup, but you see the ROI after your very first session with the new workflow.

</details>

---

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <p class="text-2xl md:text-3xl font-bold text-white mb-4">Want to implement AI in your team?</p>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I'll help you build a system for working with AI agents that boosts your team's productivity. From strategy through implementation to training.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Useful Resources

- **[claude-piv-skeleton](https://github.com/plipowczan/claude-piv-skeleton)** - Ready framework implementing the PIV methodology
- **[habit-tracker](https://github.com/coleam00/habit-tracker)** - Original PIV demo project by Cole Medin
- **[context-engineering-intro](https://github.com/coleam00/context-engineering-intro)** - Introduction to context engineering by Cole Medin
- **[Claude Code Documentation](https://claude.ai/code)** - Official Claude Code documentation
