---
id: 11
slug: 15-cursor-hacks-ai-productivity
title: "15 Cursor.sh Hacks That Will Change How You Work with AI"
excerpt: "Most users tap into only 20% of Cursor's capabilities. Discover hidden features from basic shortcuts to advanced techniques like worktrees and structured prompting."
category: AI
author: Pawel Lipowczan
date: 2026-01-15
readTime: 17 min
image: /images/og-15-cursor-hacks-produktywnosc-ai.webp
tags:
  - AI
  - Cursor
  - Productivity
  - Developer Tools
  - Claude Code
lang: en
alternateSlug: 15-cursor-hacks-produktywnosc-ai
---

For the first three months, I used Cursor like a regular VS Code with autocomplete. I was paying **$20 a month** so the agent could reply "sure, let me help you with that" and generate code I had to rewrite anyway. Sound familiar?

It wasn't until I started digging into hidden features that I realized most users - myself included - were tapping into **barely 20% of this tool's capabilities**. It's like buying an iPhone and only using it for phone calls.

The problem isn't Cursor. The problem is that **the best features are hidden**, unintuitive, or buried deep in settings. And every day without knowing them is wasted money, a wasted **context window**, and frustration.

In this article, I'll show you **16 hacks** (yes, there's a bonus) that changed the way I work with AI. From basic keyboard shortcuts that'll save you hours of clicking, through advanced techniques like **worktrees** for testing multiple models in parallel, to **structured prompting** that gets 80% of first-iteration code straight to production.

I've split them into three difficulty levels, so you can start with the basics and gradually unlock the next layers. Ready to squeeze 100% out of your Cursor subscription?

## Why It's Worth Knowing Cursor Inside Out

Before we get to the hacks, let's talk about the elephant in the room: **is it really worth going deep on this?**

The **context window** is the most valuable real estate in the AI world. Every time you enable an unnecessary MCP, every time the agent "forgets" what it was doing 20 messages ago, every time you hit the subscription limit mid-sprint - that's not a bug, that's your lack of knowledge about managing this resource.

For **$20 a month** (less than a decent lunch), you can have an expensive autocomplete. Or a **3-5x productivity boost** that pays for itself on the first day of the month. The difference? Knowing the hidden features.

For my first three months, I used Cursor like an amateur. I clicked with the mouse to open the terminal. I sat idle while the agent worked, checking Instagram. I exceeded limits because I wasn't monitoring usage. I wasted time on repetitive prompts because I didn't know about custom commands.

As I discovered more features, I realized Cursor isn't just an editor - it's an **ecosystem of tools**. Which - when used correctly - integrates with Claude Code, worktrees, library documentation, and custom workflows. That gives you an edge others simply don't have.

## Level 1 - Basics (Everyone Should Know These)

These hacks should be known by every Cursor user, regardless of skill level. If you don't know these, you're losing time and money every day.

### Hack 1: Keyboard Shortcuts That Will Save You Hours

For a month, I clicked with the mouse on the terminal. Seriously. Every time I wanted to check output. Then I discovered `Cmd+J` and felt like an idiot.

Keyboard shortcuts are the fastest way to stop fighting the interface and start fighting problems. These basic shortcuts will literally save you **hours of clicking per week**:

```text
Basic shortcuts:
Cmd+B (Ctrl+B) - Sidebar on/off
Cmd+J (Ctrl+J) - Terminal on/off
Cmd+E (Ctrl+E) - Switch to agent
Shift+Tab - Change mode (Ask/Agent/Plan/Debug)
Cmd+/ (Ctrl+/) - Choose model
```

Most importantly: **`Cmd+E`** switches you between the editor and agent instantly. No searching with the cursor, no clicking. You write code -> `Cmd+E` -> give the agent a task -> `Cmd+E` -> back to code.

**`Shift+Tab`** lets you cycle between Ask, Agent, Plan, and Debug modes. Most users click the dropdown. You'll be doing it in a fraction of a second.

