# 🎯 Summary

The video is a fast‑paced masterclass on **Cursor 2.0**—packed with practical shortcuts, workflow patterns, and power‑user habits gathered from training thousands of developers. The creator walks through setup, interface tricks, model selection, context management, rules/commands, debugging, design workflows, worktrees, and agent steering. The core message: **Cursor becomes dramatically more effective when you control context, prime your project intentionally, and combine it with complementary tools like Claude Code and Recraft.**

# ## Highlights

### [00:00:01](#timestamp-00:00:01) **Essential UI shortcuts**

- Cmd/Ctrl +B toggles the sidebar
- Cmd/Ctrl + J toggles the terminal
- Cmd+Shift +B opens the browser
- Ctrl + E switches between editor and agent
- These shortcuts form the “muscle memory” foundation for fast navigation

---

### [00:01:25](#timestamp-01:25) **Initial setup & managing MCPs**

- MCPs are powerful but consume a lot of context
- The recommended workflow: **start with all MCPs off**, enable only when needed
- Keep browser automation on
- Turn on completion sounds so you don’t miss when an agent finishes

---

### [00:02:53](#timestamp-02:53) **Rules & user commands**

- Rules act as automated prompts but can bloat context
- Best practice: **add rules only when a recurring issue appears**
- User commands (e.g., `/package health check`) are reusable across projects
- Commands become a personal toolkit for repeatable tasks

---

### [00:03:41](#timestamp-03:41) **Using Claude Code alongside Cursor**

- Many developers overspend on subscriptions
- The creator uses **Cursor + Claude Code** as a balanced combo
- Claude is strong at agentic reasoning; Cursor excels at code integration

---

### [00:04:17](#timestamp-04:17) **Recraft for design workflows**

- Recraft acts like “Cursor for graphic design”
- Easily convert images to SVG, remove backgrounds, upscale assets
- Useful for quick logo creation and UI assets

---

### [00:05:12](#timestamp-05:12) **Priming your project**

- Every new chat = a fresh model with no memory of your codebase
- Cursor indexes automatically, but you should still:
  - Add docs for frameworks (Next.js, Clerk, Prisma, etc.)
  - Provide URLs or paste relevant documentation
  - Use `/init` in Claude Code when needed
- Updated docs are essential because model cutoffs lag behind package releases

---

### [00:07:52](#timestamp-07:52) **Debugging errors effectively**

- Copy console or terminal errors directly into the chat
- Use the `@browser` context to give the agent full visibility
- Cursor can run Prisma migrations, fix schema issues, and resolve setup errors automatically

---

### [00:09:01](#timestamp-09:01) **Context window management**

- Keep context usage **below 60%** for best performance
- Too much mid‑context content confuses models
- Use natural breaks to start new chats
- Use `/summarize` to carry over only the essentials

---

### [00:15:19](#timestamp-15:19) **Model selection strategy**

- Composer 1: fastest for iteration
- Claude Sonnet 4.5: strong general model
- Opus 4.5: best for planning, expensive—use sparingly
- Workflow: plan with Opus → build with Composer/Sonnet

---

### [00:17:19](#timestamp-17:19) **Design changes with agents & worktrees**

- Use design mode for safe UI prototyping
- Upload inspiration images and specify what to copy (e.g., only colors/fonts)
- Worktrees allow multiple agents/models to attempt the same task in parallel
- Each worktree runs its own dev server on a unique port
- You can compare versions and merge the best one back into main

---

### [00:22:50](#timestamp-22:50) **Agent Review (Cursor 2.0’s built‑in bugbot)**

- Automatically reviews commits for issues
- Useful but not perfect—treat as a helper, not a guarantee
- Fix suggestions can be applied directly via chat

---

### [00:24:01](#timestamp-24:01) **Branching & safe experimentation**

- Always create a new branch before major UI or feature work
- Cursor learns your commit style after a few manual commits
- Use design mode + mock JSON data to prototype interfaces quickly

---

### [00:26:54](#timestamp-26:54) **Building a full feature prototype**

- The video demonstrates building a title‑generation UI
- Includes mock data, favorites, baskets, and psychological drivers
- Encourages iterating with multiple models and merging the best ideas