Invest 10 minutes to learn these shortcuts. It'll pay off on day one.

Pro tip: You can help yourself with a device like [Stream Deck](https://www.elgato.com/us/en/p/stream-deck). You can create buttons for each mode and use them as keyboard shortcuts. It helps me a lot not just with using shortcuts, but also with learning them.

### Hack 2: Show Subscription Usage - Don't Get Caught Off Guard by the Limit

I once hit the limit mid-week during a sprint. Cursor stopped working. The deadline didn't wait. Never again.

By default, Cursor shows **subscription usage only when you're close to the limit**. That's too late. You can't manage what you can't see.

Solution: enable persistent usage summary display.

```text
Path in settings:
Settings -> Agents -> Usage Summary -> "Always"
```

Now at the bottom of the interface, you always see how many credits you've used. You can **consciously decide** when to use Opus (expensive but brilliant) versus when to switch to Sonnet (fast, cheaper).

Monitor this regularly. When you're approaching **60-70% of your limit** halfway through the month, that's a signal to:

- Switch to lighter models
- Disable unnecessary MCPs (more on this shortly)
- Restart conversations instead of piling on messages

A simple change that could save your entire sprint.

### Hack 3: Enable Completion Sounds - Stop Waiting Idly

How many times have you checked your phone while the agent finished 5 minutes ago? How many times did you switch to Instagram "for a moment" and come back after 15 minutes? Too many.

The problem isn't you. The problem is that **Cursor doesn't tell you when it's done**. You sit, wait, stare. Or do something else and lose momentum.

Solution: enable **completion sound**.

```text
Settings -> General -> Completion sound (enable)
```

Now when the agent finishes a task, you'll hear a subtle sound. You can check documentation, write notes, even make coffee - and you'll come back exactly when Cursor is ready.

This sounds like a detail, but in practice **it changes how you work**. Instead of idly waiting, you use the time. Instead of switching to distractions (Instagram, Twitter), you stay in flow.

Small change, huge difference in productivity.

### Hack 4: Early Access - Get New Features Months Earlier

Custom modes appeared in **Early Access** 2 months before the official version. During that time, users who knew about this option had access to features others hadn't even heard of.

Most users sit on the default version of Cursor. They wait months for new features that are already available - just hidden behind a single toggle.

```text
Settings -> Beta -> Update Access -> Early Access
```

Available options:

- **Default** - stable version, delayed updates
- **Early Access** - new features months earlier, usually stable
- **Nightly** - for developers, can be buggy

From my experience, **Early Access is the best option**. You get new features significantly earlier, and stability is perfect in 95% of cases. The only risk is an occasional bug - which is usually fixed within days.

Why don't most people know about this? Because it's hidden in Beta settings. Because Cursor doesn't advertise it. Because it assumes you're happy with defaults.

Don't be happy with defaults. Switch to Early Access and stay one step ahead.

### Hack 5: Multiple Windows - Work on Two Projects Simultaneously

This isn't a groundbreaking hack - most editors have this feature. But many people don't realize they can have **multiple projects open simultaneously** with independent AI conversations.

**File -> New Window** opens a new Cursor instance. Each with its own project, its own agent, its own context window.

**Use cases:**

- Reference an old project while building a new one
- Copy a pattern from one project to another without context-switching
- Work on multiple clients simultaneously
- Compare implementations between projects

**Note:** Each window = a separate memory instance. If you have **8GB RAM**, two windows might already be pushing it. With **16GB+**, you can comfortably open 3-4 projects.

It doesn't make as much difference as worktrees (more on that later). But it's useful when working on multiple projects. Especially when you want to **copy a pattern** from one project to another without context-switching and losing the thread of your agent conversation.

Simple, effective, underrated.

## Level 2 - Intermediate

This is where the magic begins. These techniques separate those who know Cursor from those who've **mastered** it.

### Hack 6: Manage MCPs - Don't Waste the Context Window

I once had **6 MCPs enabled** simultaneously. The context window burned out in 10 messages. The agent "forgot" what we were working on at the start. I had to restart every 15 minutes.

**MCPs** (Model Context Protocols) are integrations that extend the agent's capabilities. Browser automation, terminal access, file operations - each MCP adds new superpowers.

The problem? **Each active MCP eats a huge chunk of the context window**. Even when you're not using it. Just by being present.

Strategy:

```text
Recommended MCP setup:
Browser Automation (often useful)
All others (enable only when needed)

Path: Settings -> Tools & MCP -> [MCP Name] (disable)
```

**Default approach (wrong):** Enable all MCPs "just in case." Have the full toolkit.

**Pro approach:** **Disable all** at the start of a project. Enable specific MCPs only when you actually need them. The agent will tell you when it needs something.

Practically the only MCP I always leave on is **Browser Automation** - because I frequently work with UI testing and automation. Everything else? I enable on-demand.

This shift in approach **increased the length of my agent conversations by 2-3x**. Fewer restarts, better context memory, smoother flow.

### Hack 7: Custom Commands - Stop Repeating the Same Prompts

I have **8 custom commands**. The ones I use most are `/prime` (loads project context) and `/package-health` (checks dependencies). Before, I'd type the same prompts manually. Now? Two characters.

**Slash commands** are reusable prompt templates. Write once, use hundreds of times.

**How to create one:**

1. Type `/` in the agent
2. Select **"Create command"**
3. Write the prompt template
4. Save in `.cursor/commands/` or `.claude/commands/`

Example:

```bash
# Example custom command: Package Health Check
# File: .cursor/commands/package-health.md

Scan node_modules and package.json for:
- Security vulnerabilities
- Outdated dependencies
- Breaking changes in recent versions
Report findings with severity levels.
```

Now you type `/package-health` and the agent knows exactly what to do. No explanations, no context - it runs the routine inspection on its own.

**Pro tip:** You can **import commands from Claude Code**.

```text
Settings -> Rules and Commands -> Import Claude commands
```

Claude Code has ready-made commands you can adapt. Don't reinvent the wheel.

**When to create a command?** If you do something more than 2x, instead of copying the prompt - create a command. Simple. Effective. Game-changing.

### Hack 8: Context Management - The 60% Rule

Above **60% context window fill**, the agent starts "forgetting" earlier instructions. This isn't a subjective impression - it's empirically verified.

AI remembers **the beginning and end** of a conversation well. It poorly remembers **the middle**. This is the so-called "lost in the middle" problem.

Cursor shows a **context window indicator** below the message text field, next to the agent options. Monitor it like a hawk:

```text
Context management strategy:
< 40% - Continue freely
40-60% - Look for a natural breakpoint
> 60% - Consider restart (new conversation)
> 80% - Definitely restart
```

**Natural breakpoint** is the moment when:

- You've finished a feature and committed
- You're switching to a different area of the project
- The agent completed a task and is "ready" for a new challenge

**Two restart strategies:**

1. **Summary approach:** Ask the agent for a conversation summary, copy to new one. Good when you have complex context you want to carry over.
2. **Fresh start:** Simply start a new conversation. Good when context was specific to one task and won't be needed.

I mainly use **fresh start**. Less overhead, clean mind, agent without baggage from the past.

Remember: **60% is a soft limit**. You can go higher, but response quality starts dropping. 80% is a hard limit - beyond that, everything falls apart.

### Hack 9: Index Documentation - Full Library Knowledge in Cursor

**Tailwind CSS v4** came out a few months ago. The agent kept confusing syntax, suggesting outdated classes. Maximum frustration.

I indexed the official Tailwind v4 documentation in Cursor. Problem solved. The agent knew the new syntax better than I did.

**Adding documentation:**

```text
1. Find the official docs URL (e.g., https://tailwindcss.com/docs)
2. Settings -> Indexing and Docs -> Add Doc
3. Paste URL -> Confirm
4. Use: @ -> Docs -> [Library name]
```

Cursor **scrapes and indexes the entire documentation**. Example: Tailwind docs are **439 pages** the agent has in memory. Every time you use `@ Docs -> Tailwind CSS`, the agent has access to the full, current documentation.

**Why this makes a difference:**

- **Cutoff window problem solved:** The agent isn't limited to knowledge from before January 2025
- **Current API:** New frameworks, new library versions - the agent knows the current syntax
- **Zero hallucinations:** Instead of "inventing" API, it reads from official documentation

**Pro tip:** Index the documentation for libraries you use regularly. For me, that's:

- Tailwind CSS
- React (especially new hooks)
- Convex
- Framer Motion

The agent stops being "generic AI" and becomes **an expert in your stack**.

### Hack 10: Agent Steering - Take Control on the Fly

Imagine: the agent is writing a component. Halfway through, you realize you want to add another function. Wait until it finishes? Interrupt and start over?

There are better options.

**Agent steering** is the ability to send messages while the agent is working. You either wait until it finishes or interrupt immediately.

**Where to find it:**

```text
Setting location:
Agent pane -> ... (three dots) -> Agent Settings -> Queue Messages

Available options:
1. Send after current message
   -> Agent finishes the current task, then executes the new one
   -> Ideal for queuing tasks

2. Stop & send right away
   -> Immediate interruption and new task
   -> Use when the work direction needs to change
```

I use **"Send after current message"** **most often**. The agent finishes the current task (e.g., a component), then automatically moves to the next one on the list (e.g., tests for that component). Efficient queuing without micro-management.

I use **"Stop & send right away"** **only** when:

- The agent went in the wrong direction and every second is wasted
- Requirements changed and the current task no longer makes sense
- I need an immediate answer to a question

**Caveat:** Overusing "Stop & send" causes chaos. The agent gets confused on context. Frustration rises. Use sparingly and only when you really need to change direction.

**Pro workflow:** Plan a list of tasks. Send the first one normally. Queue the rest via "Send after current message." The agent works through tasks like a machine, and you can switch to something else.

## Level 3 - Pro Features

These are features most users don't know exist. But professionals use them **daily**.

### Hack 11: Worktrees - Test Multiple Solutions in Parallel

**Worktrees** is a feature that sounds complicated but changes everything. It lets you **test 3 different approaches simultaneously** without waiting for sequential iterations.

**What are worktrees:**

**Git worktrees** are isolated copies of a project on separate branches. Cursor uses this mechanism for parallel testing of multiple solutions. Each version works in its own code copy, without conflicts. When done, you pick the best solution and bring it to the main branch.

**How it works step by step:**

1. **Start:** Open a chat with the agent in Cursor
2. **Choose mode:** Below the text field, you see options: **Local / Worktree / Cloud** - choose **Worktree**
3. **Choose model:** Click the model selection field
4. **Multiple models or multiplier:** Now you have two options:
   - **Multiple models:** Check "use multiple models" and select different models (e.g., Composer + Sonnet + GPT-4o)
   - **Multiplier:** Select one model and set a 2x, 3x, or 4x multiplier (e.g., 3x Claude Sonnet - you'll get 3 different versions from the same model)
5. **Automatic setup:** Cursor creates a git worktree for each version, copies the project, starts servers on separate ports
6. **Parallel work:** All versions work simultaneously on the same task
7. **Preview:** Check results on different ports (localhost:3001, 3002, 3003)
8. **Apply:** Choose the best solution -> Apply -> changes go to the main branch

**Setup trick - autostart servers:**

```json
// .cursor/worktrees.json - automatic setup
// Place in the project root directory
{
  "commands": [
    "npm install", // Installs dependencies in worktree
    "npm run dev" // Starts dev server automatically
  ]
}
```

**Practical workflow:**

```bash
# Practical example of using worktrees:

# 1. You have a task: "Add dark mode toggle with smooth transition"
# 2. Chat with agent -> choose "Worktree" (instead of Local/Cloud)
# 3. Click model selection -> check "use multiple models"
# 4. Select: Composer + Sonnet + GPT-4o (or set 3x Sonnet for variety)
# 5. Cursor automatically:
#    - Creates branch-wt-composer-xyz
#    - Creates branch-wt-sonnet-abc
#    - Creates branch-wt-gpt4o-def
#    - Runs npm install + npm run dev in each
# 6. After 2-3 minutes you have 3 working versions:
#    - localhost:3001 (Composer) - minimalist toggle
#    - localhost:3002 (Sonnet) - animated slider with icons
#    - localhost:3003 (GPT-4o) - toggle with color preview
# 7. Open all 3 in the browser, compare
# 8. Sonnet looks best -> Review changes -> Apply
# 9. Changes go to main branch, worktrees are cleaned up
```

**Why this makes a difference:**

- **Design choices:** 3 models = 3 different visual approaches, pick the best
- **Refactoring:** different implementation strategies, compare code quality
- **Bug fixes:** see which approach is most elegant
- **Zero wasted time:** Without worktrees, you'd wait 15 minutes for 3 iterations. With worktrees? 5 minutes and all versions at once.

**Real use case from my workflow:**

Design changes - I run 3 models simultaneously. In 5 minutes, I see 3 different visual approaches. Without worktrees, I'd wait 15 minutes for sequential iterations, and each subsequent one would be "contaminated" by feedback from the previous one.

**When NOT to use worktrees:**

- Simple bugfixes (overkill)
- Clear requirements (one model is enough)
- Limited credits (3 models = 3x cost)

Worktrees are a bazooka. Use it only when you need a bazooka.

### Hack 12: Two-Model Workflow - GPT-5.2 Plans, Claude Executes

**GPT-5.2 High** is the best model for planning. It creates detailed, well-thought-out plans that account for edge cases and architecture.

There's just one problem: it's **slow as hell** at implementation.

**Claude Sonnet** is fast at coding. Decent at planning, but not at GPT-5 level.

The solution? **Use both**.

```text
Optimal workflow:
1. Plan Mode -> GPT-5.2 High (plan)
2. After the plan: Switch model -> Claude 4.5 Sonnet
3. Click "Build"
Result: Best plan + fast implementation
```

**How it works:**

1. Give the task in **Plan Mode**
2. Choose **GPT-5.2 High** as the model
3. Wait (yes, it takes a while) for GPT to create a detailed plan
4. **BEFORE clicking "Build"** - switch the model to **Claude 4.5 Sonnet**
5. Now click "Build"
6. Claude implements GPT's plan - quickly and efficiently

**Result:** You get **GPT's planning precision** + **Claude's implementation speed**. This trick saves me **70% of the time** compared to using GPT alone for the build, or Claude alone for the plan.

**Caveat:** GPT-5.2 burns through credits. Use this technique for **larger features**, not micro-tasks. For simple things, Claude alone is sufficient.

This is the best example that **choosing a model doesn't have to be an "either/or" decision**. You can combine the strengths of different models in a single workflow.

### Hack 13: Structured Prompting - User Stories and Design Patterns

**Problem:** Most developers write prompts ad-hoc. "Add login." "Fix this bug." "Make it prettier." The agent gets vague requirements and generates generic code.

Before I discovered structured prompting, **50% of first iterations with AI were throwaway**. The code technically worked but didn't meet requirements. Because the requirements were unclear.

**Solution:** Structure prompts using patterns AI models are trained on - **user stories** and **design patterns**.

**User Story Format (for feature development):**

```text
As a [user type]
I want [goal/desire]
So that [benefit/value]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

Technical Context:
- Existing components: [list]
- Design system: [colors, spacing]
- Similar implementations: [reference files]
```

**Why this works:**

- AI models are **trained on user stories** from GitHub/Jira - it's their native language
- The format **forces clarity of requirements** - you can't be vague
- **Acceptance criteria = built-in testing checklist** - the agent knows when it's done
- **Technical context eliminates hallucinations** - the agent references existing code

**Design Pattern Prompts (for architecture):**

```text
I need to implement [feature] using [pattern name] pattern.

Pattern Structure:
- Component A: [responsibility]
- Component B: [responsibility]
- Communication: [how they interact]

Constraints:
- Must work with existing [X]
- Performance requirement: [Y]
- Should follow project convention: [Z]

References in codebase:
- Similar pattern used in: [file path]
```

**Real Examples - Bad vs Good:**

**Bad prompt:**

```text
Add user authentication
```

**Good prompt (user story):**

```text
As a returning user
I want to log in with email/password
So that I can access my saved preferences

Acceptance Criteria:
- [ ] Login form with email + password fields
- [ ] Form validation (email format, password min 8 chars)
- [ ] Error handling for invalid credentials
- [ ] Success: redirect to dashboard
- [ ] Failure: show error message, keep user on page

Technical Context:
- Auth provider: Clerk (already configured)
- Similar form: src/components/ContactForm.jsx
- Design system: Tailwind with dark-800 backgrounds
- State management: React Context in src/context/AuthContext.jsx
```

See the difference? The **bad prompt** is a guessing game. The agent has to assume 10 things. The **good prompt** is an instruction manual. The agent knows exactly what to do, how, and what "done" means.

Now **80% of first-iteration code goes to production**. Not because AI got better. Because I got better at communicating with AI.

**Bonus trick - Image-to-code prompts:**

```text
[Attach screenshot/mockup]

Recreate this design with following specifications:
- Framework: React + Tailwind
- Components to extract: [list]
- Interactive elements: [behaviors]
- Responsive breakpoints: mobile (< 768px), desktop (>= 768px)
- Color palette: [specify if different from image]

DO NOT: [list of things to avoid]
```

The agent gets a visual reference + technical context. Result? Pixel-perfect implementation on the first try.

**When to use structured prompting:**

- New features (user stories)
- Refactoring (design patterns)
- Design implementation (image-to-code)
- Simple bugfixes (overkill)
- Exploratory tasks (too much structure stifles creativity)

### Hack 14: @ Command Power Features - Context at Your Fingertips

Instead of describing in words "that file with auth," I type `@ -> Files -> AuthContext.jsx` and the agent immediately has full context. Zero friction.

The **@ command** is a quick way to add context to the agent. No copy-pasting code, no describing - just point.

**Available options:**

```text
@ command - available options:

1. Files & Folders
   -> Add specific files to context
   -> Example: @ Files -> src/components/Header.jsx

2. Docs
   -> Indexed library documentation
   -> Example: @ Docs -> Tailwind CSS

3. Terminals
   -> Terminal output (errors, logs)
   -> Useful for debugging

4. Branch (Diff with main)
   -> Differences between branches
   -> See what changed in the feature branch
   -> Example: "What did I add in this branch?"

5. Browser
   -> Content of open pages
   -> Design inspiration, online documentation

All options can be combined for full context!
```

**Use cases:**

- **Files:** "Check this file before suggesting changes" -> `@ Files -> auth.js`
- **Docs:** "Use official Tailwind v4 documentation" -> `@ Docs -> Tailwind CSS`
- **Branch:** "Show what changed from the main branch" -> `@ Branch (Diff with main)`
- **Browser:** "Implement the design from this page" -> `@ Browser`

**Pro tip:** You can add **multiple contexts at once**:

"Implement authentication flow similar to auth.js, using Clerk docs, based on the changes in current branch"

`@ Files -> auth.js` + `@ Docs -> Clerk` + `@ Branch`

The agent has the **full picture**. It doesn't guess, doesn't hallucinate. It simply implements according to what it sees.

### Hack 15: Duplicate - Clone Well-Prepared Context

For **a year**, I used Cursor and didn't know this existed. Hidden deep in the agent management view.

**Use case:** You spent 30 minutes "priming" the agent. You loaded docs, rules, project context. The agent understands the codebase perfectly. Now you want to implement **3 related features** with the same foundation.

Option A: Re-prime the agent 3 times. 90 minutes wasted.

Option B: **Duplicate**. 3 clicks.

**Where to find it:**

```text
Workflow with duplicate:
1. Prime agent: load docs, rules, project context
2. When the agent understands the codebase well
3. Go to the agent management view (list of all agents)
4. Find the agent you want to clone
5. Click ... (three dots) next to that agent
6. Select "Duplicate"
7. New agent with identical context
8. Implement the next feature without repeating the priming

Warning: If duplicate doesn't work: restart Cursor
```

**NOTE:** You will NOT find this option in the `...` menu directly in the agent pane during a conversation. You need to go to the **agent management view** (list of all agents in the sidebar).

### BONUS Hack 16: .cursorignore Manipulation - Dangerous but Useful

**WARNING: Use ONLY in a test environment. NEVER in production.**

`.cursorignore` controls what AI can see. By default, it blocks `.env` and `.env.local` files for security. And rightly so - **you don't want** API keys ending up in an AI conversation.

But sometimes - in a **test repo with dummy credentials** - you want the agent to **validate the environment variable setup**.

**The hack:**

```bash
# .cursorignore file
# WARNING: Use ONLY in a test environment

# Default (safe):
.env
.env.local

# Hack - unblocking (FOR TESTS ONLY):
!.env.local

# Allows AI to see environment variables
# Use only with dummy/test credentials!
```

The `!` prefix negates the rule. The agent can now see `.env.local`.

**Use case:** The agent can check if you have all the necessary variables, if the names are correct, if the values have the right format (of course, it doesn't see actual production values - because this is a TEST REPO).

**Personal warning:** Never do this in production. Only in a test repo where keys are dummy. If in doubt - **don't do it at all**.

I'm showing this hack for completeness. But use it with caution.

## Bonus Tips - Quick Pointers

These didn't make the Top 15, but I use them regularly:

- **Split terminals:** Hover over the terminal, click the split icon. Two terminals side by side - e.g., one for the dev server, another for git commands.
- **Auto theme switching:** Editor Settings -> Auto detect color scheme. Cursor switches between light/dark theme with your system. Small detail, but convenient.
- **Generate cursor rules from docs:** A slash command that extracts rules directly from project documentation. Instead of writing manually, the agent builds `.cursorrules` from the README and CONTRIBUTING.
- **Design mode for prototyping:** A custom command that tells the agent to use only mock data. Perfect for prototyping UI without backend infrastructure.
- **Agent review:** Automated code review on commit. The agent checks code before committing and flags potential issues. Works like a pre-commit hook with AI.

Each of these tricks saves a few minutes daily. Combined - hours per week.

## Key Takeaways

After going through all 16 hacks, time to summarize what truly matters:

1. **Keyboard shortcuts save hours** - `Cmd+J`, `Cmd+E`, `Shift+Tab` are the absolute basics. Stop clicking, start using the keyboard.
2. **The context window is a precious resource** - Manage MCPs, restart conversations after 60%, be aware of costs. Every unused message is wasted money.
3. **Custom commands eliminate repetition** - If you do something more than 2x, create a command. Simple as that.
4. **Documentation in Cursor = superpowers** - Index the libraries you use. The agent stops guessing and starts **knowing**.
5. **Structure prompts like professionals** - User stories and design patterns = 80% of first-iteration code to production. The biggest change in my workflow.
6. **Advanced features aren't intuitive** - Worktrees, structured prompting, duplicate chat are **hidden** but game-changing. You have to consciously seek them out.
7. **Subscription ROI grows with knowledge** - **$20/month** is little or a lot depending on how you use it. After applying these hacks, the return shows up on the first day of the month.

## Next Steps

Don't try to implement everything at once. That's a path to failure. Instead:

**Today (10 minutes):**

- Enable **usage summary** (Settings -> Chat -> Always)
- Enable **early access** (Settings -> Beta)
- Enable **completion sounds** (Settings -> General)

**This week (1 hour):**

- Learn the shortcuts: `Cmd+J`, `Cmd+E`, `Shift+Tab`
- Check which **MCPs** you have enabled, disable unnecessary ones
- Start monitoring the **context window** - restart after 60%

**This month (3-4 hours):**

- Create your first **custom command** for a repetitive task
- Index the documentation for your stack's main library
- Start structuring prompts in the **user story** format

**Next month (experiment):**

- Try **worktrees** on your next design decision
- Test the **two-model workflow** (GPT plan + Claude build)
- Dive into **advanced prompt patterns**

These hacks changed the way I work with AI. I started from the basics and gradually discovered deeper layers. **You can travel this path faster** - because you have this guide.

Good luck. And remember - **$20 a month** is an investment, not an expense. Provided you know how to use it.

---

<div class="mt-10 mb-14 p-6 md:p-8 rounded-xl bg-dark-800/50 backdrop-blur-md border border-white/10 hover:border-primary-500/30 transition-all duration-300 text-center">
  <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">
    Want to maximize AI in your coding workflow?
  </h3>
  <p class="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
    I'll help you optimize your workflow with AI coding assistants, build custom automation, and train your team. From strategy through implementation to advanced techniques.
  </p>
  <a href="/#contact" class="btn-primary inline-block">Book a free consultation</a>
</div>

## Useful Resources

- [Cursor Documentation](https://cursor.com/docs) - Official documentation
- [5 Techniques for Working with Claude Code](/blog/5-technik-pracy-z-claude-code) - Complementary article on Claude Code
- [Cursor Community Discord](https://discord.gg/cursor) - User community
- [GitHub: claude-piv-skeleton](https://github.com/plipowczan/claude-piv-skeleton) - Workflow methodology with custom commands

## FAQ

<details open>
<summary>

### Is the $20/month Cursor subscription worth it for beginner developers, and how quickly does it pay for itself?

</summary>

Yes, the subscription pays for itself quickly thanks to access to Pro features like worktrees, unlimited Claude 3.5 Sonnet, and Composer mode. Even beginners save hours per week by avoiding manual debugging and writing boilerplate code. The $20 cost is an investment in productivity, not just a tool expense.

</details>

<details open>
<summary>

### What are the most important Cursor keyboard shortcuts for maintaining flow when working with AI?

</summary>

The absolute minimum is `Cmd+E` for switching between code and the agent, and `Shift+Tab` for quickly changing modes (Ask/Agent/Plan). It's also worth using `Cmd+J` for toggling the terminal, which eliminates taking your hands off the keyboard. These shortcuts let you treat AI as a natural extension of the editor.

</details>

<details open>
<summary>

### How do you effectively manage the context window limit in Cursor to avoid agent memory issues?

</summary>

The key is monitoring the usage indicator and resetting the chat after exceeding 60% capacity, which prevents model hallucinations. You should also disable unused MCPs in settings, since each active add-on consumes precious tokens. Using `@Files` precisely instead of entire folders also saves context.

</details>

<details open>
<summary>

### What is working with worktrees in Cursor and when is it best applied?

</summary>

Worktrees enable parallel generation and testing of multiple code variants (e.g., by different AI models) on isolated branches. Cursor automatically sets up environments for each version, letting you compare, say, three UI approaches in minutes. It's the ideal tool for experimentation and architectural decision-making.

</details>

<details open>
<summary>

### Why is it worth adding custom documentation to Cursor's index instead of relying on the model's general knowledge?

</summary>

AI models often have outdated knowledge about the latest library versions (e.g., Tailwind v4), leading to incorrect code generation. Adding documentation URLs in "Docs" ensures the agent uses a "single source of truth" and doesn't invent non-existent functions. This eliminates the "cutoff date" problem and improves generated code quality.

</details>
